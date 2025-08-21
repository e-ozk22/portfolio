import { getAuth } from 'firebase/auth'

export const getCurrentUserToken = async () => {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('ユーザーが認証されていません')
  }

  try {
    const idToken = await user.getIdToken()
    return idToken
  } catch (error) {
    console.error('IDトークンの取得に失敗:', error)
    throw new Error('IDトークンの取得に失敗しました')
  }
}
