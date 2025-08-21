// 画面表示されなかったので、一旦コメントアウトさせていただきました
// 'use client'

// import { useState, useEffect, useMemo } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import {
//   ArrowLeft,
//   Plus,
//   Calendar,
//   MapPin,
//   Users,
//   Trash2,
//   ChevronLeft,
//   ChevronRight,
// } from 'lucide-react'
// import Link from 'next/link'
// import { set } from 'date-fns'

// type Event = {
//   id: string
//   title: string
//   description: string
//   date: string // YYYY-MM-DD
//   startTime: string
//   endTime: string
//   location: string
//   requiredItems?: string | null
//   specialNotes?: string | null
//   capacity?: number | null
//   deadline?: string | null
//   pointReward: number
//   privilegeAllowed: boolean
//   createdById: string
//   status: string // イベントのステータス
//   applicationsCount: number // 参加者数
// }

// export default function EventsList() {
//   const router = useRouter()
//   const searchParams = useSearchParams()

//   const initialYear = searchParams.get('year')
//   const initialMonth = searchParams.get('month')
//   const initialDay = searchParams.get('day')

//   const [displayMonth, setDisplayMonth] = useState(() => {
//     if (initialYear && initialMonth) {
//       return new Date(Number.parseInt(initialYear), Number.parseInt(initialMonth))
//     }
//     return new Date()
//   })

//   const [selectedDayInMonth, setSelectedDayInMonth] = useState<number | null>(() => {
//     if (initialDay) {
//       return Number.parseInt(initialDay)
//     }
//     return null
//   })

//   // イベントデータの初期化
//   const [events, setEvents] = useState<Event[]>([])

//   // イベントデータの取得
//   useEffect(() => {
//     const fetchEvents = async () => {
//       const year = displayMonth.getFullYear()
//       const month = displayMonth.getMonth() + 1 // 月は0から始まるため、1を足す

//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/events?year=${year}&month=${month}`
//         )
//         const data = await res.json()
//         setEvents(data)
//       } catch (error) {
//         console.error('イベントデータの取得に失敗しました:', error)
//         alert('イベントデータの取得に失敗しました。')
//       }
//     }
//     fetchEvents()
//   }, [displayMonth])

//   // イベントを日付順にソートするMemoizedな配列
//   const sortedEvents = useMemo(() => {
//     return [...events].sort((a, b) => {
//       return new Date(a.date).getTime() - new Date(b.date).getTime()
//     })
//   }, [events])

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case '募集中':
//         return 'bg-point-pink text-white'
//       case '満員':
//         return 'bg-point-purple text-white'
//       case '終了':
//         return 'bg-gray-400 text-white'
//       default:
//         return 'bg-point-blue text-white'
//     }
//   }

//   const eventDatesInDisplayMonth = useMemo(() => {
//     const year = displayMonth.getFullYear()
//     const month = displayMonth.getMonth()
//     const dates = new Set<number>()

//     sortedEvents.forEach((event) => {
//       const eventDate = new Date(event.date)
//       if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
//         dates.add(eventDate.getDate())
//       }
//     })

//     return dates
//   }, [displayMonth, sortedEvents])

//   const calendarDays = useMemo(() => {
//     const year = displayMonth.getFullYear()
//     const month = displayMonth.getMonth()

//     const firstDayOfMonth = new Date(year, month, 1)
//     const startingDay = firstDayOfMonth.getDay()
//     const daysInMonth = new Date(year, month + 1, 0).getDate()

//     const days: (number | null)[] = []

//     for (let i = 0; i < startingDay; i++) {
//       days.push(null)
//     }

//     for (let i = 1; i <= daysInMonth; i++) {
//       days.push(i)
//     }

//     return days
//   }, [displayMonth])

//   // イベント削除のハンドラー
//   const handleDeleteEvent = (eventId: string, eventTitle: string) => {
//     if (window.confirm(`本当にイベント「${eventTitle}」を削除しますか？`)) {
//       setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId))
//       alert(`イベント「${eventTitle}」を削除しました。`)
//     }
//   }

