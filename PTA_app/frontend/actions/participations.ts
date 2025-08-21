"use server"

import { revalidatePath } from "next/cache"

// --- 簡易的なインメモリデータベースのシミュレーション ---
// 実際にはデータベース（Supabase, Neonなど）を使用します

interface EventParticipation {
  eventId: string
  userId: string
  timeSlot: string
  status: "applied" | "cancelled"
  appliedAt: string
  cancelledAt?: string
}

// イベントごとの時間帯参加者情報 (デモ用)
// 実際のアプリケーションでは、イベントデータの一部として管理するか、別のテーブルで管理します
interface TimeSlotInfo {
  current: number
  max: number
  participants: string[] // その時間帯に参加しているユーザーIDのリスト
}

interface EventTimeSlotCapacity {
  [timeSlot: string]: TimeSlotInfo
}

// イベント全体の参加者リスト (デモ用)
interface EventParticipant {
  id: string
  name: string
  avatar: string
}

// デモデータ
const eventTimeSlotCapacities: { [eventId: string]: EventTimeSlotCapacity } = {
  "1": {
    // 運動会準備ボランティア (18:30 - 19:30, max 10)
    "18:30 - 19:00": { current: 1, max: 5, participants: ["user1"] },
    "19:00 - 19:30": { current: 0, max: 5, participants: [] },
  },
  "2": {
    // バザー品作成 (18:30 - 19:30, max 10)
    "18:30 - 19:00": { current: 1, max: 5, participants: ["user1"] },
    "19:00 - 19:30": { current: 0, max: 5, participants: [] },
  },
  "3": {
    // 園内清掃 (09:00 - 10:30, max 30)
    "09:00 - 09:30": { current: 0, max: 10, participants: [] },
    "09:30 - 10:00": { current: 0, max: 10, participants: [] },
    "10:00 - 10:30": { current: 0, max: 10, participants: [] },
  },
  "4": {
    // 夏祭りお手伝い (16:00 - 20:00, max 40)
    "16:00 - 16:30": { current: 0, max: 5, participants: [] },
    "16:30 - 17:00": { current: 0, max: 5, participants: [] },
    "17:00 - 17:30": { current: 0, max: 5, participants: [] },
    "17:30 - 18:00": { current: 0, max: 5, participants: [] },
    "18:00 - 18:30": { current: 0, max: 5, participants: [] },
    "18:30 - 19:00": { current: 0, max: 5, participants: [] },
    "19:00 - 19:30": { current: 0, max: 5, participants: [] },
    "19:30 - 20:00": { current: 0, max: 5, participants: [] },
  },
  "5": {
    // 卒園式準備 (09:00 - 12:00, max 18)
    "09:00 - 09:30": { current: 0, max: 3, participants: [] },
    "09:30 - 10:00": { current: 0, max: 3, participants: [] },
    "10:00 - 10:30": { current: 0, max: 3, participants: [] },
    "10:30 - 11:00": { current: 0, max: 3, participants: [] },
    "11:00 - 11:30": { current: 0, max: 3, participants: [] },
    "11:30 - 12:00": { current: 0, max: 3, participants: [] },
  },
  "6": {
    // プールの見回り (10:00 - 11:30, max 15)
    "10:00 - 10:30": { current: 0, max: 5, participants: [] },
    "10:30 - 11:00": { current: 0, max: 5, participants: [] },
    "11:00 - 11:30": { current: 0, max: 5, participants: [] },
  },
  "7": {
    // 七夕飾り付け準備 (18:30 - 19:00, max 5)
    "18:30 - 19:00": { current: 0, max: 5, participants: [] },
  },
  "8": {
    // お祭り準備 (18:30 - 19:30, max 10)
    "18:30 - 19:00": { current: 0, max: 5, participants: [] },
    "19:00 - 19:30": { current: 0, max: 5, participants: [] },
  },
  "9": {
    // お祭り片付け (18:30 - 19:30, max 10)
    "18:30 - 19:00": { current: 0, max: 5, participants: [] },
    "19:00 - 19:30": { current: 0, max: 5, participants: [] },
  },
  "10": {
    // 運動会片付け (18:30 - 19:30, max 10)
    "18:30 - 19:00": { current: 0, max: 5, participants: [] },
    "19:00 - 19:30": { current: 0, max: 5, participants: [] },
  },
  "11": {
    // 読み聞かせ (09:00 - 09:30, max 2)
    "09:00 - 09:30": { current: 0, max: 2, participants: [] },
  },
  "12": {
    // クリスマス会飾り付け (18:30 - 19:00, max 5)
    "18:30 - 19:00": { current: 0, max: 5, participants: [] },
  },
  "13": {
    // 節分飾り付け (18:30 - 19:00, max 5)
    "18:30 - 19:00": { current: 0, max: 5, participants: [] },
  },
}

const allEventParticipations: EventParticipation[] = [
  { eventId: "1", userId: "user1", timeSlot: "18:30 - 19:00", status: "applied", appliedAt: "2025/07/01" },
  { eventId: "2", userId: "user1", timeSlot: "18:30 - 19:00", status: "applied", appliedAt: "2025/07/14" },
]

const allEventParticipantsList: { [eventId: string]: EventParticipant[] } = {
  "1": [{ id: "user1", name: "あなた", avatar: "https://chokotto-stamps.s3.ap-northeast-1.amazonaws.com/72412.jpg" }],
  "2": [{ id: "user1", name: "あなた", avatar: "https://chokotto-stamps.s3.ap-northeast-1.amazonaws.com/72412.jpg" }],
}

// ヘルパー関数：日付フォーマット
const getFormattedDate = () =>
  new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, "/")

/**
 * イベントの時間帯ごとの参加者情報を取得するServer Action
 * @param eventId イベントID
 * @returns 時間帯ごとの参加者情報
 */
