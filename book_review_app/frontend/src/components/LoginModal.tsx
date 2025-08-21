//ログインのモーダル画面

"use client";

import { useState } from "react";

type Props = {
  onClose: () => void; //モーダルを閉じるための関数。voidは関数を実行しても何も返さないよって意味
  onLoginSuccess: () => void; //ログイン成功時に呼び出す関数
};

//モーダルコンポーネント本体
function LoginModal({ onClose, onLoginSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  //ログインボタンを押したときの処理
  const handleLogin = async () => {
    setError(null); //まず、前のエラーを消してきれいにする
    try {
      //ここからログインが上手くいくかチャレンジ。もし失敗したらcatchでエラーを返す
      const res = await fetch("http://localhost:8000/login", {
        //サーバーに「ログインしていい？」と聞く、サーバに「このメルとパスワードでログインできる？」と聞く
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        //サーバーの返事をチェック。サーバーがダメと言ったらここでストップしてcatchへ
        throw new Error("ログインに失敗しました");
      }

      const data = await res.json(); //サーバーからもらった鍵を保存。サーバーが「OK」出したらもらったカギをしまう
      localStorage.setItem("token", data.access_token);
      onLoginSuccess(); //ログイン成功の合図を出す。
      onClose(); //「ログインできたよ」と親に伝えてモーダル閉じる
    } catch {
      setError("メールアドレスまたはパスワードが間違っています"); //もし失敗したらエラーのメッセージ出す
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">ログイン</h2>

        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            キャンセル
          </button>
          <button
            onClick={handleLogin}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded"
          >
            ログイン
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
