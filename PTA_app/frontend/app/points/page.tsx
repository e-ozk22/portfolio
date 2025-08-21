"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gift, History, Clock } from "lucide-react"
import { getUserPoints, spendPoints, getPointHistory } from "@/actions/points"


interface PointTransaction {
  id: string
  userId: string
  type: "earn" | "spend"
  amount: number
  description: string
  date: string
}

export default function PointsPage() {
  const router = useRouter()
  const [currentUserPoints, setCurrentUserPoints] = useState(0)
  const [exchangeMessage, setExchangeMessage] = useState("")
  const [isPending, setIsPending] = useState(false)
  const [userPointHistory, setUserPointHistory] = useState<PointTransaction[]>([])

  // デモ用のユーザーID (実際には認証システムから取得)
  const userId = "user1"

  // ポイント有効期限を動的に計算 (常に翌年の3月31日)
  const expirationDate = useMemo(() => {
    const today = new Date()
    const nextYear = today.getFullYear() + 1
    // 翌年の3月31日を設定
    const expiry = new Date(nextYear, 2, 31) // 月は0-indexedなので、3月は2
    return expiry.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })
  }, [])

  // 景品交換アイテムのデータを定義します。
  const exchangeItems = [
    {
      id: "item1",
      name: "運動会前列スペース",
      pointsRequired: 100,
      description: "1家庭1回まで、定員6家庭",
      limitType: "once_per_family",
    },
    {
      id: "item2",
      name: "面談時間 優先予約枠",
      pointsRequired: 30,
      description: "各時間帯ごとに枠制限あり",
      limitType: "no_limit",
    },
    // {
    //   id: "item3",
    //   name: "保護者参観日前列スペース",
    //   pointsRequired: 50,
    //   description: "年2回、定員4家庭",
    //   limitType: "twice_per_year",
    // },
    {
      id: "item4",
      name: "発表会前列スペース",
      pointsRequired: 100,
      description: "1家庭1回まで、定員6家庭",
      limitType: "once_per_family",
    },
    // {
    //   id: "item5",
    //   name: "卒園式前列スペース 冬",
    //   pointsRequired: 150,
    //   description: "1家庭1回まで、定員6家庭",
    //   limitType: "once_per_family",
    // },
  ]

  // ポイント情報と履歴をロード
  useEffect(() => {
    const loadData = async () => {
      const [points, history] = await Promise.all([getUserPoints(userId), getPointHistory(userId)])
      setCurrentUserPoints(points)
      setUserPointHistory(history)
    }
    loadData()
  }, [userId])



  const handleExchange = async (itemId: string, points: number, itemName: string) => {
    setIsPending(true)
    setExchangeMessage("")
  
    const itemToExchange = exchangeItems.find((item) => item.id === itemId)
    if (!itemToExchange) {
      setExchangeMessage("交換対象が見つかりませんでした。")
      setIsPending(false)
      return
    }
  
    if (itemToExchange.limitType === "once_per_family") {
      const hasExchanged = userPointHistory.some(
        (tx) => tx.type === "spend" && tx.description.includes(itemToExchange.name)
      )
      if (hasExchanged) {
        setExchangeMessage("この景品は1家庭1回までしか交換できません。")
        setIsPending(false)
        return
      }
    }
  
  
  
    // APIを呼び出してポイントを消費
    const result = await spendPoints(userId, points, `${itemName}と交換`)
    setExchangeMessage(result.message)

    if (result.success) {
      const [updatedPoints, updatedHistory] = await Promise.all([
        getUserPoints(userId),
        getPointHistory(userId)
      ])
      setCurrentUserPoints(updatedPoints)
      setUserPointHistory(updatedHistory)
    }

    setIsPending(false) 
  }
  

  const isExchangeDisabled = (item: (typeof exchangeItems)[0]) => {
    if (isPending || currentUserPoints < item.pointsRequired) {
      return true
    }
    if (item.limitType === "once_per_family") {
      const hasExchanged = userPointHistory.some((tx) => tx.type === "spend" && tx.description.includes(item.name))
      return hasExchanged
    }
    return false
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MobileNav>
        <Header title="ポイント確認/景品交換" />
      </MobileNav>

      <main className="p-4 max-w-md mx-auto">
        <Card className="mb-6 border-border bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">現在の獲得ポイント</CardTitle>
            <Gift className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-primary">{currentUserPoints}pt</div>
            <p className="text-sm text-muted-foreground mt-2">PTA活動へのご協力ありがとうございます！</p>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <Clock className="h-4 w-4 mr-1" />
              <span>有効期限: {expirationDate}</span>
            </div>
            <Button
              variant="secondary"
              onClick={() => router.push("/point-history")}
              className="w-full hover:bg-secondary hover:text-secondary-foreground flex items-center gap-2 mt-4"
            >
              <History className="h-5 w-5" />
              ポイント履歴を確認する
            </Button>
          </CardContent>
        </Card>

        <Card className="mb-6 border-border bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-lg font-medium">景品交換</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">貯まったポイントで、様々な景品と交換できます。</p>
            <div className="space-y-4">
              {exchangeItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0 border-border"
                >
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleExchange(item.id, item.pointsRequired, item.name)}
                    disabled={isExchangeDisabled(item)}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    {item.pointsRequired}ptで交換
                  </Button>
                </div>
              ))}
            </div>
            {exchangeMessage && (
              <p
                className={`text-center text-sm mt-4 ${exchangeMessage.includes("失敗") ? "text-destructive" : "text-primary"}`}
              >
                {exchangeMessage}
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}