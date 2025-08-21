// まだ登録されていない本の入力フォーム
// http://localhost:3000/books/new　（例：POST/books）
// 登録完了したら画面遷移？
// サジェスト機能

"use client";
import { useState, useRef } from "react";
import StarRating from "../[id]/review/new/components/StarRating"; // ← StarRatingコンポーネントの場所に合わせてパスは調整してね！
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Book } from "@/types/types";

export default function BookPostPage() {
  const router = useRouter();

  // 入力値のstate
  const [title, setTitle] = useState(""); // タイトル
  const [author, setAuthor] = useState(""); // 作者
  const [imageUrl, setImageUrl] = useState(""); // 本の画像
  const [rating, setRating] = useState(0); // 今の評価（0〜5）
  const [comment, setComment] = useState(""); // コメント
  const [loading, setLoading] = useState(false); //
  const [success, setSuccess] = useState(false); //

  // サジェスト用 すでに登録されている場合に備えて
  // suggestionsという用意した箱に本の候補（Book型）がたくさん入る
  const [suggestions, setSuggestions] = useState<Book[]>([]);
  // サジェストを見せる？最初は見せない（false）で入力中だけ見せる
  const [showSuggest, setShowSuggest] = useState(false);
  // suggestTimeoutっていうタイマーの箱
  // サジェスト出すまでちょっと待つ時に使う
  const suggestTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // タイトル入力欄に文字を入れた時に呼ばれる関数
  // 入力された最新の文字をvalueに入れてsetTitleという関数で保存
  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setTitle(value);

    // 2文字以上の入力でサジェスト検索
    if (value.length >= 2) {
      // 入力している時にすぐにリクエスを送らず少し待つ
      // サジェストでリクエストが多くなりすぎないように処理する
      // useRefで作った箱の中身にアクセスするとき.currentを使う
      // clearTimeoutは前にセットしたタイマーをキャンセルする関数
      if (suggestTimeout.current) clearTimeout(suggestTimeout.current);

      suggestTimeout.current = setTimeout(async () => {
        // APIサーバーにリクエスト
        // encodeURIComponent エンコードするので日本語や記号もOK
        // ?title=${encodeURIComponent(value)でタイトル部分一致検索
        try {
          const res = await fetch(
            `/api/books?title=${encodeURIComponent(value)}`
          );
          // サーバーから正常なレスポンスがあった場合だけ処理進める
          // setSuggestion：取得した本のリストをサジェスト候補に保存
          // setShowSuggest：サジェストリストを表示するをON！画面にリストでるよ
          if (res.ok) {
            const data = await res.json();
            setSuggestions(data.books || []);
            setShowSuggest(true);
          }
        } catch (error) {
          console.error("サジェスト取得エラー！", error);
        }
        // 300ミリ秒（0.3秒）後にサジェスト出すよ！
      }, 300);
      // 入力値2文字未満はサジェスト出さないよ
    } else {
      setSuggestions([]);
      setShowSuggest(false);
    }
  }

  // サジェスト押した時
  function handleSuggestClick(book: Book) {
    // confirmはユーザーにyes/noを聞くポップアップ
    const confirmed = confirm(
      `『${book.title}』はすでに登録されています！\nレビュー画面に移動しますか？`
    );
    // レビュー投稿ページへ画面遷移するよ〜
    if (confirmed) {
      router.push(`/books/${book.id}/review/new`);
    }
  }

  // 投稿
  async function handleSubmit(e: React.FormEvent) {
    // e.preventDefault();でフォームのページリロードなどを止めるお約束の書き方
    e.preventDefault();

    // バリデーション　タイトルと著者が空欄はエラー
    // !title.trim()はtrue
    if (!title.trim() || !author.trim()) {
      alert("タイトルと作者は必須です");
      return;
    }

    if (rating === 0) {
      alert("評価を入力してください");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("ログインが必要です");
      return;
    }

    // setLoading(true)：送信中・処理中を示すstate。くるくるマークとか
    setLoading(true);
    // 前回の成功表示を一旦消しておく
    setSuccess(false);
    // 送信するデータ
    const payload = {
      title: title.trim(),
      author: author.trim(),
      thumbnail_url: imageUrl.trim() || null,
      rating,
      comment: comment.trim(),
    };

    try {
      const res = await fetch("http://localhost:8000/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔑 トークンを送る！
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess(true);
        // フォームをリセット
        setTitle("");
        setAuthor("");
        setRating(0);
        setComment("");

        // 3秒後に一覧ページへ移動するよ
        setTimeout(() => {
          router.push("/?to=mypage");
        }, 3000);
      } else {
        // fetchのレスポンスがエラーだった時はnull
        const errorData = await res.json().catch(() => null);
        alert(`登録に失敗しました: ${errorData?.message || "不明なエラー"}`);
      }
    } catch (err) {
      alert("通信エラーです");
      console.error("通信エラー:", err);
      alert("通信エラーが発生しました");
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h1>新しい本のレビュー投稿</h1>

      {success && (
        <div
          style={{
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "20px",
            border: "1px solid #c3e6cb",
          }}
        >
          レビューが正常に投稿されました！3秒後に一覧ページに移動します。
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* タイトル入力 */}
        <div style={{ marginBottom: "15px", position: "relative" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            タイトル *
          </label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="本のタイトルを入力してください"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px",
            }}
            disabled={loading}
          />

          {/* サジェストリスト */}
          {showSuggest && suggestions.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderTop: "none",
                borderRadius: "0 0 4px 4px",
                maxHeight: "200px",
                overflowY: "auto",
                zIndex: 1000,
              }}
            >
              {suggestions.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleSuggestClick(book)}
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f0f0f0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "white")
                  }
                >
                  <strong>{book.title}</strong>
                  <br />
                  <small>{book.author}</small>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 作者入力 */}
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            作者 *
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="作者名を入力してください"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px",
            }}
            disabled={loading}
          />
        </div>

        {/* 画像URL入力 */}
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            画像URL (オプション)
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/book-cover.jpg"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px",
            }}
            disabled={loading}
          />
        </div>

        {/* 画像プレビュー */}
        {imageUrl && (
          <div style={{ marginBottom: "15px" }}>
            <Image
              src={imageUrl}
              alt="本の画像プレビュー"
              width={100}
              height={150}
              style={{ objectFit: "cover", borderRadius: "4px" }}
              onError={() => setImageUrl("")}
            />
          </div>
        )}

        {/* 評価 */}
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            評価 * (1-5)
          </label>
          <StarRating rating={rating} onRate={setRating} />
        </div>

        {/* コメント入力 */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            レビューコメント
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="この本についてのレビューを書いてください"
            style={{
              width: "100%",
              height: "120px",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px",
              resize: "vertical",
            }}
            disabled={loading}
          />
        </div>

        {/* 投稿ボタン */}
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            width: "100%",
          }}
        >
          {loading ? "投稿中..." : "レビューを投稿する"}
        </button>
      </form>
    </div>
  );
}
