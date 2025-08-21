// 実際のフォーム部分（入力・ボタンなど）
"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type UserType = "parent" | "teacher"
type FormType = "login" | "register"

interface AuthFormProps {
  userType: UserType
}

export function AuthForm({ userType }: AuthFormProps) {
  const [formType, setFormType] = useState<FormType>("login")
  const [isPending, startTransition] = useTransition()
  // const accentColor = userType === "parent" ? "pink-accent" : "blue-accent"

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    startTransition(async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log(`${userType} ${formType} submitted!`)
      // In a real app, you'd handle authentication here
    })
  }

  const title =
    userType === "parent"
      ? formType === "login"
        ? "おかえりなさい！"
        : "はじめまして！"
      : formType === "login"
        ? "ようこそ！"
        : "ご登録ください！"

  const description =
    formType === "login" ? "ログインしてPTA活動を始めましょう。" : "新しいアカウントを作成してPTA活動に参加しましょう。"

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-3xl font-bold mb-2 text-font-primary">{title}</h2>
      <p className="text-sm text-font-primary/80 mb-6 text-center">{description}</p>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        {formType === "register" && (
          <div>
            <Label htmlFor="name" className="text-font-primary">
              お名前
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="お名前を入力してください"
              className={cn(
                "mt-1 w-full rounded-lg p-3 border-2 focus:border-transparent focus:ring-2",
                userType === "parent" ? "focus:ring-pink-accent" : "focus:ring-blue-accent",
              )}
              required
            />
          </div>
        )}
        <div>
          <Label htmlFor="email" className="text-font-primary">
            メールアドレス
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="メールアドレスを入力してください"
            className={cn(
              "mt-1 w-full rounded-lg p-3 border-2 focus:border-transparent focus:ring-2",
              userType === "parent" ? "focus:ring-pink-accent" : "focus:ring-blue-accent",
            )}
            required
          />
        </div>
        <div>
          <Label htmlFor="password" className="text-font-primary">
            パスワード
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="パスワードを入力してください"
            className={cn(
              "mt-1 w-full rounded-lg p-3 border-2 focus:border-transparent focus:ring-2",
              userType === "parent" ? "focus:ring-pink-accent" : "focus:ring-blue-accent",
            )}
            required
          />
        </div>
        {formType === "register" && (
          <div>
            <Label htmlFor="confirm-password" className="text-font-primary">
              パスワード（確認）
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="パスワードをもう一度入力してください"
              className={cn(
                "mt-1 w-full rounded-lg p-3 border-2 focus:border-transparent focus:ring-2",
                userType === "parent" ? "focus:ring-pink-accent" : "focus:ring-blue-accent",
              )}
              required
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember-me"
            className={cn(
              "h-5 w-5 rounded-md border-2",
              userType === "parent"
                ? "data-[state=checked]:bg-pink-accent data-[state=checked]:text-white"
                : "data-[state=checked]:bg-blue-accent data-[state=checked]:text-white",
            )}
          />
          <Label htmlFor="remember-me" className="text-font-primary">
            ログイン状態を保持
          </Label>
        </div>

        <Button
          type="submit"
          className={cn(
            "w-full rounded-full py-3 text-lg font-semibold shadow-md transition-all duration-200",
            userType === "parent"
              ? "bg-pink-accent text-font-primary hover:bg-pink-accent/90" // 保護者向け: 背景ピンク、フォント濃グレー、ホバーで暗く
              : "bg-blue-accent hover:bg-blue-accent/90", // 保育園向け: 既存のソリッドスタイル
          )}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-label="Loading" />
          ) : formType === "login" ? (
            "ログイン"
          ) : (
            "新規登録"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        {formType === "login" ? (
          <>
            <a href="#" className="text-blue-accent hover:text-purple-accent transition-colors duration-200">
              パスワードを忘れた方はこちら
            </a>
            <p className="mt-2 text-font-primary">
              アカウントをお持ちでない方は{" "}
              <button
                onClick={() => setFormType("register")}
                className="text-blue-accent hover:text-purple-accent transition-colors duration-200"
              >
                新規登録
              </button>
            </p>
          </>
        ) : (
          <p className="text-font-primary">
            すでにアカウントをお持ちの方は{" "}
            <button
              onClick={() => setFormType("login")}
              className="text-blue-accent hover:text-purple-accent transition-colors duration-200"
            >
              ログイン
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
