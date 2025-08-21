// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',

    // ↓↓↓ 以下を追加：カバレッジ計測設定
    coverage: {
      provider: 'v8', // ← coverage provider（@vitest/coverage-v8 を使う）
      reporter: ['text', 'html'], // ← コンソール＋HTML形式で出力
      reportsDirectory: './coverage', // ← 出力先ディレクトリ
      exclude: ['**/__tests__/**', '**/*.test.tsx', '**/*.test.ts'], // 任意：レポートに含めないテストファイル
    },
  },
})
