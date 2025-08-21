module.exports = async (client, replyToken, reqMessage, userId, session) => {
  // --- 1. 「振替」と発言 ---
  if (reqMessage === "振替") {
    session[userId] = { step: "await_amount" };
    await client.replyMessage(replyToken, {
      type: "text",
      text: "推し活子口座へ振替する金額を入力してください",
    });
    return { statusCode: 200, body: "OK" };
  }

  // --- 2. 金額入力 ---
  if (session[userId]?.step === "await_amount" && /^\d+$/.test(reqMessage)) {
    const oshikatsuAccount = process.env.OSHIKATSU_ACCOUNT_ID; // 推し活子口座
    const parentAccount = process.env.PARENT_ACCOUNT_ID;       // 親口座
    const amount = reqMessage;

    const API_URL = "https://api.sunabar.gmo-aozora.com/personal/v1/transfer/spaccounts-transfer";
    const token = process.env.sunabarToken;
    const payload = {
      depositSpAccountId: oshikatsuAccount,   // 推し活子口座 ← 入金
      debitSpAccountId: parentAccount,        // 親口座 → 出金
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
      const spAccountId = oshikatsuAccount;
      const spAccount = spAccountBalances.find(b => b.accountId === spAccountId);
      const balance = spAccount ? Number(spAccount.odBalance).toLocaleString() : "不明";
      await client.replyMessage(replyToken, {
        type: "text",
        text: `親口座から推し活子口座へ${Number(amount).toLocaleString()}円を振替しました。\n推し活子口座の残高は${balance}円です。`,
      });
      session[userId] = {}; // リセット
      return { statusCode: 200, body: "OK" };
    } catch (e) {
      await client.replyMessage(replyToken, {
        type: "text",
        text: `振替に失敗しました\n${e.message}`,
      });
      session[userId] = {};
      return { statusCode: 200, body: "NG" };
    }
  }
};