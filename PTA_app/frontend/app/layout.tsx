import type React from 'react'
import type { Metadata } from 'next'
import { M_PLUS_Rounded_1c } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const mPlusRounded1c = M_PLUS_Rounded_1c({
  weight: ['400', '700'], // Regular and Bold weights
  subsets: ['latin'],
  variable: '--font-rounded', // Define a CSS variable for the font
})

export const metadata: Metadata = {
  title: 'ちょこっと',
  description: '保護者のPTA活動参加を促進するアプリ',
  generator: 'v0.dev',
  manifest: '/manifest.json',
  themeColor: '#f8b9d4',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ちょこっと',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    //<html lang="ja" suppressHydrationWarning>
    <html lang="ja">
       <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/chocot-logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${mPlusRounded1c.variable} bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
         {/* ★ ここにService Worker登録スクリプトを追加 ★ */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                  }, function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
              });
            }
          `
        }} />
      </body>
    </html>
  )
}
