// 元々入っていたもの
// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

// 修正バージョン
// import withPWA from "next-pwa";

// const nextConfig = {
//   reactStrictMode: true,
//   // 他のNext.js設定...
// };

// const pwaConfig = {
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: false, // ← 一時的にこれにして試す
//   //disable: process.env.NODE_ENV === "development",
// };

// export default withPWA(pwaConfig)(nextConfig);

import nextPWA from 'next-pwa';

const withPWA = nextPWA({
  dest: 'public',
  //register: true,
  //skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // 開発中は無効化
});

const nextConfig = withPWA({
  reactStrictMode: true,
});

export default nextConfig;