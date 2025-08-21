"use strict";

// === DynamoDBとOpenAIのライブラリ読み込み ===
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const { OpenAI } = require("openai");

// === DynamoClient 初期化（共通で使えるようにする） ===
const db = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "ap-northeast-1" })
);

// === 月別サマリー処理 ===
async function handleMonthlySummary(client, replyToken, userId) {
  try {
    // 現在の年月を YYYY-MM 形式で取得
    const now = new Date();
    const yyyymm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;

    // === .envから口座IDとAPIトークン取得 ===
    const accountId = process.env.OSHIKATSU_ACCOUNT_ID; // 子口座
    const parentAccountId = process.env.PARENT_ACCOUNT_ID; // 親口座
    const API_URL =
      "https://api.sunabar.gmo-aozora.com/personal/v1/accounts/balances";
    const token = process.env.sunabarToken;

    // === 今の残高を取得（sunabar） ===
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json;charset=UTF-8",
        "Content-Type": "application/json;charset=UTF-8",
        "x-access-token": token,
      },
    });

    if (!response.ok) {
      throw new Error(`API status: ${response.status}`);
    }
    // === データ取得 ===
    const data = await response.json();

    // === 子口座（推し活口座）の残高取得 ===

    // data.spAccountBalances（残高確認API）配列から推し活口座IDに一致する口座を探して残高取得
    // Array.isArray(x) は、引数 x が配列（Array）なら true を返し、それ以外は false
    if (!Array.isArray(data.spAccountBalances)) {
      throw new Error("サブ口座情報が返ってきませんでした");
    }
    const subAcct = data.spAccountBalances.find(
      (item) => item.accountId === accountId
    );
    if (!subAcct) {
      throw new Error(`推し活口座ID ${accountId} が見つかりません`);
    }
    const childBalance = Number(subAcct.odBalance);
    if (Number.isNaN(childBalance)) {
      throw new Error("推し活口座が読み取れない〜");
    }
    console.log("推し活口座残高取得成功:", childBalance);

    // === 親口座の残高取得 ===
    const parentAcct = data.spAccountBalances.find(
      (item) => item.accountId === parentAccountId
    );
    if (!parentAcct) {
      throw new Error(`親口座ID ${parentAccountId} が見つかりません`);
    }

    const parentBalance = Number(parentAcct.odBalance);
    if (Number.isNaN(parentBalance)) {
      throw new Error("親口座の残高が読み取れませんでした");
    }

    console.log("親口座残高取得成功:", parentBalance);

    // === DynamoDB から月初の残高と予算を取得 ===
    const { Item } = await db.send(
      new GetCommand({
        TableName: "budgets",
        Key: {
          userId: userId.trim(),
          month: yyyymm,
        },
      })
    );
    console.log("DynamoDB取得成功:", Item);

    // === 文字列／数値どちらでも対応できるように raw 値を取得 ===
    if (!Item) {
      await client.replyMessage(replyToken, {
        type: "text",
        text: "あら〜、予算がまだ未登録ですって！？推し活はノープランじゃ迷子になるわよ！まずは『今月の予算』をちゃちゃっと設定しときましょ！",
      });
      return { statusCode: 200, body: "OK" };
    }

    const rawAmt = Item.amount;
    if (isNaN(Number(rawAmt))) {
      // 値が壊れてる系のエラー
      throw new Error("DynamoDBの残高か設定予算が数値変換できませんでした");
    }
    const budget = Number(rawAmt);

    // === expensesテーブルから今月の出金合計を集計 ===
    const expensesData = await db.send(
      new QueryCommand({
        TableName: "expenses",
        KeyConditionExpression: "userId = :uid AND begins_with(#ts, :month)",
        ExpressionAttributeNames: {
          "#ts": "timestamp",
        },
        ExpressionAttributeValues: {
          ":uid": userId,
          ":month": yyyymm, // 例: "2025-06"
        },
      })
    );

    const spent =
      expensesData.Items?.reduce((sum, item) => sum + Number(item.amount), 0) ??
      0;
    console.log("OpenAIへ送信する内容:", { budget, spent });

    // === OpenAI APIでコメント作成 ===
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "あなたは「推し活お小言マネージャー」です。財布管理にうるさいけど、愛情たっぷり＆ユーモア多めで、推し活の視点からユーザーに短く、テンポよくツッコミを入れながら返答してください。自己紹介や長い説明は控えめに。LINEトークっぽく、フレンドリーに、冗談やツッコミも交えて！",
        },
        {
          role: "user",
          content: `今月の予算は${budget}円、支出は${spent}円です。推し活マネージャーとしてどう思う？`,
        },
      ],
      max_tokens: 150,
    });

    const aiComment =
      aiRes.choices?.[0]?.message?.content?.slice(0, 200) ??
      "（推し活お小言マネージャーはおやすみ中のようです）";
    console.log("AI返信:", aiRes);

    // === ユーザーへ送るメッセージ ===
    const resMessage = `今月のまとめ\n推し活口座残高：${childBalance.toLocaleString()}円\n親口座残高：${parentBalance.toLocaleString()}円\n出金：${spent.toLocaleString()}円\n予算：${budget.toLocaleString()}円\n\n${aiComment}`;

    // === LINEに返信 ===
    await client.replyMessage(replyToken, {
      type: "text",
      text: resMessage,
    });
    return { statusCode: 200, body: "OK" };
  } catch (error) {
    console.error("今月どう？ 処理エラー:", error);
    await client.replyMessage(replyToken, {
      type: "text",
      text: "今月の推し活チェック、ちょっと不調みたい💦ごめんね、時間をおいてもう一度トライしてみて！推しのためにも、ちゃんと把握しとくのよ👀✨？",
    });

    return { statusCode: 200, body: "NG" };
  }
}

module.exports = { handleMonthlySummary };
