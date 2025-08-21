'use client'
import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, School } from 'lucide-react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { app } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

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

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const auth = getAuth(app)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('👤 Firebase user:', user)

      if (!user) {
        console.log('❌ 未ログイン、ログイン画面へリダイレクト')
        router.push('/login')
        return
      }

      const token = await user.getIdToken(true)
      console.log('🪪 取得したトークン:', token)

      const uid = user.uid

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/by-firebase-uid/${uid}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (!res.ok) {
        console.error('ユーザープロフィールの取得に失敗')
        router.push('/login')
        return
      }

      const data = await res.json()
      setUserProfile(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) return <div>読み込み中...</div>
  if (!userProfile) return <div>プロフィールが見つかりませんでした。</div>

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MobileNav>
        <Header title="プロフィール" />
      </MobileNav>

      <main className="p-4 max-w-md mx-auto">
        <Card className="border-border bg-card text-card-foreground">
          <CardHeader className="flex flex-col items-center text-center pb-4">
            <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
              <AvatarImage
                src={userProfile.profileImageUrl || '/placeholder.svg'}
                alt={userProfile.name}
              />
              <AvatarFallback>{userProfile?.name?.charAt(0) ?? ''}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl font-bold">{userProfile.name}</CardTitle>
            <p className="text-sm text-muted-foreground">保護者</p>
          </CardHeader>

          <CardContent className="space-y-4">
            {userProfile.children.map((child, index) => (
              <div key={index} className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">お子様の名前</p>
                  <p className="font-medium text-lg">{child.name}</p>
                </div>

                <School className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">クラス</p>
                  <p className="font-medium text-lg">{child.className}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
