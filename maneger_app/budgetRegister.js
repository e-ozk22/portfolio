// 月予算登録

/**
 * budgetRegister.js
 * ──────────────────────────────────────────────────────────
 * 予算コマンド（例: 「予算 10000」）を処理して
 * DynamoDB の `budgets` テーブルに登録／更新します。
 *
 * 依存:
 *   npm i @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
 *
 * 使い方（例: ルーター側から）
 *   const { handleBudgetRegister } = require("./budgetRegister");
 *   const reply = await handleBudgetRegister(userId, text, getSunabarBalance);
 *   await client.replyMessage(replyToken, { type: "text", text: reply });
 * ──────────────────────────────────────────────────────────
 */
"use strict";

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");
const line = require("@line/bot-sdk");

const TABLE_NAME = process.env.BUDGETS_TABLE || "budgets"; // ←環境変数優先
const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient({}));

/** `YYYY-MM` 形式で当月を返す */
const monthKey = (d = new Date()) => d.toISOString().slice(0, 7);

/** `YYYY-MM` 形式で先月を返す */
const lastMonthKey = (d = new Date()) => {
  const lastMonth = new Date(d);
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  return lastMonth.toISOString().slice(0, 7);
};

/** 既存レコード取得 */
async function getBudget(userId, month = monthKey()) {
  const { Item } = await ddbDoc.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { userId, month },
    })
  );
  return Item ?? null;
}

/** 先月の残高データを取得 */
async function getLastMonthBalance(userId) {
  const lastMonth = lastMonthKey();
  const lastMonthData = await getBudget(userId, lastMonth);
  return lastMonthData
    ? {
        month: lastMonth,
        startBalance: lastMonthData.startBalance,
        budget: lastMonthData.budget,
      }
    : null;
}

/**
 * 予算レコードを新規登録／更新
 *  - 新規: createdAt と updatedAt を同時にセット
 *  - 更新: createdAt は保持し、updatedAt のみ更新
 */
async function putBudget(userId, month, amount, startBalance) {
  const now = new Date().toISOString();
  const exists = await getBudget(userId, month);

  if (!exists) {
    // ---------- 新規 ----------
    await ddbDoc.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          userId,
          month,
          amount,
          startBalance,
          createdAt: now,
          updatedAt: now,
        },
      })
    );
  } else {
    // ---------- 更新 ----------
      // 既存レコードのstartBalanceをfallbackにする
      const updateStartBalance =
        typeof startBalance !== "undefined" && startBalance !== null
          ? startBalance
          : exists.startBalance; // ← 既存値を使う

        await ddbDoc.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { userId, month },
        UpdateExpression:
          "SET #amount = :a, #startBalance = :s, #updatedAt = :u",
        ExpressionAttributeNames: {
          "#amount": "amount",
          "#startBalance": "startBalance",
          "#updatedAt": "updatedAt",
        },
        ExpressionAttributeValues: {
          ":a": amount,
          ":s": updateStartBalance,
          ":u": now,
        },
      })
    );
  }
}

/**
 * LINE から来た「予算 10000」メッセージを処理して
 *   1) Sunabar 残高を取得 → startBalance として保存
 *   2) DynamoDB へ登録／更新
 *   3) ユーザーに返すテキストを返却
 *
 * @param {string} userId  LINE userId
 * @param {string} text    例: "予算 10000"
 * @param {function} getSunabarBalanceFn  例: () => ({ balance: 12345 })
 * @returns {string} 返信メッセージ
 */
async function handleBudgetRegister(userId, text, getSunabarBalanceFn) {
  const m = text.match(/予算\s?(\d+)/);
  if (!m) throw new Error("Invalid budget command format");

  const amount = Number(m[1]);
  if (Number.isNaN(amount) || amount <= 0)
    throw new Error("Budget must be a positive number");

  const { balance: startBalance } = await getSunabarBalanceFn();
  const month = monthKey();

  await putBudget(userId, month, amount, startBalance);

  return `月予算 ¥${amount.toLocaleString()} を設定しました`;
}


async function handleEvent(event, getSunabarBalanceFn, session) {
  if (!session) session = {};
  const userId = event.source.userId;
  const text = event.message.text;

  // 1. 「予算」発話で金額入力を促す
  if (text === "予算") {
    session[userId] = { waitingForBudget: true };
    return {
      type: "text",
      text: "予算はいくらにしますか？",
    };
  }
  // 2. 金額入力待ち状態なら金額をパース
  if (session[userId]?.waitingForBudget) {
    // 「10,000円」「10000」「10,000」などに対応
    const match = text.replace(/,/g, "").match(/^(\d+)(円)?$/);
    if (match) {
      const amount = Number(match[1]);
      const month = monthKey();

      try {
        // 現在の残高を取得
        const { balance: startBalance } = await getSunabarBalanceFn();
        // データベースに保存
        await putBudget(userId, month, amount, startBalance);
        session[userId] = {}; // 成功時リセット
        console.log("putBudget保存成功", amount, startBalance);
        return {
          type: "text",
          text: `今月の予算は${amount.toLocaleString()}円です`,
        };
      } catch (error) {
        session[userId] = {}; // ★失敗時もリセット
        console.error("予算設定エラー:", error); // ログ出力
        return {
          type: "text",
          text: "予算の設定中にエラーが発生しました。もう一度お試しください。",
        };
      }
    } else {
      session[userId] = {}; // ★無効な入力時もリセット
      console.warn("無効な予算入力:", text); // ログ出力
      return {
        type: "text",
        text: "ちょっとちょっと！数字で予算を教えてくれないと、マネージャー困っちゃうよ？（例：10000円）\n仕切り直しで、もう一度「予算」って送ってね！",
      };
    }
  }

  // それ以外はスルー
  return null;
}

module.exports = {
  handleBudgetRegister,
  getBudget,         // 既存
  getLastMonthBalance, // 新規追加
  handleEvent        // 対話形式の予算設定処理
};
