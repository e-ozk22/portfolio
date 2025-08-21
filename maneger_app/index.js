// index.js  ― Lambda エントリーポイント
"use strict";
const line = require("@line/bot-sdk");

const config = {
  channelSecret: process.env.channelSecretLINE,
  channelAccessToken: process.env.channelAccessTokenLINE,
};
const client = new line.Client(config);

// ====== モジュール Import ======
const { handler: checkBalance, getSunabarBalance } = require("./checkBalance");
const checkStatement = require("./checkStatement");
const oshikatsuPayment = require("./oshikatsuPayment");
const { handleBudgetRegister, handleEvent } = require("./budgetRegister");
const { handleMonthlySummary } = require("./monthlySummary");
const scheduledPush = require("./scheduledPush");
const defaultReply = require("./defaultReply");
const transfer_parent_to_child_account = require("./transfer_parent_to_child_account");
const scheduledTransfer = require("./scheduledTransfer");

// 簡易セッション（メモリ保持）
let session = {};

exports.handler = async (event) => {
  // どこから呼ばれても必ずeventをログ出力（デバッグ用）
  console.log("Lambda triggered! event =", JSON.stringify(event, null, 2));
  // 1. eventBridge（スケジュール）経由
  if (event.jobType || event.source === "aws.scheduler") {
    const jobType = event.detail?.jobType || event.jobType;

    switch (jobType) {
      case "scheduledPush":
        // Ensure scheduledPush returns a promise/awaitable value and is correctly handled
        const pushResult = await scheduledPush(client);
        console.log("scheduledPush completed:", pushResult);
        return { statusCode: 200, body: "scheduledPush completed" }; // Explicit return
      case "scheduledTransfer":
        // Ensure scheduledTransfer returns a promise/awaitable value and is correctly handled
        const transferResult = await scheduledTransfer(client);
        console.log("scheduledTransfer completed:", transferResult);
        return { statusCode: 200, body: "scheduledTransfer completed" }; // Explicit return
      default:
        console.log("Unknown jobType from EventBridge");
        return { statusCode: 400, body: "Unknown jobType" };
    }
  }

  // 2. それ以外（API Gateway経由＝LINE Bot）
  // ------------- 受信イベントパース -------------
  let body;
  try {
    body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  } catch (e) {
    body = {};
  }
  // APIゲートウェイからの呼び出し処理
  const events = body.events || [];
  if (!events.length || !events[0].replyToken) {
    return { statusCode: 200, body: "OK" };
  }
  const replyToken = events[0].replyToken;
  const reqMessage = events[0].message?.text || "";
  const userId = events[0].source?.userId || "default";

  // ---------- 1) 残高 ----------
  if (reqMessage === "残高") {
    return await checkBalance(client, replyToken, reqMessage, userId, session);
  }
  // ---------- 2) 月予算登録 ----------
  // 「予算」コマンドの処理
  if (
    reqMessage === "予算" ||
    /^予算\s?\d+/.test(reqMessage) ||
    session[userId]?.waitingForBudget
  ) {
    const response = await handleEvent(
      {
        source: { userId },
        message: { text: reqMessage },
      },
      getSunabarBalance,
      session
    );

    console.log("handleEventのresponse: ", response);

    if (response) {
      await client.replyMessage(replyToken, response);
      return { statusCode: 200, body: "OK" };
    }
  }

  // ---------- 3) 明細 ----------
  if (reqMessage === "明細") {
    return await checkStatement(client, replyToken, reqMessage);
  }

  // ---------- 4) 親→子 振替 ----------
  if (reqMessage === "振替" || session[userId]?.step === "await_amount") {
    return await transfer_parent_to_child_account(
      client,
      replyToken,
      reqMessage,
      userId,
      session
    );
  }

  // ---------- 5) 推し活支払い ----------
  if (
    reqMessage === "推し活支払い" ||
    session[userId]?.step === "await_oshikatsu_amount"
  ) {
    return await oshikatsuPayment(
      client,
      replyToken,
      reqMessage,
      userId,
      session
    );
  }

  // ---------- 6) 今月どう？ ----------
  if (reqMessage === "今月どう？") {
    return await handleMonthlySummary(client, replyToken, userId);
  }

  // ---------- 7) （テスト用）自動 Push ----------
  if (reqMessage === "自動Push") {
    return await scheduledPush(client, replyToken, reqMessage, userId, session);
  }

  // ---------- 8) デフォルト返信 ----------
  return await defaultReply(client, replyToken, reqMessage);
};
