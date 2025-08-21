// API関数を共通化するため

import { Review, UserData, Book } from "../types/types";

export const API_BASE_URL = "http://localhost:8000";

// レビュー一覧取得（bookIdごと取得したい場合）
// Promise：今値がなくてもそのうち値を返すという非同期の約束オブジェクト。
// そのうちレビュー配列を返すよ
export async function getReview(id: number): Promise<Review[]> {
  const response = await fetch(`${API_BASE_URL}/books/${id}/reviews`);
  // throwは例外エラーをわざと発生させる
  // その時点で処理ストップ、catchにジャンプ
  if (!response.ok) throw new Error("レビューのfetchに失敗!");
  return response.json();
}

// ユーザー情報取得
export async function getCurrentUser(): Promise<UserData | null> {
  const response = await fetch(`${API_BASE_URL}/users/me`);
  if (!response.ok) return null;
  return await response.json();
}

// ログインなしマイページ用ユーザー情報
export async function getUserById(id: string): Promise<UserData | null> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`);
  if (!response.ok) return null;
  return await response.json();
}

// ユーザーのレビュー取得
export async function getUserReviews(id: String): Promise<Review[]> {
  const response = await fetch(`${API_BASE_URL}/users/${id}/reviews`);
  if (!response.ok) throw new Error("レビュー取得に失敗!");
  return await response.json();
}

// 自分のレビュー取得
// credentials: "include" は「Cookie付きでリクエストを送る」設定（ログイン中のユーザーだけアクセスできるAPIのため）
export async function getMyReviews(id: String) {
  const res = await fetch(`${API_BASE_URL}/users/${id}/reviews`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("レビュー取得失敗");
  return res.json();
}

// 本の詳細を取得する関数
export async function fetchBookById(id: number): Promise<Book | null> {
  const res = await fetch(`${API_BASE_URL}/books/${id}`);
  if (!res.ok) return null;
  return await res.json();
}
