import express, { Request, Response } from "express";
import { requireAuth, requireStaff } from "../middlewares/auth-middleware";

const router = express.Router();

// 管理者ダッシュボード
router.get(
  "/admin/menu",
  requireAuth,
  requireStaff,
  (req: Request, res: Response) => {
    res.json({ message: "ようこそ管理者メニューへ" });
  }
);

export default router;
