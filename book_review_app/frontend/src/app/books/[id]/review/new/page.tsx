// レビュー投稿フォーム

"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import StarRating from "./components/StarRating"; // ← StarRatingコンポーネントの場所に合わせてパスは調整してね！
import Image from "next/image";
import { Book } from "@/types/types";
import { fetchBookById, API_BASE_URL } from "@/libs/api";

export default function ReviewPostPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [book, setBook] = useState<Book | null>(null);
  const [rating, setRating] = useState(0); // 今の評価（0〜5）
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookById(Number(bookId)).then(setBook);
  }, [bookId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`${API_BASE_URL}/books/${bookId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${token}`,  認証いるなら
      },
      body: JSON.stringify({
        rating,
        comment,
      }),
    });

    setLoading(false);

    if (res.ok) {
      alert("レビュー投稿成功！");
      router.push(`/books/${bookId}`);
    } else {
      alert("投稿に失敗しました");
    }
  }

  if (!book) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>レビュー投稿ページ</h1>
      <Image
        src={book.thumbnail_url || "/noimage.png"}
        alt={book.title}
        width={180}
        height={180}
        priority
      />
      <div>タイトル：{book.title}</div>
      <div>著者：{book.author}</div>
      <form onSubmit={handleSubmit}>
        <StarRating rating={rating} onRate={setRating} />
        <textarea
          placeholder="レビューを書いてください"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{
            width: "300px",
            height: "100px",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            display: "block",
            marginTop: "10px",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: "10px", padding: "8px 16px" }}
        >
          投稿する
        </button>
      </form>
    </div>
  );
}
