// checkBalance.js
// ──────────────────────────────
// ① getSunabarBalance() …… 他モジュール用 util
// ② handler() ………………… 「残高」コマンド用の LINE 返信ハンドラ
// ──────────────────────────────
"use strict";

// === 環境変数・ライブラリ読み込み ===
const accountId = process.env.OSHIKATSU_ACCOUNT_ID; // 子口座（推し活）
const parentAccountId = process.env.PARENT_ACCOUNT_ID; // 親口座
const API_URL =
  "https://api.sunabar.gmo-aozora.com/personal/v1/accounts/balances";
const token = process.env.sunabarToken;
const { OpenAI } = require("openai");
const { getLastMonthBalance } = require("./budgetRegister");

// === 今の残高を取得（sunabar） ===
async function getSunabarBalance() {
  try {
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
      throw new Error("親口座が読み取れない〜");
    }

    console.log("親口座残高取得成功:", parentBalance);

    return { childBalance, parentBalance };
  } catch (error) {
    console.error("残高取得失敗:", error);
    throw error;
  }
}

// === モック関数：先月の残高（startBalance）を仮データで返す ===
function getLastMonthBalanceMock(userId) {
  return Promise.resolve({
    startBalance: 12000, // 仮の先月残高（例）
  });
}

// === LINE で「残高」と送られたときの返信処理 ===
async function handler(client, replyToken, userId) {
  try {
    // === 現在の残高を取得 ===
    const { childBalance, parentBalance } = await getSunabarBalance();

    // === モックで先月の子口座残高データを取得 ===
    const lastMonthData = await getLastMonthBalanceMock(userId);
    console.log("先月の残高取得成功（モック）:", lastMonthData);

    // === 先月のデータがあれば差分を出す ===
    let lastBalance = null;
    if (lastMonthData?.startBalance != null) {
      lastBalance = Number(lastMonthData.startBalance);
    }
    const diff = lastBalance != null ? childBalance - lastBalance : null;

    // === OpenAI によるコメント生成 ===
    let aiComment = "";
    if (lastBalance !== null) {
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
            content: `先月の子口座残高は ${lastBalance} 円で、今月は ${childBalance} 円だよ。どう思う？`,
          },
        ],
        max_tokens: 100,
      });

      aiComment =
        aiRes.choices?.[0]?.message?.content?.slice(0, 200) ??
        "（推し活お小言マネージャーはおやすみ中のようです）";
    } else {
      aiComment =
        "え、先月の記録ないやん！？タイムスリップでもしてた？推し活は記録が命。次からちゃんと書いてね！";
    }

    // === LINEへ返信 ===
    await client.replyMessage(replyToken, {
      type: "text",
      text: `現在の残高チェック\n親口座：${parentBalance.toLocaleString()}円\n推し活口座：${childBalance.toLocaleString()}円\n\n${aiComment}`,
    });

    // === 比較データを返す ===
    return {
      statusCode: 200,
      body: "OK",
      comparisonData: {
        currentBalance: childBalance,
        lastMonthBalance: lastBalance,
        difference: diff,
      },
    };
  } catch (error) {
    console.error("残高APIエラー:", error);
    await client.replyMessage(replyToken, {
      type: "text",
      text: `ごめんね、今ちょっと残高が確認できなかったみたい💦通信の調子かも？もう一度試してね。推しのためにも、今いくら残ってるかちゃんと把握しとこ！`,
    });

    return { statusCode: 200, body: "NG" };
  }
}

module.exports = {
  handler, // checkBalance.handler()
  getSunabarBalance, // util
};
