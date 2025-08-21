const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

module.exports = async (client) => {
  // 1. budgetsテーブルから全ユーザーのuserIdを取得
  const ddbClient = new DynamoDBClient({});
  const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

  // 今月だけ取得する（例: 2025-06）
  const currentMonth = new Date().toISOString().slice(0, 7);

  const params = {
    TableName: "budgets",
    FilterExpression: "#month = :month",
    ExpressionAttributeNames: { "#month": "month" },
    ExpressionAttributeValues: { ":month": currentMonth }
  };

  let allBudgetItems = [];
  try {
    const result = await ddbDocClient.send(new ScanCommand(params));
    allBudgetItems = result.Items || [];
  } catch (err) {
    console.error("DynamoDB取得エラー", err);
    return;
  }

  const userIds = [...new Set(allBudgetItems.map(item => item.userId))];

  // 2. 口座残高を共通アカウントで取得
  const API_URL = "https://api.sunabar.gmo-aozora.com/personal/v1/accounts/balances";
  const oshikatsuAccount = process.env.OSHIKATSU_ACCOUNT_ID;
  const token = process.env.sunabarToken;

  let balance = 0;
  try {
    const res = await fetch(API_URL, {
      headers: { "x-access-token": token }
    });
    const data = await res.json();
    const balanceInfo = data.spAccountBalances.find(b => b.accountId === oshikatsuAccount);
    balance = Number(balanceInfo?.odBalance || 0);
    console.log(`推し活口座の現在残高: ${balance}円`);
  } catch (err) {
    console.error("API連携エラー", err);
    return;
  }

  // 3. 残高が0なら全ユーザーにpush
  if (balance === 0) {
    const message = "推し活口座が残高ゼロに…！\nこらこら！もう予算オーバーだよ😠";
    for (const userId of userIds) {
      try {
        await client.pushMessage(userId, { type: "text", text: message });
        console.log(`Pushed to user: ${userId}`);
      } catch (err) {
        console.error(`Push失敗 userId: ${userId}`, err);
      }
    }
  } else {
    console.log("残高がまだあるので通知しません");
  }
};
