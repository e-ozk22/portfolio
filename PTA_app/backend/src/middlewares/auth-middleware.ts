import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import dotenv from "dotenv";
import prisma from "../../prisma/client";

dotenv.config();

// サーバー起動時に一度だけ初期化（すでに初期化済みならskip）
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // 改行コード注意！
    }),
  });
}

// 認証　DBからユーザー情報を取得して、req.userにセットする
// async function requireAuth ... だったのを、asyncを外してPromise型を避ける！
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;

    // ユーザー情報をDBから取得
    const user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // 認証成功　ユーザー情報をreq.userにセット
    req.user = {
      id: user.id,
      name: user.name,
      role: user.role,
      isAdmin: user.isAdmin,
      uid: user.firebaseUid!,
    };
    next();
  } catch (error) {
    console.error("認証エラー", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ロール（職員かどうか）確認用ミドルウェア例
export function requireStaff(req: Request, res: Response, next: NextFunction) {
  console.log("👤 ロール確認:", req.user);

  const user = req.user;
  if (user?.role === "staff") {
    next();
  } else {
    res.status(403).json({ error: "職員専用です" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req.user;
  if (user?.role === "admin" || user?.isAdmin === true) {
    next();
  } else {
    res.status(403).json({ error: "管理者専用です" });
  }
}

export function requireParent(req: Request, res: Response, next: NextFunction) {
  const user = req.user;
  if (user?.role === "parent") {
    next();
  } else {
    res.status(403).json({ error: "保護者専用です" });
  }
}
