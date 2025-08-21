import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SheetTrigger } from "@/components/ui/sheet"
import type React from "react" // Reactをインポート

interface HeaderProps {
  title: string
  rightContent?: React.ReactNode // 右側に表示するコンテンツを追加
}

export function Header({ title, rightContent }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 bg-background border-b border-border shadow-sm">
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-foreground">
          <Menu className="h-6 w-6" />
          <span className="sr-only">メニューを開く</span>
        </Button>
      </SheetTrigger>
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
      {/* rightContent があれば表示、なければレイアウト調整用のプレースホルダー */}
      {rightContent ? rightContent : <div className="w-6"></div>}
    </header>
  )
}
