import { useState, useEffect } from 'react'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
} from 'firebase/auth'
// ここを修正！named importにする（asで好きな名前で使える）
import { app as firebaseApp } from '../lib/firebase'

// 必ず「初期化済みapp」を渡してgetAuth(firebaseApp)でauthインスタンス生成
const auth = getAuth(firebaseApp)

export function useAuth() {
  const [user, setUser] = useState<User | null>(auth.currentUser)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser)
    return () => unsub()
  }, [])

  // ログイン
  const login = async (email: string, password: string): Promise<User | null> => {
    setError(null)
    setLoading(true)
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      setUser(cred.user)
      return cred.user // ← これを追加！
    } catch (e: any) {
      console.log(e.message)
      return null // ログイン失敗時は null
    } finally {
      setLoading(false)
    }
  }

  // 新規登録
  const register = async (email: string, password: string) => {
    setError(null)
    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      setUser(cred.user)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // ログアウト
  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  return { user, login, register, logout, loading, error }
}