export async function getEventTimeSlotCapacity(eventId: string): Promise<EventTimeSlotCapacity> {
  return eventTimeSlotCapacities[eventId] || {}
}

/**
 * イベントの参加者リストを取得するServer Action
 * @param eventId イベントID
 * @returns 参加者リスト
 */
export async function getEventParticipantsList(eventId: string): Promise<EventParticipant[]> {
  return allEventParticipantsList[eventId] || []
}

/**
 * ユーザーのイベント参加状況を取得するServer Action
 * @param eventId イベントID
 * @param userId ユーザーID
 * @returns ユーザーが参加している時間帯の配列
 */
export async function getUserParticipations(eventId: string, userId: string): Promise<string[]> {
  return allEventParticipations
    .filter((p) => p.eventId === eventId && p.userId === userId && p.status === "applied")
    .map((p) => p.timeSlot)
}

/**
 * ユーザーが参加しているイベントのIDリストを取得するServer Action
 * @param userId ユーザーID
 * @returns ユーザーが参加しているイベントIDの配列
 */
export async function getUserParticipatedEventIds(userId: string): Promise<string[]> {
  const participatedEventIds = new Set<string>()
  allEventParticipations
    .filter((p) => p.userId === userId && p.status === "applied")
    .forEach((p) => participatedEventIds.add(p.eventId))
  return Array.from(participatedEventIds)
}

/**
 * イベントに複数時間帯で参加を申し込むServer Action
 * @param eventId イベントID
 * @param userId ユーザーID
 * @param selectedTimeSlots 選択された時間帯の配列
 * @returns 成功/失敗とメッセージ
 */
export async function applyForEvent(
  eventId: string,
  userId: string,
  selectedTimeSlots: string[],
): Promise<{ success: boolean; message: string }> {
  const eventCapacity = eventTimeSlotCapacities[eventId]
  if (!eventCapacity) {
    return { success: false, message: "イベントが見つかりません。" }
  }

  const newParticipations: EventParticipation[] = []
  const alreadyParticipated = await getUserParticipations(eventId, userId)

  for (const timeSlot of selectedTimeSlots) {
    if (alreadyParticipated.includes(timeSlot)) {
      continue // すでに参加している場合はスキップ
    }

    const slotInfo = eventCapacity[timeSlot]
    if (!slotInfo) {
      console.warn(`Unknown time slot: ${timeSlot}`)
      continue
    }

    if (slotInfo.current >= slotInfo.max) {
      return { success: false, message: `${timeSlot} は満員です。` }
    }

    // 参加者数を更新
    slotInfo.current += 1
    slotInfo.participants.push(userId)

    // 参加履歴を記録
    newParticipations.push({
      eventId,
      userId,
      timeSlot,
      status: "applied",
      appliedAt: getFormattedDate(),
    })
  }

  if (newParticipations.length === 0 && selectedTimeSlots.length > 0) {
    return { success: false, message: "選択された時間帯はすべて参加済みか満員でした。" }
  } else if (newParticipations.length === 0) {
    return { success: false, message: "参加する時間帯が選択されていません。" }
  }

  allEventParticipations.push(...newParticipations)

  // イベント全体の参加者リストを更新 (デモ用)
  if (!allEventParticipantsList[eventId].some((p) => p.id === userId)) {
    allEventParticipantsList[eventId].push({
      id: userId,
      name: "あなた",
      avatar: "https://chokotto-stamps.s3.ap-northeast-1.amazonaws.com/72412.jpg",
    })
  }

  revalidatePath(`/events/${eventId}`)
  revalidatePath(`/`) // イベント一覧も再検証
  return { success: true, message: `${newParticipations.length}つの時間帯で参加を申し込みました！` }
}

/**
 * イベントの特定の時間帯の参加をキャンセルするServer Action
 * @param eventId イベントID
 * @param userId ユーザーID
 * @param timeSlot キャンセルする時間帯
 * @returns 成功/失敗とメッセージ
 */
export async function cancelParticipation(
  eventId: string,
  userId: string,
  timeSlot: string,
): Promise<{ success: boolean; message: string }> {
  const eventCapacity = eventTimeSlotCapacities[eventId]
  if (!eventCapacity) {
    return { success: false, message: "イベントが見つかりません。" }
  }

  const slotInfo = eventCapacity[timeSlot]
  if (!slotInfo) {
    return { success: false, message: "指定された時間帯が見つかりません。" }
  }

  const participationIndex = allEventParticipations.findIndex(
    (p) => p.eventId === eventId && p.userId === userId && p.timeSlot === timeSlot && p.status === "applied",
  )

  if (participationIndex === -1) {
    return { success: false, message: "この時間帯には参加していません。" }
  }

  // 参加者数を更新
  if (slotInfo.current > 0) {
    slotInfo.current -= 1
  }
  slotInfo.participants = slotInfo.participants.filter((pId) => pId !== userId)

  // 参加履歴を更新
  allEventParticipations[participationIndex].status = "cancelled"
  allEventParticipations[participationIndex].cancelledAt = getFormattedDate()

  // イベント全体の参加者リストから削除 (もしそのユーザーが他の時間帯にも参加していない場合)
  const userHasOtherParticipations = allEventParticipations.some(
    (p) => p.eventId === eventId && p.userId === userId && p.status === "applied",
  )
  if (!userHasOtherParticipations) {
    allEventParticipantsList[eventId] = allEventParticipantsList[eventId].filter((p) => p.id !== userId)
  }

  revalidatePath(`/events/${eventId}`)
  revalidatePath(`/`) // イベント一覧も再検証
  return { success: true, message: `${timeSlot} の参加をキャンセルしました。` }
}
