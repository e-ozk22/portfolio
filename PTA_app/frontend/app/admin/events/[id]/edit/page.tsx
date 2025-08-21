'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { Label } from '@/components/ui/label'
import { ArrowLeft, Calendar } from 'lucide-react'

export default function EditEvent() {
  const router = useRouter()
  const params = useParams()
  const eventIdRaw = params?.id
  const eventId = Array.isArray(eventIdRaw) ? eventIdRaw[0] : eventIdRaw

  useEffect(() => {
    if (!eventId) {
      router.push('/404')
    }
  }, [eventId, router])

  // フォームデータの状態管理
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    capacity: '',
    requiredItems: '',
    specialNotes: '',
    pointReward: '',
  })

  // フォーマット関数
  const formatDateValue = (value: string): string => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 4) return cleaned
    if (cleaned.length <= 6) return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`
  }

  const formatTimeValue = (value: string): string => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 2) return cleaned.padStart(2, '0')
    if (cleaned.length <= 4) {
      const hours = cleaned.slice(0, cleaned.length - 2).padStart(2, '0')
      const minutes = cleaned.slice(cleaned.length - 2)
      return `${hours}:${minutes}`
    }
    return cleaned.slice(0, 4)
  }

  // データ取得
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`)
        if (!res.ok) {
          throw new Error('イベント取得失敗')
        }
        const data = await res.json()
        setFormData({
          title: data.title || '',
          description: data.description || '',
          date: data.date ? data.date.slice(0, 10) : '',
          startTime: data.startTime || '',
          endTime: data.endTime || '',
          location: data.location || '',
          capacity: data.capacity?.toString() || '',
          requiredItems: data.requiredItems || '',
          specialNotes: data.specialNotes || '',
          pointReward: data.pointReward?.toString() || '',
        })
      } catch (err) {
        console.error(err)
        alert('取得失敗')
      }
    }

    if (eventId) fetchEvent()
  }, [eventId])

  // 入力変更
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // データ送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          capacity: formData.capacity ? Number(formData.capacity) : null,
          pointReward: formData.pointReward ? Number(formData.pointReward) : 0,
        }),
      })
      if (res.ok) {
        alert('更新完了！')
        router.push('/admin/menu') // 更新後のリダイレクト
      } else {
        const error = await res.json()
        console.error(error)
        alert('更新失敗')
      }
    } catch (err) {
      console.error(err)
      alert('通信失敗')
    }
  }

  return (
    <div className="min-h-screen p-4 bg-[#fcf6ea]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/menu')}
            className="mr-4 text-main-text hover:bg-point-purple/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            管理ダッシュボードへ
          </Button>
          <h1 className="text-2xl font-bold text-main-text">イベントを編集</h1>
        </div>

        <div className="rounded-2xl shadow-md border border-[#ece2ce] bg-[#fffbe9] p-8">
          <div className="mb-8 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-point-blue" />
            <span className="text-xl font-semibold text-main-text">イベント詳細</span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">イベント名 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  className="bg-white/90"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">開催日 *</Label>
                <Input
                  id="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  onBlur={(e) => handleInputChange('date', formatDateValue(e.target.value))}
                  required
                  className="bg-white/90"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">開始時間 *</Label>
                <Input
                  id="startTime"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  onBlur={(e) => handleInputChange('startTime', formatTimeValue(e.target.value))}
                  required
                  className="bg-white/90"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">終了時間</Label>
                <Input
                  id="endTime"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  onBlur={(e) => handleInputChange('endTime', formatTimeValue(e.target.value))}
                  className="bg-white/90"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">開催場所 *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                  className="bg-white/90"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">募集人数</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  className="bg-white/90"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pointReward">合計ポイント *</Label>
                <Input
                  id="pointReward"
                  type="number"
                  value={formData.pointReward}
                  onChange={(e) => handleInputChange('pointReward', e.target.value)}
                  required
                  className="bg-white/90"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">詳細 *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
                className="bg-white/90"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requiredItems">持ち物</Label>
              <Textarea
                id="requiredItems"
                value={formData.requiredItems}
                onChange={(e) => handleInputChange('requiredItems', e.target.value)}
                className="bg-white/90"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialNotes">特記事項</Label>
              <Textarea
                id="specialNotes"
                value={formData.specialNotes}
                onChange={(e) => handleInputChange('specialNotes', e.target.value)}
                className="bg-white/90"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="border-[#eac6d9] text-[#e086b7] hover:bg-[#eac6d9] hover:text-white"
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                className="
                bg-blue-600
                hover:bg-blue-700
                text-white
                font-bold
                shadow
                transition
                duration-200
                scale-100
                hover:scale-105
                "
              >
                更新する
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
