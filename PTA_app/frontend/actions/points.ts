"use server"

import { revalidatePath } from "next/cache"

interface PointTransaction {
  id: string
  userId: string
  type: "earn" | "spend"
  amount: number
  description: string
  date: string
}

// API/ダミー切り替えフラグ
const USE_API = true

// user1 → 本物UUIDのマッピング
const USER_MAP: Record<string, string> = {
  user1: "225ecfa6-96be-4776-b5fa-3ad025665641",
  // 他ユーザーも必要に応じて追加
}
function mapUserId(userId: string): string {
  return USER_MAP[userId] ?? userId
}

// --- ダミーデータ（ローカルテスト用/本番は使わない） ---
const users = [{ id: "user1", points: 290 }]
const pointTransactions: PointTransaction[] = [
  { id: "ph1", userId: "user1", type: "earn", date: "2025/07/10", description: "運動会準備ボランティア", amount: 50 },
  { id: "ph2", userId: "user1", type: "earn", date: "2025/06/25", description: "バザー品作成", amount: 80 },
  { id: "ph3", userId: "user1", type: "earn", date: "2025/06/15", description: "園内清掃", amount: 40 },
  { id: "ph4", userId: "user1", type: "earn", date: "2025/05/20", description: "入学式お手伝い", amount: 70 },
  { id: "ph5", userId: "user1", type: "earn", date: "2025/04/05", description: "PTA総会参加", amount: 20 },
]
async function findUser(userId: string) {
  return users.find(u => u.id === userId)
}
async function updateUserPoints(userId: string, newPoints: number) {
  const user = users.find(u => u.id === userId)
  if (user) user.points = newPoints
}
async function recordTransaction(transaction: PointTransaction) {
  pointTransactions.push(transaction)
}
// --- ダミーデータここまで ---

// 現在のポイント取得
export async function getUserPoints(userId: string): Promise<number> {
  if (USE_API) {
    const apiUserId = mapUserId(userId)
    const res = await fetch(`http://localhost:4000/api/points/${apiUserId}`, { cache: "no-store" })
    if (!res.ok) throw new Error("ポイント取得失敗")
    const data = await res.json()
    // コントローラの返却が { point: 合計値 } なら .point
    return data.point ?? data.points // どちらにも対応
  }
  // ダミーモード
  const user = await findUser(userId)
  return user ? user.points : 0
}

// ポイント履歴取得
export async function getPointHistory(userId: string): Promise<PointTransaction[]> {
  if (USE_API) {
    const apiUserId = mapUserId(userId)
    const res = await fetch(`http://localhost:4000/api/points/${apiUserId}/history`, { cache: "no-store" })
    if (!res.ok) throw new Error("ポイント履歴取得失敗")
    return await res.json()
  }
  // ダミーモード
  return pointTransactions
    .filter((tx) => tx.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// ポイント加算
export async function addPoints(
  userId: string,
  amount: number,
  description: string
): Promise<{ success: boolean; message: string }> {
  if (USE_API) {
    const apiUserId = mapUserId(userId)
    const res = await fetch(`http://localhost:4000/api/points/${apiUserId}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, description }),
    })
    if (!res.ok) {
      return { success: false, message: "ポイントの追加に失敗しました。" }
    }
    revalidatePath("/points")
    revalidatePath("/point-history")
    return { success: true, message: `${amount}ポイントを獲得しました！` }
  }
  // ダミーモード
  const user = await findUser(userId)
  if (!user) return { success: false, message: "ユーザーが見つかりません。" }
  user.points += amount
  await recordTransaction({
    id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    userId,
    type: "earn",
    amount,
    description,
    date: new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, "/"),
  })
  revalidatePath("/points")
  revalidatePath("/point-history")
  return { success: true, message: `${amount}ポイントを獲得しました！（ダミー）` }
}

// ポイント消費
export async function spendPoints(
  userId: string,
  amount: number,
  description: string
): Promise<{ success: boolean; message: string }> {
  if (USE_API) {
    const apiUserId = mapUserId(userId)
    const res = await fetch(`http://localhost:4000/api/points/${apiUserId}/spend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, description }),
    })
    if (!res.ok) {
      return { success: false, message: "ポイントの消費に失敗しました。" }
    }
    revalidatePath("/points")
    revalidatePath("/point-history")
    return { success: true, message: `${amount}ポイントを消費しました。` }
  }
  // ダミーモード
  const user = await findUser(userId)
  if (!user) return { success: false, message: "ユーザーが見つかりません。" }
  if (user.points < amount) return { success: false, message: "ポイントが不足しています。" }
  user.points -= amount
  await recordTransaction({
    id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    userId,
    type: "spend",
    amount,
    description,
    date: new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, "/"),
  })
  revalidatePath("/points")
  revalidatePath("/point-history")
  return { success: true, message: `${amount}ポイントを消費しました。（ダミー）` }
}

// import { revalidatePath } from "next/cache"

// // --- 簡易的なインメモリデータベースのシミュレーション ---
// // 実際にはデータベース（Supabase, Neonなど）を使用します

// interface User {
//   id: string
//   points: number
// }

// interface PointTransaction {
//   id: string
//   userId: string
//   type: "earn" | "spend"
//   amount: number
//   description: string
//   date: string
// }