//   // 前月へ移動
//   const goToPreviousMonth = () => {
//     setDisplayMonth((prevDate) => {
//       const newDate = new Date(prevDate)
//       newDate.setMonth(prevDate.getMonth() - 1)
//       setSelectedDayInMonth(null)
//       return newDate
//     })
//   }

//   // 次月へ移動
//   const goToNextMonth = () => {
//     setDisplayMonth((prevDate) => {
//       const newDate = new Date(prevDate)
//       newDate.setMonth(prevDate.getMonth() + 1)
//       setSelectedDayInMonth(null)
//       return newDate
//     })
//   }

//   // 日付クリックのハンドラー
//   // 日付をクリックしたときに選択された日付を更新する
//   const handleDateClick = (day: number) => {
//     setSelectedDayInMonth(day)
//   }

//   // フィルタリングされたイベントを取得
//   // 選択された月と日付に基づいてイベントをフィルタリングする
//   // useMemoを使用する
//   const filteredEvents = useMemo(() => {
//     const year = displayMonth.getFullYear()
//     const month = displayMonth.getMonth()

// // ソートされたイベントデータに対してフィルタリング
//     return sortedEvents.filter((event) => {
//       const eventDate = new Date(event.date)
//       const eventYear = eventDate.getFullYear()
//       const eventMonth = eventDate.getMonth()
//       const eventDay = eventDate.getDate()

//       if (selectedDayInMonth !== null) {
//         return eventYear === year && eventMonth === month && eventDay === selectedDayInMonth
//       } else {
//         return eventYear === year && eventMonth === month
//       }
//     })
//   }, [displayMonth, selectedDayInMonth, sortedEvents])

// const navigateWithCalendarState = (path: string) => {
//     const year = displayMonth.getFullYear()
//     const month = displayMonth.getMonth()
//     const day = selectedDayInMonth || ''

//     const query = new URLSearchParams()
//     query.set('year', year.toString())
//     query.set('month', month.toString())
//     if (day) query.set('day', day.toString())

//     router.push(`${path}?${query.toString()}`)
//   }
// }

//   return (
//     <div className="min-h-screen p-4">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center">
//             <Button
//               variant="ghost"
//               onClick={() => router.push('/admin/menu')}
//               className="mr-4 text-main-text hover:bg-point-purple/10"
//             >
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               管理ダッシュボードへ
//             </Button>
//             <h1 className="text-2xl font-bold text-main-text">イベント管理</h1>
//           </div>
//           <Button
//             onClick={() => router.push('/admin/events/new')}
//             className="bg-point-pink hover:bg-point-pink/90"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             新しいイベント
//           </Button>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-1">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-main-text flex items-center">
//                   <Calendar className="h-5 w-5 mr-2 text-point-blue" />
//                   カレンダー
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-center text-main-text/70">
//                   <div className="flex items-center justify-between mb-4">
//                     <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
//                       <ChevronLeft className="h-5 w-5" />
//                     </Button>
//                     <p className="text-lg font-semibold text-main-text">
//                       {displayMonth.getFullYear()}年 {displayMonth.getMonth() + 1}月
//                     </p>
//                     <Button variant="ghost" size="icon" onClick={goToNextMonth}>
//                       <ChevronRight className="h-5 w-5" />
//                     </Button>
//                   </div>
//                   <div className="grid grid-cols-7 gap-1 mt-4 text-sm">
//                     {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
//                       <div key={day} className="p-2 font-semibold text-center">
//                         {day}
//                       </div>
//                     ))}
//                     {calendarDays.map((day, index) => {
//                       const isSelected = selectedDayInMonth === day
//                       const hasEvent = day && eventDatesInDisplayMonth.has(day)

