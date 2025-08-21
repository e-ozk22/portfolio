"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react" // ArrowLeftアイコンをインポート
import { getPointHistory } from "@/actions/points" // Server Actionをインポート

interface PointTransaction {
  id: string
  userId: string
  type: "earn" | "spend"
  amount: number
  description: string
  date: string
}

export default function PointHistoryPage() {
  const router = useRouter()
  const [pointHistory, setPointHistory] = useState<PointTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // デモ用のユーザーID (実際には認証システムから取得)
  const userId = "user1"

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true)
      const history = await getPointHistory(userId)
      setPointHistory(history)
      setIsLoading(false)
    }
    loadHistory()
  }, [userId])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MobileNav>
        <Header
          title="ポイント履歴確認"
          rightContent={
            <Button
              variant="secondary" // secondary variantを使用
              onClick={() => router.push("/points")}
              className="px-3 py-1 rounded-full whitespace-nowrap hover:bg-secondary hover:text-secondary-foreground flex items-center gap-1 text-sm" // 丸い形状、ホバーなし、テキストサイズ調整
            >
              <ArrowLeft className="h-4 w-4" /> {/* アイコンを維持 */}
              {"戻る"} {/* テキストを「戻る」に変更 */}
            </Button>
          }
        />
      </MobileNav>

      <main className="p-4 max-w-md mx-auto">
        <Card className="border-border bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-xl font-bold">ポイント履歴</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground">履歴を読み込み中...</p>
            ) : pointHistory.length === 0 ? (
              <p className="text-center text-muted-foreground">まだポイント履歴はありません。</p>
            ) : (
              <div className="space-y-3">
                {pointHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0 border-border"
                  >
                    <div>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                      <p className="font-medium">{item.description}</p>
                    </div>
                    <span className={`font-bold ${item.type === "earn" ? "text-primary" : "text-destructive"}`}>
                      {item.type === "earn" ? "+" : "-"}
                      {item.amount}pt
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
