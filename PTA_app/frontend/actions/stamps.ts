"use server"

import { revalidatePath } from "next/cache"

// --- 簡易的なインメモリデータベースのシミュレーション ---
// 実際にはデータベース（Supabase, Neonなど）を使用します

interface Stamp {
  id: string
  eventId: string
  userId: string // スタンプを押したユーザー
  type: "ありがとう" | "お疲れ様" | "素晴らしい" // スタンプの種類
  date: string
}

const stamps: Stamp[] = []

// ヘルパー関数：スタンプを記録
async function recordStamp(stamp: Stamp): Promise<void> {
  stamps.push(stamp)
}

// ヘルパー関数：イベントのスタンプを取得
export async function getStampsForEvent(eventId: string): Promise<Stamp[]> {
  return stamps.filter((s) => s.eventId === eventId)
}

// --- シミュレーションここまで ---

/**
 * イベントにスタンプを押すServer Action
 * @param eventId イベントID
 * @param userId スタンプを押すユーザーID
 * @param stampType スタンプの種類
 * @returns 成功/失敗とメッセージ
 */
export async function addStamp(
  eventId: string,
  userId: string,
  stampType: "ありがとう" | "お疲れ様" | "素晴らしい",
): Promise<{ success: boolean; message: string }> {
  const newStamp: Stamp = {
    id: `stamp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    eventId,
    userId,
    type: stampType,
    date: new Date()
      .toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" })
      .replace(/\//g, "/"),
  }

  await recordStamp(newStamp)
  revalidatePath(`/events/${eventId}`) // イベント詳細画面を再検証
  return { success: true, message: `${stampType}スタンプを押しました！` }
}
