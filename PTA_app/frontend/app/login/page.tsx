'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/use-auth'

export default function LoginPage() {
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // 0: 保護者, 1: 保育園
  const [role, setRole] = useState(0)
  const [remember, setRemember] = useState(false)
  const router = useRouter()

  // タイトル
  const title = role === 0 ? 'おかえりなさい！' : 'ようこそ！'

  // タブの親枠色
  const tabBorderColor = role === 0 ? 'border-[#eac6d9]' : 'border-[#bfcaf9]'

  // タブスタイル
  const parentTabClass =
    role === 0
      ? 'bg-white text-black font-bold text-xl shadow'
      : 'bg-[#bfcaf9] text-[#574e67] font-bold text-xl'
  const staffTabClass =
    role === 1
      ? 'bg-white text-black font-bold text-xl shadow'
      : 'bg-[#eac6d9] text-[#574e67] font-bold text-xl'

  // ログインボタン色
  const buttonColor =
    role === 0
      ? 'bg-[#eac6d9] hover:bg-[#e6b6cd]' // ピンク
      : 'bg-[#5376e5] hover:bg-[#395ac1]' // ブルー

  // ログイン処理（遷移含む）
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    //firebaseのログイン処理
    const user = await login(email, password)
    if (!user) return

    // firebaseのUIDを取得
    const uid = user.uid

    // ユーザー情報の取得
    const token = await user.getIdToken()

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/by-firebase-uid/${uid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      console.error('ユーザープロフィールの取得に失敗しました')
      return
    }

    const userProfile = await res.json()

    console.log('🔥 userProfile', userProfile)
    // ロールに応じて遷移
    if (userProfile.role === 'parent') {
      router.push('/')
    } else if (userProfile.role === 'staff') {
      router.push('/admin/menu')
    } else {
      console.error('不明なロール:', userProfile.role)
      router.push('/login')
    }
  }
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f7f3ef]">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-lg p-8 pt-12 flex flex-col items-center">
        {/* 上部アイコン */}
        <div>
          {/* アイコン画像を表示 */}
          <img src="/chocot-logo.png" alt="Chocotロゴ" width={180} height={180} className="mb-8" />
        </div>
        {/* タブ */}
        <div
          className={`flex w-full mb-6 border-2 rounded-full p-1 transition-all duration-300 ${tabBorderColor}`}
        >
          <button
            className={`flex-1 py-2 transition-all duration-200 ${parentTabClass} border-none outline-none rounded-l-full`}
            onClick={() => setRole(0)}
            type="button"
            style={{ border: 'none', outline: 'none' }}
          >
            保護者
          </button>
          <button
            className={`flex-1 py-2 transition-all duration-200 ${staffTabClass} border-none outline-none rounded-r-full`}
            onClick={() => setRole(1)}
            type="button"
            style={{ border: 'none', outline: 'none' }}
          >
            保育園
          </button>
        </div>
        {/* 見出し */}
        <h2 className="text-3xl font-extrabold mb-2 text-[#574e67] text-center">{title}</h2>
        <p className="text-gray-500 mb-6 text-center text-sm">
          ログインしてPTA活動を始めましょう。
        </p>
        {/* フォーム */}
        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div>
            <label className="block font-bold text-[#574e67] mb-1">メールアドレス</label>
            <input
              type="email"
              placeholder="メールアドレスを入力してください"
              className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block font-bold text-[#574e67] mb-1">パスワード</label>
            <input
              type="password"
              placeholder="パスワードを入力してください"
              className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              className="w-5 h-5 rounded border-gray-400"
              checked={remember}
              onChange={() => setRemember(!remember)}
            />
            <label htmlFor="remember" className="text-sm text-[#574e67]">
              ログイン状態を保持
            </label>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className={`w-full py-3 rounded-full text-lg font-bold text-white shadow-md mt-2 border-none outline-none ${buttonColor} transition-all`}
            disabled={loading}
            style={{ border: 'none', outline: 'none' }}
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
        <div className="mt-5 flex flex-col items-center w-full gap-2">
          <a href="#" className="text-sm text-[#5376e5] hover:underline">
            パスワードを忘れた方はこちら
          </a>
          <div className="text-sm text-[#574e67]">
            アカウントをお持ちでない方は
            <a href="/register" className="ml-1 text-[#5376e5] hover:underline">
              新規登録
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
