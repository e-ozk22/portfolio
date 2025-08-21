'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { CalendarDays, Gift, History, Award, UserCircle2, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button' // 追加：ログアウトボタン用
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase' // Firebaseの認証インスタンスをインポート
import { useMemo } from 'react'

interface MobileNavProps {
  children: React.ReactNode
}

interface ChildProfile {
  name: string
  className: string
}

interface UserProfile {
  id: string
  name: string
  profileImageUrl: string
  children: ChildProfile[]
  role: string
  isAdmin: boolean
}

export function MobileNav({ children }: MobileNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return

      const firebaseUid = user.uid
      console.log('Firebase UID:', firebaseUid)
      setIsLoadingProfile(true)

      try {
        const token = await user.getIdToken(true)

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/by-firebase-uid/${firebaseUid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (!res.ok) throw new Error('ユーザープロフィールの取得に失敗しました')

        const data: UserProfile = await res.json()
        setUserProfile(data)
      } catch (error) {
        console.error('プロフィール取得エラー:', error)
        setUserProfile(null)
      } finally {
        setIsLoadingProfile(false)
      }
    })
    return () => unsubscribe()
  }, [])

  // 追加：ログアウト処理（実際はFirebaseや認証サービスに応じて処理を修正）
  const handleLogout = () => {
    // ここにログアウト処理を書く（例: signOut()など）
    console.log('ログアウトしました')
    router.push('/login') // ログイン画面へリダイレクト（任意）
    setIsOpen(false)
  }

  const navItems = useMemo(() => {
    return [
      {
        name: 'プロフィール',
        href: userProfile ? `/profile/${userProfile.id}` : '#',
        icon: UserCircle2,
      },
      { name: 'イベント一覧', href: '/', icon: CalendarDays },
      { name: 'ポイント確認/景品交換', href: '/points', icon: Gift },
      { name: 'ポイント履歴確認', href: '/point-history', icon: History },
      { name: '優先権確認/使用', href: '/priority-rights', icon: Award },
    ]
  }, [userProfile])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <SheetContent
        side="left"
        className="w-[250px] sm:w-[300px] bg-background text-foreground flex flex-col"
      >
        <SheetHeader className="p-4 pb-0">
          <SheetTitle className="text-foreground">メニュー</SheetTitle>
        </SheetHeader>

        {/* メニュー本体を上下分割 */}
        <div className="flex flex-col flex-1 justify-between">
          <div>
            {isLoadingProfile ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                プロフィール読み込み中...
              </div>
            ) : userProfile ? (
              <div className="p-4 flex flex-col items-center text-center">
                <Avatar className="h-14 w-14 mb-2 border-2 border-primary">
                  <AvatarImage
                    src={userProfile.profileImageUrl || '/placeholder.svg'}
                    alt={userProfile.name}
                  />
                  <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="font-semibold text-base">{userProfile.name}</p>
                <div className="text-xs text-muted-foreground text-center space-y-0.5">
                  {userProfile.children.map((child, index) => (
                    <div key={index}>
                      {child.name}（{child.className}）
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground text-sm">
                プロフィール情報なし
              </div>
            )}

            <Separator className="my-2" />

            <nav className="flex flex-col gap-1 px-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary/20'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-base font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* ▼ ログアウトボタンを下部に設置 */}
          <div className="p-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              ログアウト
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
