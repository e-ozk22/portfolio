import prisma from "../../prisma/client";
import { Request, Response } from "express";

interface ChildProfile {
  name: string;
  className: string;
}

interface UserProfile {
  id: string;
  name: string;
  profileImageUrl: string;
  children: ChildProfile[];
  role: string;
  isAdmin: boolean;
}

export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  const user = await prisma.user.findUnique({
    // ユーザーIDに基づいてプロフィール情報を取得
    // 必要なフィールドのみを選択
    where: { id: userId },
    include: {
      // 子供の情報も含める
      children: true,
    },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    role: user.role,
    isAdmin: user.isAdmin,
    children: user.children.map((child) => ({
      name: child.name,
      className: child.className,
    })),
    profileImageUrl: user.profileImageUrl ?? "", // プロフィール画像URLが設定されていない場合は空文字列
  };
}

export async function getUserByFirebaseUid(firebaseUid: string) {
  const user = await prisma.user.findUnique({
    where: { firebaseUid },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isAdmin: true,
      profileImageUrl: true,
      children: true,
    },
  });

  return user;
}
