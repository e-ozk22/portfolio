import { User } from "lucide-react";
import Image from "next/image";

// TSの型定義
type Props = {
  onLogin?: () => void;      // ログイン時に実行する関数（省略可） void：何も返さない
  onLogout?: () => void;     // ログアウト時に実行する関数（省略可）
  onMypage?: () => void;     // マイページボタン押したときの関数（省略可）
  isLoggedIn: boolean;       // ログイン中かどうかの状態（true/false）
  profileImage?: string;         // ユーザーアイコン画像のURLなど（省略可）
  isMypage?: boolean;
};

export default function Header({
  onLogin,
  onLogout,
  onMypage,
  isLoggedIn,
  profileImage,
  isMypage = 
}: Props) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
     <h1 className="flex items-center">
  <Image
    src="/logo.png"
    alt="Book Review App"
    width={120}
    height={40}
    priority
    style={{ objectFit: "contain", cursor: "pointer" }}
    onClick={onMypage} // ← ロゴクリックでホームに
  />
</h1>
      {isLoggedIn ? (
        <button
          onClick={onLogout}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium flex items-center space-x-2"
        >
          <span>Log out</span>
          <span>✏️</span>
        </button>
      ) : (
        <button
          onClick={onLogin}
          className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded-full font-medium flex items-center space-x-2"
        >
          <span>Login</span>
          <User className="w-4 h-4" />
        </button>
      )}
    </header>
  );
}
