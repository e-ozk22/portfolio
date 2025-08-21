'use client'

import { useRouter } from 'next/navigation'
import { Button } from '../../../components/ui/button'
import {
  ProfileCard,
  ProfileCardContent,
  ProfileCardDescription,
  ProfileCardHeader,
  ProfileCardTitle,
} from '../../../components/ui/profile-card'
import { Badge } from '../../../components/ui/badge'
import { Calendar, Plus, Award, CreditCard, LogOut, Bell, Users, Star } from 'lucide-react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../../lib/firebase' // Firebaseの認証インスタンスをインポート
import { useEffect, useState } from 'react'

// 型定義を追加
interface MenuItem {
  title: string
  description: string
  icon: React.ComponentType<any>
  color: string
  href: string
  count?: number
  countLabel?: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login') // 未認証の場合はログインページへリダイレクト
        return
      }
      try {
        // Firebase IDトークンを取得
        const token = await user.getIdToken()

        // Authorizationヘッダーを設定してユーザープロフィールを取得
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/by-firebase-uid/${user.uid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const userProfile = await res.json()

        if (userProfile.role === 'staff') {
          setIsAuthorized(true)
        } else {
          router.push('/') // 権限がない場合はホームへリダイレクト
        }
      } catch (error) {
        console.error('ユーザープロフィールの取得に失敗しました:', error)
        router.push('/login') // エラーが発生した場合もログインページへリダイレクト
      } finally {
        setIsLoading(false)
      }
    })
    return () => unsubscribe()
  }, [])

  if (isLoading || !isAuthorized) {
    return null // ローディング中または未認証の場合は何も表示しない
  }

  const menuItems: MenuItem[] = [
    {
      title: 'イベント作成', // 1番目
      description: '新しいイベントを作成する',
      icon: Plus,
      color: 'bg-pink-200',
      href: '/admin/events/new',
    },
    {
      title: 'イベント管理', // 2番目
      description: 'PTA活動やボランティアイベントの作成・編集',
      icon: Calendar,
      color: 'bg-blue-200',
      href: '/admin/events',
      //href: '/admin/events/[id]/edit',
      //count: 8,
      countLabel: 'アクティブ',
    },
    {
      title: 'ポイント付与', // 3番目
      description: '参加者にポイントを付与・管理',
      icon: Award,
      color: 'bg-yellow-200',
      href: '/admin/points',
      //count: 15,
      countLabel: '今月付与',
    },
    {
      title: '優先権管理', // 4番目
      description: '特定の保護者の優先権ステータスを確認・管理',
      icon: Star,
      color: 'bg-yellow-300',
      href: '/admin/rewards',
    },
    {
      title: '決済管理', // 5番目
      description: 'アプリ利用料金の支払い設定',
      icon: CreditCard,
      color: 'bg-purple-200',
      href: '/admin/card',
    },
  ]

  return (
    // ★ 背景色も標準色に変更（例：bg-[#faf6e6] #fcf6ea→ bg-yellow-50）
    <div className="min-h-screen bg-[#fcf6ea] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4"> */}
        <div className="flex items-center gap-6 mb-8 justify-between">
          {/* 左側：ロゴ＋タイトル */}
          <div className="flex items-center gap-6">
            <img
              src="/chocot-logo.png"
              alt="Chocotロゴ"
              width={80}
              height={80}
              className="rounded-full"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">管理ダッシュボード</h1>
              <p className="text-gray-600">PTA活動管理システム「ちょこっと」 - さくら保育園</p>
            </div>
          </div>
          {/* 右側：通知・ログアウト */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-purple-300 text-purple-600 hover:bg-purple-100 hover:text-purple-900"
            >
              <Bell className="h-4 w-4 mr-2" />
              通知
              {/* <Badge className="ml-2 bg-pink-400 text-white"></Badge> */}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/login')}
              className="border-pink-300 text-pink-600 hover:bg-pink-200 hover:text-pink-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              ログアウト
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインメニュー */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">管理メニュー</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.map((item, index) => (
                <ProfileCard
                  key={index}
                  className="cursor-pointer border-2 border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => router.push(item.href)}
                >
                  <ProfileCardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-lg ${item.color}`}>
                          <item.icon className="h-6 w-6 text-white" />
                        </div>
                        <ProfileCardTitle className="text-gray-900 text-lg font-bold">
                          {item.title}
                        </ProfileCardTitle>
                      </div>
                      {'count' in item && typeof item.count === 'number' && item.count > 0 && (
                        <Badge className="bg-purple-400 text-white text-sm px-3 py-1 rounded-full">
                          {item.count}
                        </Badge>
                      )}
                    </div>
                  </ProfileCardHeader>
                  <ProfileCardContent className="px-4 pt-0 pb-4">
                    <ProfileCardDescription className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </ProfileCardDescription>
                    {item.countLabel && (
                      <div className="text-xs text-gray-400 mt-2">{item.countLabel}</div>
                    )}
                  </ProfileCardContent>
                </ProfileCard>
              ))}
            </div>
          </div>

          {/* サイドバー - 今日の予定 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">今日の予定</h2>
            <ProfileCard className="border border-gray-300">
              <ProfileCardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">PTA定例会議</div>
                      <div className="text-gray-600 text-xs">19:00 - 会議室A</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-pink-100 rounded-lg">
                    <Users className="h-4 w-4 text-pink-400" />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">
                        ボランティア募集締切
                      </div>
                      <div className="text-gray-600 text-xs">運動会準備 - 23:59まで</div>
                    </div>
                  </div>
                </div>
              </ProfileCardContent>
            </ProfileCard>
          </div>
        </div>
      </div>
    </div>
  )
}
