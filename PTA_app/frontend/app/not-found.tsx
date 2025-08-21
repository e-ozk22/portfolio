import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Frown } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 text-center">
      <Frown className="h-24 w-24 text-primary mb-6" />
      <h1 className="text-4xl font-bold mb-4">404 - ページが見つかりません</h1>
      <p className="text-lg text-muted-foreground mb-8">
        お探しのイベントまたはページは見つかりませんでした。
        <br />
        URLが正しいかご確認ください。
      </p>
      <Link href="/" passHref>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">イベント一覧に戻る</Button>
      </Link>
    </div>
  )
}
