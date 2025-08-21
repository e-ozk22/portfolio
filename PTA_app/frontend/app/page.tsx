'use client' // クライアントコンポーネントとしてマーク

import { useState, useMemo, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'
import { EventCard } from '@/components/event-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'
import { getEvents } from '@/actions/events' // Server Actionのみインポート
import type { Event } from '@/data/events' // 型はdata/eventsから直接インポート
import { getUserParticipatedEventIds } from '@/actions/participations' // 新しいServer Actionをインポート

// EventCardのstatus型ガード
const getEventStatus = (status: string): '募集中' | '募集前' | '終了' => {
  if (status === '募集中' || status === '募集前' || status === '終了') return status
  return '終了'
}

export default function EventListPage() {
  const searchParams = useSearchParams()
  const initialYear = searchParams?.get('year')
  const initialMonth = searchParams?.get('month') // 1-indexed month

  const [currentMonth, setCurrentMonth] = useState(() => {
    if (initialYear && initialMonth) {
      const year = Number.parseInt(initialYear, 10)
      const month = Number.parseInt(initialMonth, 10) - 1 // Convert back to 0-indexed
      if (!isNaN(year) && !isNaN(month) && month >= 0 && month <= 11) {
        return new Date(year, month, 1) // Set to the first day of that month
      }
    }
    return new Date() // Default to current date
  })
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [events, setEvents] = useState<Event[]>([]) // イベントデータをstateで管理
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)
  const [userParticipatedEventIds, setUserParticipatedEventIds] = useState<string[]>([]) // ユーザーの参加イベントIDリスト

  // デモ用のユーザーID (実際には認証システムから取得)
  const userId = 'user1'

  // イベントデータとユーザーの参加状況をロード
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingEvents(true)
      const [fetchedEvents, participatedIds] = await Promise.all([
        getEvents(),
        getUserParticipatedEventIds(userId),
      ])
      setEvents(fetchedEvents)
      setUserParticipatedEventIds(participatedIds)
      setIsLoadingEvents(false)
    }
    loadData()
  }, [userId])

  // 日本語の日付文字列をDateオブジェクトにパースするヘルパー関数
  const parseJapaneseDate = (dateString: string): Date | null => {
    const match = dateString.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/)
    if (match) {
      const year = Number.parseInt(match[1], 10)
      const month = Number.parseInt(match[2], 10) - 1 // 月は0-indexed
      const day = Number.parseInt(match[3], 10)
      return new Date(year, month, day)
    }
    return null
  }

  // 現在の月に表示する日付の配列を生成
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const numDays = new Date(year, month + 1, 0).getDate() // その月の日数
    const firstDayOfWeek = new Date(year, month, 1).getDay() // その月の1日の曜日 (0:日, 6:土)

    const days = []
    // 前月の空白セルを追加
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }
    // 今月の日付を追加
    for (let i = 1; i <= numDays; i++) {
      days.push(i)
    }
    return days
  }, [currentMonth])

  // イベントがある日付のセットを生成
  const eventDatesInMonth = useMemo(() => {
    const dates = new Set<number>()
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    events.forEach((event) => {
      const eventDate = parseJapaneseDate(event.date)
      if (eventDate && eventDate.getFullYear() === year && eventDate.getMonth() === month) {
        dates.add(eventDate.getDate())
      }
    })
    return dates
  }, [events, currentMonth])

  // 前月へ移動
  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
      return newMonth
    })
    setSelectedDate(null) // 月が変わったら選択状態をリセット
  }

  // 次月へ移動
  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
      return newMonth
    })
    setSelectedDate(null) // 月が変わったら選択状態をリセット
  }

  // 日付クリック時の処理
  const handleDateClick = (date: number | null) => {
    if (date) {
      const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date)
      if (selectedDate && selectedDate.getTime() === clickedDate.getTime()) {
        // 同じ日付が再度クリックされたら選択を解除
        setSelectedDate(null)
      } else {
        setSelectedDate(clickedDate)
      }
    }
  }

  // 表示月のフォーマット
  const formattedMonth = currentMonth.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
  })

  // フィルタリングされたイベントリスト
  const filteredEvents = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    return events.filter((event) => {
      const eventDate = parseJapaneseDate(event.date)
      if (!eventDate) return false // 日付パースに失敗した場合はスキップ

      if (selectedDate) {
        // 特定の日付が選択されている場合、その日付に一致するイベントのみ表示
        return (
          eventDate.getFullYear() === selectedDate.getFullYear() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getDate() === selectedDate.getDate()
        )
      } else {
        // 特定の日付が選択されていない場合、現在の月に属するイベントのみ表示
        return eventDate.getFullYear() === year && eventDate.getMonth() === month
      }
    })
  }, [events, currentMonth, selectedDate])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MobileNav>
        <Header title="イベント一覧" />
      </MobileNav>

      <main className="p-4 max-w-md mx-auto lg:max-w-none lg:grid lg:grid-cols-3 lg:gap-4">
        {/* カレンダー部分 */}
        <div className="lg:col-span-1 mb-4 lg:mb-0">
          <Card className="border-border bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                カレンダー
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-foreground/70">
                {/* 月移動ナビゲーション */}
                <div className="flex items-center justify-between mb-2">
                  <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
                    <ChevronLeft className="h-5 w-5" />
                    <span className="sr-only">前月</span>
                  </Button>
                  <p className="text-lg font-semibold text-foreground">{formattedMonth}</p>
                  <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                    <ChevronRight className="h-5 w-5" />
                    <span className="sr-only">次月</span>
                  </Button>
                </div>

                {/* 曜日ヘッダー */}
                <div className="grid grid-cols-7 gap-1 mt-4 text-sm">
                  {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
                    <div key={day} className="p-2 font-semibold text-center">
                      {day}
                    </div>
                  ))}
                  {/* カレンダーの日付 */}
                  {daysInMonth.map((date, index) => (
                    <div
                      key={index} // nullの場合もあるためindexをkeyに
                      className={`p-2 text-center rounded ${
                        date
                          ? `cursor-pointer hover:bg-secondary/10 ${
                              selectedDate &&
                              selectedDate.getFullYear() === currentMonth.getFullYear() &&
                              selectedDate.getMonth() === currentMonth.getMonth() &&
                              selectedDate.getDate() === date
                                ? 'bg-primary text-primary-foreground' // 選択された日付
                                : ''
                            } ${
                              eventDatesInMonth.has(date) &&
                              !(
                                selectedDate &&
                                selectedDate.getFullYear() === currentMonth.getFullYear() &&
                                selectedDate.getMonth() === currentMonth.getMonth() &&
                                selectedDate.getDate() === date
                              )
                                ? 'border-2 border-accent font-bold text-accent' // イベントがある日付 (選択されていない場合)
                                : ''
                            }`
                          : '' // 空白セル
                      }`}
                      onClick={() => handleDateClick(date)}
                    >
                      {date}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* イベント一覧 */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">開催予定のイベント</h2>
          <div className="space-y-4">
            {isLoadingEvents ? (
              <p className="text-center text-muted-foreground">イベントを読み込み中...</p>
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  {...event}
                  participants={event.applicationsCount ?? 0}// ここでundefined対策
                  status={getEventStatus(event.status)}
                  isParticipatedByCurrentUser={userParticipatedEventIds.includes(event.id)} // 参加状況を渡す
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                {selectedDate
                  ? `${selectedDate.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}にイベントはありません。`
                  : 'この月にイベントはありません。'}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
