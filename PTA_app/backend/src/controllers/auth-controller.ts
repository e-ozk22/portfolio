import { Request, Response } from "express";
import prisma from "../../prisma/client";

//  GETリクエストで自分のプロフィールを取得する
export const getMyProfile = async (req: Request, res: Response) => {
  const firebaseUser = (req as any).user;
  const uid = firebaseUser?.uid;

  if (!uid) {
    return res.status(401).json({ message: "未認証です" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
      select: {
        name: true,
        email: true,
        role: true,
        isAdmin: true,
        profileImageUrl: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "ユーザーが見つかりません" });
    }
    return res.json(user);
  } catch (error) {
    console.error("プロフィール取得エラー", error);
    return res
      .status(500)
      .json({ message: "プロフィールの取得に失敗しました" });
  }
};
