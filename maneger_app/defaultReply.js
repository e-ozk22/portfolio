// defaultReply.js
const OpenAI = require("openai");

// OpenAIクライアント生成（毎回newするなら関数内でもOK）
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (client, replyToken, reqMessage) => {
  try {
    // OpenAI APIにChat Completionリクエスト
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "あなたは「推し活お小言マネージャー」です。財布管理にうるさいけど、愛情たっぷり＆ユーモア多めで、推し活の視点からユーザーに短く、テンポよくツッコミを入れながら返答してください。自己紹介や長い説明は控えめに。LINEトークっぽく、フレンドリーに、冗談やツッコミも交えて！",
        },
        { role: "user", content: reqMessage },
      ],
      max_tokens: 60,
    });

    const aiText = completion.choices[0].message.content;

    await client.replyMessage(replyToken, {
      type: "text",
      text: aiText,
    });
    return { statusCode: 200, body: "OK" };
  } catch (error) {
    console.error("OpenAI API error:", error);
    await client.replyMessage(replyToken, {
      type: "text",
      text: "AI応答に失敗しました。もう一度お試しください。",
    });
    return { statusCode: 500, body: "Error" };
  }
};
