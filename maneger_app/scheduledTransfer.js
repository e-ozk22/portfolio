const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");

module.exports = async (client) => {
  // --- 自動振替処理 ---
  const ddb = new DynamoDBClient({ region: "ap-northeast-1" });
  const month = new Date().toISOString().slice(0, 7); // 例: "2025-06"
  const params = {
    TableName: "budgets",
    FilterExpression: "#m = :month",
    ExpressionAttributeNames: {
      "#m": "month"
    },
    ExpressionAttributeValues: {
      ":month": { S: month }
    }
  };
  let userIds = [];
  let budgetAmount;
  try {
    const result = await ddb.send(new ScanCommand(params));
    const items = result.Items || [];
    userIds = items.map(item => item.userId.S);
    budgetAmount = items[0]?.amount?.N;
    if (!budgetAmount) {
      for (const uid of userIds) {
        await client.pushMessage(uid, {
          type: "text",
          text: "今月の予算が設定されていません。"
        });
      }
      return { statusCode: 200, body: "NG" };
    }
  } catch (err) {
    for (const uid of userIds || []) {
      await client.pushMessage(uid, {
        type: "text",
        text: `予算取得に失敗しました\n${err.message}`
      });
    }
    return { statusCode: 200, body: "NG" };
  }

  // ここで即API振替
  const oshikatsuAccount = process.env.OSHIKATSU_ACCOUNT_ID;
  const parentAccount = process.env.PARENT_ACCOUNT_ID;
  const API_URL = "https://api.sunabar.gmo-aozora.com/personal/v1/transfer/spaccounts-transfer";
  const token = process.env.sunabarToken;
  const payload = {
    depositSpAccountId: oshikatsuAccount,
    debitSpAccountId: parentAccount,
    currencyCode: "JPY",
    paymentAmount: budgetAmount
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
    // 振替後の残高取得
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
    const spAccount = spAccountBalances.find(b => b.accountId === oshikatsuAccount);
    const balance = spAccount ? Number(spAccount.odBalance).toLocaleString() : "不明";
    const pushText = `💸今月の推し活資金をチャージ完了！\n${Number(budgetAmount).toLocaleString()}円があなたの愛（親口座）から届きました💖\n現在の推し活口座の残高は ${balance}円 です！\n大切に使ってね✨`;
    for (const uid of userIds) {
      await client.pushMessage(uid, { type: "text", text: pushText });
    }
    return { statusCode: 200, body: "OK" };
  } catch (e) {
    const errorText = `振替に失敗しました\n${e.message}`;
    for (const uid of userIds || []) {
      await client.pushMessage(uid, { type: "text", text: errorText });
    }
    return { statusCode: 200, body: "NG" };
  }
};
