'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getEventParticipants } from '@/actions/admin-events'
import * as React from 'react'

type ParamsType = { id: string }
type EventParticipant = {
  id: string
  name: string
  email: string
}

export default function EventParticipantsPage({ params }: { params: Promise<ParamsType> }) {
  const router = useRouter()
  const [participants, setParticipants] = useState<EventParticipant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { id: eventId } = React.use(params)

  useEffect(() => {
    const fetchParticipants = async () => {
      setIsLoading(true)
      const fetched = await getEventParticipants(eventId)
      setParticipants(fetched ?? [])
      setIsLoading(false)
    }
    fetchParticipants()
  }, [eventId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>参加者情報を読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MobileNav>
        <Header title="参加者一覧" />
      </MobileNav>

      <main className="p-4 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">参加者一覧</CardTitle>
          </CardHeader>
          <CardContent>
            {participants.length === 0 ? (
              <p>参加者はいません。</p>
            ) : (
              <ul className="space-y-2">
                {participants.map((p) => (
                  <li key={p.id} className="border p-3 rounded shadow-sm">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{p.email}</p>
                  </li>
                ))}
              </ul>
            )}
            <Button variant="outline" onClick={() => router.back()} className="mt-6 w-full">
              戻る
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
