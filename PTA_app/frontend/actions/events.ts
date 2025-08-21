"use server"

import { events, type Event } from "@/data/events"
import { getEventTimeSlotCapacity } from "@/actions/participations" // async関数のみimport

/**
 * 全てのイベントを取得するServer Action
 * @returns イベントの配列 (参加者数を動的に計算して含む)
 */
export async function getEvents(): Promise<Event[]> {
  // 各イベントごとにawaitでcapacityを取得
  const results: Event[] = []
  for (const event of events) {
    const capacities = await getEventTimeSlotCapacity(event.id)
    const totalParticipants = Object.values(capacities).reduce((sum, slot) => sum + slot.current, 0)
    results.push({
      ...event,
      participants: totalParticipants,
    })
  }
  return results
}

/**
 * 特定のイベントをIDで取得するServer Action
 * @param id イベントID
 * @returns イベントオブジェクト、またはundefined (参加者数を動的に計算して含む)
 */
export async function getEventById(id: string): Promise<Event | undefined> {
  const event = events.find((event) => event.id === id)
  if (!event) return undefined

  const capacities = await getEventTimeSlotCapacity(event.id)
  const totalParticipants = Object.values(capacities).reduce((sum, slot) => sum + slot.current, 0)

  return {
    ...event,
    participants: totalParticipants, // 動的に計算された参加者数を追加
  }
}