//                       return (
//                         <div
//                           key={index}
//                           className={`p-2 text-center rounded relative ${day ? 'cursor-pointer' : ''} ${
//                             isSelected
//                               ? 'bg-point-purple text-white'
//                               : hasEvent
//                                 ? 'bg-point-blue/20'
//                                 : ''
//                           }`}
//                           onClick={() => day && handleDateClick(day)}
//                         >
//                           {day}
//                         </div>
//                       )
//                     })}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="lg:col-span-2">
//             <div className="space-y-4">
//               {filteredEvents.length === 0 ? (
//                 <Card className="border-l-4 border-l-gray-300">
//                   <CardContent className="p-4 text-center text-main-text/70">
//                     <p>
//                       {selectedDayInMonth !== null
//                         ? `選択された日付 (${displayMonth.getFullYear()}年${displayMonth.getMonth() + 1}月${selectedDayInMonth}日) にはイベントがありません。`
//                         : `選択された月 (${displayMonth.getFullYear()}年${displayMonth.getMonth() + 1}月) にはイベントがありません。`}
//                     </p>
//                   </CardContent>
//                 </Card>
//               ) : (
//                 filteredEvents.map((event) => (
//                   <Card key={event.id} className="border-l-4 border-l-point-blue">
//                     <CardHeader className="p-4 pb-0">
//                       <div className="flex gap-2 mb-2">
//                         <Badge className={`${getStatusColor(event.status)}`}>{event.status}</Badge>
//                       </div>
//                     </CardHeader>
//                     <CardContent className="p-4 pt-0">
//                       <div className="flex items-center justify-between">
//                         <div className="flex-grow">
//                           <CardTitle className="text-main-text text-xl font-bold mb-2">
//                             {event.title}
//                           </CardTitle>
//                           <div className="text-sm text-main-text/70 space-y-1">
//                             <div className="flex items-center">
//                               <Calendar className="h-4 w-4 mr-1" />
//                               {event.date} {event.time}
//                             </div>
//                             <div className="flex items-center">
//                               <MapPin className="h-4 w-4 mr-1" />
//                               {event.location}
//                             </div>
//                             <div className="flex items-center">
//                               <Users className="h-4 w-4 mr-1 text-point-purple" />
//                               {event.participantsCount}/{event.maxParticipants}人
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex flex-col items-end ml-4">
//                           <Button
//                             size="sm"
//                             className="bg-point-blue hover:bg-point-blue/90 mb-2"
//                             onClick={() =>
//                               navigateWithCalendarState(`/admin/events/${event.id}/participants`)
//                             }
//                           >
//                             参加者確認
//                           </Button>
//                           <Button
//                             size="sm"
//                             className="bg-point-purple hover:bg-point-purple/90 mb-2"
//                             onClick={() =>
//                               navigateWithCalendarState(`/admin/events/${event.id}/detail`)
//                             }
//                           >
//                             詳細表示
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             className="border-point-pink text-point-pink hover:bg-point-pink hover:text-white"
//                             onClick={() => handleDeleteEvent(event.id, event.title)}
//                           >
//                             <Trash2 className="h-4 w-4 mr-1" />
//                             このイベントを削除
//                           </Button>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft,
  Plus,
  Calendar,
  MapPin,
  Users,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

type Event = {
  id: string
  title: string
  description: string
  date: string // YYYY-MM-DD
  startTime: string
  endTime: string
  location: string
  requiredItems?: string | null
  specialNotes?: string | null
  capacity?: number | null
  deadline?: string | null
  pointReward: number
  privilegeAllowed: boolean
  createdById: string
  status: string // イベントのステータス
  participantsCount?: number
  maxParticipants?: number
}

