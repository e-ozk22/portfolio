'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin, ClipboardList, MessageSquare } from 'lucide-react'
import { getEventById } from '@/actions/admin-events'
import type { Event } from '@/data/events'
import * as React from 'react'

// Next.js 15 params Promise対応
type ParamsType = { id: string }
export default function EventDetailPage({ params }: { params: Promise<ParamsType> }) {
  const router = useRouter()
  const [eventData, setEventData] = useState<Event | null>(null)
  const [isLoadingEvent, setIsLoadingEvent] = useState(true)

  const { id: eventId } = React.use(params)

  useEffect(() => {
    const fetchEventDetails = async () => {
      setIsLoadingEvent(true)
      const fetchedEvent = await getEventById(eventId)
      if (fetchedEvent) {
        setEventData(fetchedEvent)
      } else {
        router.replace('/404')
      }
      setIsLoadingEvent(false)
    }
    fetchEventDetails()
  }, [eventId, router])

  if (isLoadingEvent || !eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>イベント詳細を読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MobileNav>
        <Header title="イベント詳細" />
      </MobileNav>

      <main className="p-4 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">{eventData.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>日付: {eventData.date}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>時間: {eventData.time}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>場所: {eventData.location}</span>
            </div>
            <div className="flex items-start gap-2 mb-2">
              <ClipboardList className="h-4 w-4 text-muted-foreground mt-1" />
              <span>持ち物: {eventData.itemsToBring}</span>
            </div>
            <div className="flex items-start gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground mt-1" />
              <span>特記事項: {eventData.specialNotes}</span>
            </div>
            <p className="mt-4">{eventData.description}</p>
            <Button
              className="mt-6 w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => router.push(`/admin/events/${eventData.id}/edit`)}
            >
              編集する
            </Button>
            <Button variant="outline" onClick={() => router.back()} className="mt-6 w-full">
              戻る
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
