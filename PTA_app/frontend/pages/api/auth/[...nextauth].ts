import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github" // 例: GitHub認証

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // 他のプロバイダーもここに追加可能
  ],
  // 必要に応じてコールバックやDB設定も追加
})