// // 初期データ
// const users: User[] = [{ id: "user1", points: 290 }] // 現在の獲得ポイントを290ptに設定
// const pointTransactions: PointTransaction[] = [
//   { id: "ph1", userId: "user1", type: "earn", date: "2025/07/10", description: "運動会準備ボランティア", amount: 50 },
//   { id: "ph2", userId: "user1", type: "earn", date: "2025/06/25", description: "バザー品作成", amount: 80 },
//   { id: "ph3", userId: "user1", type: "earn", date: "2025/06/15", description: "園内清掃", amount: 40 },
//   { id: "ph4", userId: "user1", type: "earn", date: "2025/05/20", description: "入学式お手伝い", amount: 70 },
//   { id: "ph5", userId: "user1", type: "earn", date: "2025/04/05", description: "PTA総会参加", amount: 20 },
// ]

// // ヘルパー関数：ユーザーを取得
// async function findUser(userId: string): Promise<User | undefined> {
//   // 実際のDBでは await db.users.findUnique({ where: { id: userId } }) のようになる
//   return users.find((user) => user.id === userId)
// }

// // ヘルパー関数：ユーザーのポイントを更新
// async function updateUserPoints(userId: string, newPoints: number): Promise<boolean> {
//   const userIndex = users.findIndex((user) => user.id === userId)
//   if (userIndex !== -1) {
//     users[userIndex].points = newPoints
//     return true
//   }
//   return false
// }

// // ヘルパー関数：ポイント取引を記録
// async function recordTransaction(transaction: PointTransaction): Promise<void> {
//   pointTransactions.push(transaction)
// }
// // --- シミュレーションここまで ---

// /**
//  * ユーザーの現在のポイントを取得するServer Action
//  * @param userId ユーザーID
//  * @returns 現在のポイント数
//  */
// export async function getUserPoints(userId: string): Promise<number> {
//   const user = await findUser(userId)
//   return user ? user.points : 0
// }

// /**
//  * ユーザーのポイント履歴を取得するServer Action
//  * @param userId ユーザーID
//  * @returns ポイント取引の配列
//  */
// export async function getPointHistory(userId: string): Promise<PointTransaction[]> {
//   // 最新の取引が上に来るようにソート
//   return pointTransactions
//     .filter((tx) => tx.userId === userId)
//     .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
// }

// /**
//  * ユーザーにポイントを追加するServer Action
//  * @param userId ユーザーID
//  * @param amount 追加するポイント数
//  * @param description ポイント獲得理由
//  * @returns 成功/失敗とメッセージ
//  */
// export async function addPoints(
//   userId: string,
//   amount: number,
//   description: string,
// ): Promise<{ success: boolean; message: string }> {
//   if (amount <= 0) {
//     return { success: false, message: "追加するポイントは正の数である必要があります。" }
//   }

//   const user = await findUser(userId)
//   if (!user) {
//     return { success: false, message: "ユーザーが見つかりません。" }
//   }

//   const newPoints = user.points + amount
//   const updated = await updateUserPoints(userId, newPoints)

//   if (updated) {
//     await recordTransaction({
//       id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
//       userId,
//       type: "earn",
//       amount,
//       description,
//       date: new Date()
//         .toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" })
//         .replace(/\//g, "/"),
//     })
//     revalidatePath("/points") // ポイント確認画面を再検証
//     revalidatePath("/point-history") // ポイント履歴画面を再検証
//     return { success: true, message: `${amount}ポイントを獲得しました！` }
//   } else {
//     return { success: false, message: "ポイントの追加に失敗しました。" }
//   }
// }

// /**
//  * ユーザーのポイントを消費するServer Action
//  * @param userId ユーザーID
//  * @param amount 消費するポイント数
//  * @param description ポイント消費理由
//  * @returns 成功/失敗とメッセージ
//  */
// export async function spendPoints(
//   userId: string,
//   amount: number,
//   description: string,
// ): Promise<{ success: boolean; message: string }> {
//   if (amount <= 0) {
//     return { success: false, message: "消費するポイントは正の数である必要があります。" }
//   }

//   const user = await findUser(userId)
//   if (!user) {
//     return { success: false, message: "ユーザーが見つかりません。" }
//   }

//   if (user.points < amount) {
//     return { success: false, message: "ポイントが不足しています。" }
//   }

//   // 景品交換の制限チェック
//   // "1家庭1回まで" の景品は、説明文にその旨が含まれると仮定
//   const oneTimeExchangeItems = ["運動会前列スペース 秋", "発表会前列スペース", "卒園式前列スペース 冬"]
//   const isOneTimeItem = oneTimeExchangeItems.some((item) => description.includes(item))

//   if (isOneTimeItem) {
//     const userSpentOnThisItem = pointTransactions.some(
//       (tx) => tx.userId === userId && tx.type === "spend" && tx.description === description,
//     )
//     if (userSpentOnThisItem) {
//       return { success: false, message: "この景品は1家庭1回までしか交換できません。" }
//     }
//   }

//   const newPoints = user.points - amount
//   const updated = await updateUserPoints(userId, newPoints)

//   if (updated) {
//     await recordTransaction({
//       id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
//       userId,
//       type: "spend",
//       amount,
//       description,
//       date: new Date()
//         .toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" })
//         .replace(/\//g, "/"),
//     })
//     revalidatePath("/points") // ポイント確認画面を再検証
//     revalidatePath("/point-history") // ポイント履歴画面を再検証
//     return { success: true, message: `${amount}ポイントを消費しました。` }
//   } else {
//     return { success: false, message: "ポイントの消費に失敗しました。" }
//   }
// }
