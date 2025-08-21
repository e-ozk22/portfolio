// app/users/[userId]/page.tsx
import React from "react";
import PublicUserPage from "../../../components/PublicUserPage"; // 相対パスはプロジェクト構成によって調整
import { getUserById, getUserReviews } from "@/libs/api";

// Next.js 15以降（App Router）想定
export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  // paramsはPromiseなのでunwrap
  const { userId } = React.use(params);

  // ユーザー情報とレビュー情報をfetch
  const users = await getUserById(userId);
  const userReviews = await getUserReviews(userId);

  // 読み込み状態の制御が必要なら追加
  const loading = false; // 今回はサーバーコンポーネントなのでfetch終わってから描画

  return (
    <PublicUserPage
      users={users}
      userReviews={userReviews}
      loading={loading}
      // onBackClickをカスタムしたい場合は追加で渡せる
    />
  );
}
