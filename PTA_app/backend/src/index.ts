import express, { RequestHandler } from "express";
import cors from "cors";

// 認証ミドルウェア
import { requireAuth } from "./middlewares/auth-middleware";

// 既存ルーター
import rewardsRouter from "./routes/rewards";
import usersRouter from "./routes/users";
import eventsRouter from "./routes/events";
import pointsRouter from "./routes/points";
import privilegesRouter from "./routes/privileges";
import subscriptionRouter from "./routes/subscription";

// ⭐ ここを追加：スタンプルーター
import stampRouter from "./routes/stamp";

import type { ErrorRequestHandler } from "express";

const app = express();
app.use(cors());
app.use(express.json());

// 認証付きのユーザー確認ルート
app.get(
  "/api/user/me",
  requireAuth as unknown as RequestHandler,
  (req, res) => {
    res.json({
      message: "認証OK！",
      uid: (req as any).user.uid,
      email: (req as any).user.email,
    });
  }
);

// --- 各種ルーター登録 ---
app.use("/api/rewards", rewardsRouter);
app.use("/api/users", usersRouter);
app.use("/api/events", eventsRouter);
app.use("/api/points", pointsRouter);
app.use("/api/privileges", privilegesRouter);
app.use("/api/subscription", subscriptionRouter);

// ⭐ ここを追加：スタンプリクエスト用API
app.use("/api", stampRouter);

// --- ヘルスチェック & トップページ ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.send("Expressサーバーのトップページです！（APIサーバー本体）");
});

// --- エラーハンドラ ---
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error("Express Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
};

app.use(errorHandler);

// --- サーバー起動 ---
app.listen(4000, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:4000`);
});
