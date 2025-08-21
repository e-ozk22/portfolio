// TODO 認証入れる

'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  ProfileCard,
  ProfileCardContent,
  ProfileCardHeader,
  ProfileCardTitle,
} from '@/components/ui/profile-card'
import { Label } from '@/components/ui/label'

import { ArrowLeft, Calendar } from 'lucide-react'

export default function CreateEvent() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    capacity: '',
    pointReward: '', // 合計ポイント
    category: '',
    requiredItems: '',
    specialNotes: '', // 新しいフィールド
  })

  // 日付の自動フォーマット関数
  const formatDateValue = (value: string): string => {
    const cleaned = value.replace(/\D/g, '') // 数字以外を削除
    if (cleaned.length <= 4) {
      return cleaned
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`
    } else {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`
    }
  }

  // 時間の自動フォーマット関数
  const formatTimeValue = (value: string): string => {
    const cleaned = value.replace(/\D/g, '') // 数字以外を削除
    if (cleaned.length <= 2) {
      return cleaned.padStart(2, '0')
    } else if (cleaned.length <= 4) {
      const hours = cleaned.slice(0, cleaned.length - 2).padStart(2, '0')
      const minutes = cleaned.slice(cleaned.length - 2)
      return `${hours}:${minutes}`
    }
    return cleaned.slice(0, 4)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        //Authorization: `Bearer ${idToken}`, // トークンをヘッダーに追加
      },
      body: JSON.stringify({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        capacity: formData.capacity ? Number(formData.capacity) : null, // 数値に変換
        requiredItems: formData.requiredItems, // 任意項目
        specialNotes: formData.specialNotes,
        createdById: 'ae388d6b-5ab2-4414-a47c-f4fa0e346447', // 仮のユーザーID
        deadline: formData.date, // 必要なら
        pointReward: Number(formData.pointReward), // 合計ポイントを数値に変換
        privilegeAllowed: true,
      }),
    })

    if (res.ok) {
      alert('イベントが登録されました！')
      router.push('/admin/menu')
    } else {
      console.error('イベント作成に失敗しました')
      alert('イベントの作成に失敗しました。もう一度お試しください。')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDateBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const formattedValue = formatDateValue(e.target.value)
    setFormData((prev) => ({ ...prev, date: formattedValue }))
  }

  const handleTimeBlur = (
    field: 'startTime' | 'endTime',
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    const formattedValue = formatTimeValue(e.target.value)
    setFormData((prev) => ({ ...prev, [field]: formattedValue }))
  }
  console.log(`${process.env.NEXT_PUBLIC_API_URL}/api/events`)

  return (
    <div className="min-h-screen p-4 bg-[#fcf6ea]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/menu')}
            className="mr-4 text-main-text hover:bg-[#eac6d9]/30"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            管理ダッシュボードへ
          </Button>
          <h1 className="text-2xl font-bold text-main-text">新しいイベントを作成</h1>
        </div>

        <ProfileCard className="bg-[#fffbe9] border border-[#ece2ce] shadow-sm">
          <ProfileCardHeader>
            <ProfileCardTitle className="text-main-text flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-[#a6b7e7]" />
              イベント詳細
            </ProfileCardTitle>
          </ProfileCardHeader>
          <ProfileCardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">イベント名 *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="例：運動会準備ボランティア"
                    required
                    className="border-[#eac6d9] focus:border-blue-600 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">開催日 *</Label>
                  <Input
                    id="date"
                    type="text"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    onBlur={handleDateBlur}
                    placeholder="例：20240506"
                    maxLength={10}
                    required
                    className="border-[#eac6d9] focus:border-blue-600 bg-white"
                  />
                  <div className="text-xs text-main-text/60 mt-1">例: 20240506 → 2024-05-06</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">開始時間 *</Label>
                    <Input
                      id="startTime"
                      type="text"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      onBlur={(e) => handleTimeBlur('startTime', e)}
                      placeholder="例：930"
                      maxLength={5}
                      required
                      className="border-[#eac6d9] focus:border-blue-600 bg-white"
                    />
                    <div className="text-xs text-main-text/60 mt-1">例: 930 → 09:30</div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">終了時間</Label>
                    <Input
                      id="endTime"
                      type="text"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      onBlur={(e) => handleTimeBlur('endTime', e)}
                      placeholder="例：1700"
                      maxLength={5}
                      className="border-[#eac6d9] focus:border-blue-600 bg-white"
                    />
                    <div className="text-xs text-main-text/60 mt-1">例: 1700 → 17:00 (任意)</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">開催場所 *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="例：保育園ホール"
                    required
                    className="border-[#eac6d9] focus:border-blue-600 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">募集人数</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    placeholder="例：10"
                    className="border-[#eac6d9] focus:border-blue-600 bg-white"
                  />
                </div>

                {/* ポイント設定フィールド */}
                <div className="space-y-2">
                  <Label htmlFor="pointReward">合計ポイント *</Label>
                  <Input
                    id="pointReward"
                    type="number"
                    value={formData.pointReward}
                    onChange={(e) => handleInputChange('pointReward', e.target.value)}
                    placeholder="例：100"
                    required
                    className="border-[#eac6d9] focus:border-blue-600 bg-white"
                  />
                </div>
              </div>

              <div className="md:col-span-2 text-sm text-main-text/60 mt-1">
                <p>ポイント計算の目安 (保護者側の30分区切り選択を想定):</p>
                <ul className="list-disc list-inside ml-4">
                  <li>30分程度の作業: 10pt</li>
                  <li>1時間 (60分) 程度の作業: 20pt</li>
                  <li>1時間30分 (90分) 程度の作業: 30pt</li>
                  <li>2時間 (120分) 程度の作業: 40pt</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">イベント詳細 *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="イベントの詳細な説明を入力してください..."
                  rows={4}
                  required
                  className="border-[#eac6d9] focus:border-blue-600 bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requiredItems">持ち物</Label>
                <Textarea
                  id="requiredItems"
                  value={formData.requiredItems}
                  onChange={(e) => handleInputChange('requiredItems', e.target.value)}
                  placeholder="例：動きやすい服装、軍手、飲み物"
                  rows={3}
                  className="border-[#eac6d9] focus:border-blue-600 bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialNotes">特記事項</Label>
                <Textarea
                  id="specialNotes"
                  value={formData.specialNotes}
                  onChange={(e) => handleInputChange('specialNotes', e.target.value)}
                  placeholder="例：小雨決行。中止の場合は当日午前中に連絡します。"
                  rows={3}
                  className="border-[#eac6d9] focus:border-blue-600 bg-white"
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
                  イベントを作成
                </Button>
              </div>
            </form>
          </ProfileCardContent>
        </ProfileCard>
      </div>
    </div>
  )
}
