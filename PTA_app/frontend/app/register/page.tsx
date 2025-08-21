'use client';

import { useState } from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from '../../hooks/use-auth';

export default function RegisterPage() {
  const { register, error } = useAuth();
  const [role, setRole] = useState(0); // 0: 保護者, 1: 保育園
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // タイトル
  const title = role === 0 ? 'はじめまして！' : 'ご登録ください！';

  // タブ枠色
  const tabBorderColor = role === 0 ? 'border-[#eac6d9]' : 'border-[#bfcaf9]';

  // タブスタイル
  const parentTabClass =
    role === 0
      ? 'bg-white text-black font-bold text-xl shadow'
      : 'bg-[#bfcaf9] text-[#574e67] font-bold text-xl';
  const staffTabClass =
    role === 1
      ? 'bg-white text-black font-bold text-xl shadow'
      : 'bg-[#eac6d9] text-[#574e67] font-bold text-xl';

  // ボタン色
  const buttonColor =
    role === 0
      ? 'bg-[#eac6d9] hover:bg-[#e6b6cd]' // ピンク
      : 'bg-[#5376e5] hover:bg-[#395ac1]'; // ブルー

  // 送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== password2) {
      alert('パスワードが一致しません');
      return;
    }
    setLoading(true);
    await register(email, password);
    router.push("/events"); // 新規登録後 /events へ遷移
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f7f3ef]">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-lg p-8 pt-12 flex flex-col items-center">
        {/* アイコン */}
        <div className="rounded-full w-24 h-24 bg-gray-100 flex items-center justify-center mb-4 shadow">
          <span className="text-4xl text-gray-400">⚪️</span>
        </div>
        {/* タブ */}
        <div
          className={`flex w-full mb-6 border-2 rounded-full p-1 transition-all duration-300 ${tabBorderColor}`}
        >
          <button
            className={`flex-1 py-2 transition-all duration-200 ${parentTabClass} border-none outline-none rounded-l-full`}
            onClick={() => setRole(0)}
            type="button"
            style={{ border: 'none', outline: 'none' }}
          >
            保護者
          </button>
          <button
            className={`flex-1 py-2 transition-all duration-200 ${staffTabClass} border-none outline-none rounded-r-full`}
            onClick={() => setRole(1)}
            type="button"
            style={{ border: 'none', outline: 'none' }}
          >
            保育園
          </button>
        </div>
        {/* 見出し */}
        <h2 className="text-3xl font-extrabold mb-2 text-[#574e67] text-center">{title}</h2>
        <p className="text-gray-500 mb-6 text-center text-sm">
          新しいアカウントを作成してPTA活動に参加しましょう。
        </p>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="block font-bold text-[#574e67] mb-1">お名前</label>
            <input
              type="text"
              placeholder="お名前を入力してください"
              className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-bold text-[#574e67] mb-1">メールアドレス</label>
            <input
              type="email"
              placeholder="メールアドレスを入力してください"
              className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block font-bold text-[#574e67] mb-1">パスワード</label>
            <input
              type="password"
              placeholder="パスワードを入力してください"
              className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block font-bold text-[#574e67] mb-1">パスワード（確認）</label>
            <input
              type="password"
              placeholder="パスワードをもう一度入力してください"
              className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              className="w-5 h-5 rounded border-gray-400"
              checked={remember}
              onChange={() => setRemember(!remember)}
            />
            <label htmlFor="remember" className="text-sm text-[#574e67]">
              ログイン状態を保持
            </label>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className={`w-full py-3 rounded-full text-lg font-bold text-white shadow-md mt-2 border-none outline-none ${buttonColor} transition-all`}
            disabled={loading}
            style={{ border: 'none', outline: 'none' }}
          >
            {loading ? '登録中...' : '新規登録'}
          </button>
        </form>
        <div className="mt-5 flex flex-col items-center w-full gap-2">
          <div className="text-sm text-[#574e67]">
            アカウントをお持ちの方は
            <a href="/login" className="ml-1 text-[#5376e5] hover:underline">
              ログイン
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
