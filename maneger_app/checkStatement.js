// 明細
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async (client, replyToken, reqMessage, userId) => {
  if (reqMessage === "明細") {
    // 1. DynamoDBから今月の予算取得（月のみで検索）
    const ddb = new DynamoDBClient({ region: "ap-northeast-1" });
    const month = new Date().toISOString().slice(0, 7);
    const params = {
      TableName: "budgets",
      FilterExpression: "#m = :month",
      ExpressionAttributeNames: { "#m": "month" },
      ExpressionAttributeValues: { ":month": { S: month } }
    };
    let monthlyBudget = null;
    try {
      const result = await ddb.send(new ScanCommand(params));
      const items = result.Items || [];
      if (items.length === 0) {
        monthlyBudget = null;
      } else if (items[0]?.amount?.N) {
        monthlyBudget = Number(items[0].amount.N);
      } else {
        monthlyBudget = null;
      }
    } catch (err) {
      await client.replyMessage(replyToken, {
        type: "text",
        text: `予算取得に失敗しました\n${err.message}`
      });
      return { statusCode: 200, body: "NG" };
    }


    // 2. 銀行APIで明細取得
    const API_URL = "https://api.sunabar.gmo-aozora.com/personal/v1/accounts/transactions";
    const token = process.env.sunabarToken;
    const accountId = process.env.accountId;
    const dateFrom = "2024-03-24";
    const now = new Date();
    const jst = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    const yyyy = jst.getFullYear();
    const mm = ("0" + (jst.getMonth() + 1)).slice(-2);
    const dd = ("0" + jst.getDate()).slice(-2);
    const dateTo = `${yyyy}-${mm}-${dd}`;
    const url = `${API_URL}?accountId=${accountId}&dateFrom=${dateFrom}&dateTo=${dateTo}&nextItemKey=0`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json;charset=UTF-8",
          "Content-Type": "application/json;charset=UTF-8",
          "x-access-token": token
        }
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API status: ${response.status}, body: ${errText}`);
      }

      const data = await response.json();
      const transactions = data.transactions || [];
      if (transactions.length === 0) {
        await client.replyMessage(replyToken, { type: "text", text: "明細はありません。" });
        return { statusCode: 200, body: "OK" };
      }

      // 入金・出金
      const deposits = transactions.filter(tx => tx.transactionType === "1");
      const withdrawals = transactions.filter(tx => tx.transactionType === "2");

      // 直近3件表示
      const formatTransactions = txList =>
      txList.slice(0, 3).map(tx => {
        const date = tx.transactionDate || tx.valueDate || "";
        const remarks = tx.remarks || "";
        const amount = Number(tx.amount).toLocaleString();
        return `${date} ${remarks} ${amount}円`;
      }).join('\n');

      const depositsList = formatTransactions(deposits);
      const withdrawalsList = formatTransactions(withdrawals);

      // 今月の出金合計（例: 当月のwithdrawalsの合計）
      const currentMonth = new Date().toISOString().slice(0, 7);
      const thisMonthWithdrawals = withdrawals.filter(
        tx => (tx.transactionDate || tx.valueDate || "").startsWith(currentMonth)
      );
      const totalWithdrawals = thisMonthWithdrawals.reduce(
        (sum, tx) => sum + Number(tx.amount), 0
      );
      const resMessage = `【入出金明細（直近3件）】\n\n▼入金\n${depositsList}\n\n▼出金\n${withdrawalsList}`;

      // AIお小言
      let aiComment = "";
      try {
        const aiRes = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "あなたは「推し活お小言マネージャー」です。財布管理にうるさいけど、愛情たっぷり＆ユーモア多めで、推し活の視点からユーザーに短く、テンポよくツッコミを入れながら返答してください。自己紹介や長い説明は控えめに。LINEトークっぽく、フレンドリーに、冗談やツッコミも交えて！",
            },
            {
              role: "user",
              content: `今月の出金合計は${totalWithdrawals.toLocaleString()}円で、設定された予算は${monthlyBudget !== null ? monthlyBudget.toLocaleString() + '円' : '未設定'}です。${monthlyBudget !== null ? (totalWithdrawals > monthlyBudget ? '予算オーバーです！' : '予算内です！') : ''}100文字以内でカジュアルにアドバイスをお願いします！`,
            },
          ],
        });
        aiComment = aiRes.choices?.[0]?.message?.content?.slice(0, 200) ?? "（推し活お小言マネージャーからのコメントを取得できませんでした）";
      } catch (error) {
        console.error("AI生成エラー:", error);
        aiComment = "（推し活お小言マネージャーは一時的に休憩中です）";
      }

      // 予算情報とAIコメントを追加
      const fullMessage = `${resMessage}\n\n【今月の状況】\n出金合計: ${totalWithdrawals.toLocaleString()}円\n設定予算: ${monthlyBudget !== null ? monthlyBudget.toLocaleString() + '円' : '未設定'}\n\n【推し活マネージャーからのアドバイス】\n${aiComment}`;

      await client.replyMessage(replyToken, {
        type: "text",
        text: fullMessage,
      });
      return { statusCode: 200, body: "OK" };

    } catch (e) {
      await client.replyMessage(replyToken, {
        type: "text",
        text: `明細取得に失敗しました\n${e.message}`,
      });
      return { statusCode: 200, body: "NG" };
    }
  }
};