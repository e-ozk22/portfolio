// tailwind-merge と clsx を使ってクラス名を結合するユーティリティ関数を定義

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ...inputs は可変長引数で、関数に渡したすべての引数を inputs という配列にまとめる
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}