export default function EventsList() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialYear = searchParams?.get('year')
  const initialMonth = searchParams?.get('month')
  const initialDay = searchParams?.get('day')

  const [displayMonth, setDisplayMonth] = useState(() => {
    if (initialYear && initialMonth) {
      return new Date(Number.parseInt(initialYear), Number.parseInt(initialMonth))
    }
    return new Date()
  })

  const [selectedDayInMonth, setSelectedDayInMonth] = useState<number | null>(() => {
    if (initialDay) {
      return Number.parseInt(initialDay)
    }
    return null
  })

  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const fetchEvents = async () => {
      const year = displayMonth.getFullYear()
      const month = displayMonth.getMonth() + 1
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events?year=${year}&month=${month}`
        )
        const data = await res.json()
        setEvents(data)
      } catch (error) {
        console.error('イベントデータの取得に失敗しました:', error)
        alert('イベントデータの取得に失敗しました。')
      }
    }
    fetchEvents()
  }, [displayMonth])

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
  }, [events])

  // ステータス色ベタ書きstyle
  const getStatusColor = (status: string) => {
    switch (status) {
      case '募集中':
        return { background: '#f8bedf', color: '#fff' }
      case '満員':
        return { background: '#b39ddb', color: '#fff' }
      case '終了':
        return { background: '#a1a1aa', color: '#fff' }
      default:
        return { background: '#7eb8f6', color: '#fff' }
    }
  }

  const eventDatesInDisplayMonth = useMemo(() => {
    const year = displayMonth.getFullYear()
    const month = displayMonth.getMonth()
    const dates = new Set<number>()
    sortedEvents.forEach((event) => {
      const eventDate = new Date(event.date)
      if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
        dates.add(eventDate.getDate())
      }
    })
    return dates
  }, [displayMonth, sortedEvents])

  const calendarDays = useMemo(() => {
    const year = displayMonth.getFullYear()
    const month = displayMonth.getMonth()
    const firstDayOfMonth = new Date(year, month, 1)
    const startingDay = firstDayOfMonth.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days: (number | null)[] = []
    for (let i = 0; i < startingDay; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(i)
    return days
  }, [displayMonth])

  const handleDeleteEvent = (eventId: string, eventTitle: string) => {
    if (window.confirm(`本当にイベント「${eventTitle}」を削除しますか？`)) {
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId))
      alert(`イベント「${eventTitle}」を削除しました。`)
    }
  }

  const goToPreviousMonth = () => {
    setDisplayMonth((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setMonth(prevDate.getMonth() - 1)
      setSelectedDayInMonth(null)
      return newDate
    })
  }

  const goToNextMonth = () => {
    setDisplayMonth((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setMonth(prevDate.getMonth() + 1)
      setSelectedDayInMonth(null)
      return newDate
    })
  }

  const handleDateClick = (day: number) => {
    setSelectedDayInMonth(day)
  }

  const filteredEvents = useMemo(() => {
    const year = displayMonth.getFullYear()
    const month = displayMonth.getMonth()
    return sortedEvents.filter((event) => {
      const eventDate = new Date(event.date)
      const eventYear = eventDate.getFullYear()
      const eventMonth = eventDate.getMonth()
      const eventDay = eventDate.getDate()
      if (selectedDayInMonth !== null) {
        return eventYear === year && eventMonth === month && eventDay === selectedDayInMonth
      } else {
        return eventYear === year && eventMonth === month
      }
    })
  }, [displayMonth, selectedDayInMonth, sortedEvents])

  const navigateWithCalendarState = (path: string) => {
    const year = displayMonth.getFullYear()
    const month = displayMonth.getMonth()
    const day = selectedDayInMonth || ''
    const query = new URLSearchParams()
    query.set('year', year.toString())
    query.set('month', month.toString())
    if (day) query.set('day', day.toString())
    router.push(`${path}?${query.toString()}`)
  }

  // ★↓↓ returnはここだけ！関数の一番最後↓↓
  return (
    <div className="min-h-screen p-4 bg-[#fcf6ea]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => router.push('/admin/menu')}
              className="mr-4 text-main-text hover:bg-point-purple/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              管理ダッシュボードへ
            </Button>
            <h1 className="text-2xl font-bold text-main-text">イベント管理</h1>
          </div>
          <Button
            onClick={() => router.push('/admin/events/new')}
            className="
                bg-[#e086b7]
                hover:bg-[#eac6d9]
                text-white
                font-bold
                shadow
                transition
                duration-200
                scale-100
                hover:scale-105
              "
          >
            <Plus className="h-4 w-4 mr-2" />
            新しいイベント
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="bg-[#fffbe9] border border-[#ece2ce] shadow-sm">
              <CardHeader>
                <CardTitle className="text-main-text flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-point-blue" />
                  カレンダー
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-main-text/70">
                  <div className="flex items-center justify-between mb-4">
                    <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <p className="text-lg font-semibold text-main-text">
                      {displayMonth.getFullYear()}年 {displayMonth.getMonth() + 1}月
                    </p>
                    <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 mt-4 text-sm">
                    {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
                      <div key={day} className="p-2 font-semibold text-center">
                        {day}
                      </div>
                    ))}
                    {calendarDays.map((day, index) => {
                      const isSelected = selectedDayInMonth === day
                      const hasEvent = day && eventDatesInDisplayMonth.has(day)
                      return (
                        <div
                          key={index}
                          className={`p-2 text-center rounded relative ${day ? 'cursor-pointer' : ''} ${
                            isSelected
                              ? 'bg-[#e086b7] text-white'
                              : hasEvent
                                ? 'border-2 border-[#eac6d9] bg-[#fffbe9]'
                                : ''
                          }`}
                          onClick={() => day && handleDateClick(day)}
                        >
                          {day}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-4">
              {filteredEvents.length === 0 ? (
                <Card className="border-l-4 border-l-gray-300 bg-[#fffbe9]">
                  <CardContent className="p-4 text-center text-main-text/70">
                    <p>
                      {selectedDayInMonth !== null
                        ? `選択された日付 (${displayMonth.getFullYear()}年${displayMonth.getMonth() + 1}月${selectedDayInMonth}日) にはイベントがありません。`
                        : `選択された月 (${displayMonth.getFullYear()}年${displayMonth.getMonth() + 1}月) にはイベントがありません。`}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredEvents.map((event) => (
                  <Card key={event.id} className="border-l-4 border-l-point-blue bg-[#fffbe9]">
                    <CardHeader className="p-4 pb-0">
                      <div className="flex gap-2 mb-2">
                        <span
                          style={{
                            display: 'inline-block',
                            borderRadius: '9999px',
                            padding: '0.25em 1em',
                            fontWeight: 600,
                            fontSize: '0.95em',
                            ...getStatusColor(event.status),
                          }}
                        >
                          {event.status}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex-grow">
                          <CardTitle className="text-main-text text-xl font-bold mb-2">
                            {event.title}
                          </CardTitle>
                          <div className="text-sm text-main-text/70 space-y-1">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {event.date} {event.startTime} - {event.endTime}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {event.location}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-point-purple" />
                              {event.participantsCount}/{event.capacity}人
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end ml-4">
                          <Button
                            size="sm"
                            className="
                                  bg-blue-600
                                  hover:bg-blue-700
                                  text-white
                                  mb-2
                                  shadow
                                  transition
                                  duration-200
                                  scale-100
                                  hover:scale-105
                                "
                            onClick={() =>
                              navigateWithCalendarState(`/admin/events/${event.id}/participants`)
                            }
                          >
                            参加者確認
                          </Button>
                          <Button
                            size="sm"
                            className="
                                bg-[#e086b7]
                                hover:bg-[#eac6d9]
                                text-white
                                mb-2
                                shadow
                                transition
                                duration-200
                                scale-100
                                hover:scale-105
                              "
                            onClick={() =>
                              navigateWithCalendarState(`/admin/events/${event.id}/detail`)
                            }
                          >
                            詳細表示
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="
                                border-[#eac6d9]
                                text-[#e086b7]
                                hover:bg-[#eac6d9]
                                hover:text-white
                                transition
                                duration-200
                                scale-100
                                hover:scale-105
                              "
                            onClick={() => handleDeleteEvent(event.id, event.title)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            このイベントを削除
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
