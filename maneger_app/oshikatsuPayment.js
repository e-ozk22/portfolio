// 推し活支払い
module.exports = async (client, replyToken, reqMessage, userId, session) => {
//推し活支払い
// --- 1. 「推し活支払い」と発言 ---
if (reqMessage === "推し活支払い") {
    session[userId] = { step: "await_oshikatsu_amount" };
    await client.replyMessage(replyToken, {
      type: "text",
      text: "金額を入力してください",
    });
    return { statusCode: 200, body: "OK" };
  }

  // --- 2. 金額入力 ---
  if (session[userId]?.step === "await_oshikatsu_amount" && /^\d+$/.test(reqMessage)) {
    const oshikatsuAccount = process.env.OSHIKATSU_ACCOUNT_ID; // 推し活子口座
    const parentAccount = process.env.PARENT_ACCOUNT_ID;   // 親口座
    const amount = reqMessage;

    const API_URL = "https://api.sunabar.gmo-aozora.com/personal/v1/transfer/spaccounts-transfer";
    const token = process.env.sunabarToken;
    const payload = {
      depositSpAccountId: parentAccount,   // 親口座 ← 入金
      debitSpAccountId: oshikatsuAccount,      // 推し活子口座 → 出金
      currencyCode: "JPY",
      paymentAmount: amount
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Accept": "application/json;charset=UTF-8",
          "Content-Type": "application/json;charset=UTF-8",
          "x-access-token": token
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API status: ${response.status}, body: ${errText}`);
      }
      const data = await response.json();
     // 振替後に残高を取得
  const balancesRes = await fetch(
    "https://api.sunabar.gmo-aozora.com/personal/v1/accounts/balances",
    {
      method: "GET",
      headers: {
        "Accept": "application/json;charset=UTF-8",
        "x-access-token": token
      }
    }
  );
  const balancesData = await balancesRes.json();
  const spAccountBalances = balancesData.spAccountBalances || [];
  const spAccountId = oshikatsuAccount; // 振替に使った子口座のID
  const spAccount = spAccountBalances.find(b => b.accountId === spAccountId);
  const balance = spAccount ? Number(spAccount.odBalance).toLocaleString() : "不明";
  await client.replyMessage(replyToken, {
    type: "text",
    text: `推し活子口座から${Number(amount).toLocaleString()}円を支払いました。\n推し活子口座の残高は${balance}円です。`,
  });
      session[userId] = {}; // リセット
      return { statusCode: 200, body: "OK" };
    } catch (e) {
      await client.replyMessage(replyToken, {
        type: "text",
        text: `支払いに失敗しました\n${e.message}`,
      });
      session[userId] = {};
      return { statusCode: 200, body: "NG" };
    }
  }
  };