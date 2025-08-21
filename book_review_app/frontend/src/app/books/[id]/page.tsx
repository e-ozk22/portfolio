//本の詳細ページ
// books/{id}

"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Book, Review } from "../../../types/types";
import { fetchBookById, getReview } from "@/libs/api";
import { Loader2, Book as BookIcon, User, Star } from "lucide-react";
import SendButton from "./utils/SendButton";

type Props = {
  params: { id: number };
};

export default function BookDetailPage({ params }: Props) {
  const { id } = params;
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // .then(setBook)で、「取得した本の情報（データ）」をsetBookに渡してstate（状態）を更新
  useEffect(() => {
    const loadBookAndReview = async () => {
      setLoading(true);
      setError(null);

      try {
        // まず本の情報を取得
        const bookData = await fetchBookById(id);
        setBook(bookData);
      } catch (err) {
        setError("本の情報を取得できませんでした");
        console.error("Error fetching book:", err);
        return;
      }

      // 次にレビューを取得
      try {
        const reviewData = await getReview(id);
        console.log("レビューの取得結果:", reviewData);
        setReviews(reviewData);
      } catch (err) {
        // レビュー取得に失敗しても本だけは表示
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    loadBookAndReview();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">本が見つかりませんでした</div>
      </div>
    );
  }

  if (!reviews) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">まだレビューがありません</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            Book Review App
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 本の詳細情報 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* 本の画像 */}
            <div className="flex-shrink-0">
              <Image
                src={book.thumbnail_url || "/noimage.png"}
                alt={book.title}
                width={200}
                height={314}
                className="rounded-lg shadow-md mx-auto md:mx-0"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/noimage.png";
                }}
              />
            </div>
            {/* 本の情報 */}
            <div className="flex-1 space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
              <p className="text-xl text-gray-700 flex items-center">
                <User className="w-5 h-5 mr-2" />
                著者: {book.author}
              </p>

              {/* レビュー統計 */}
              {reviews.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 fill-current mr-1" />
                      <span className="font-semibold">
                        {(
                          reviews.reduce((sum, r) => sum + r.rating, 0) /
                          reviews.length
                        ).toFixed(1)}
                      </span>
                    </div>
                    <span className="text-gray-600">
                      ({reviews.length}件のレビュー)
                    </span>
                  </div>
                </div>
              )}

              {/* レビュー投稿ボタン */}
              <div className="pt-4">
                <SendButton />
              </div>
            </div>
          </div>
        </div>

        {/* レビュー一覧 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <BookIcon className="w-6 h-6 mr-2" />
            レビュー一覧
          </h2>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <BookIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                まだレビューがありません。
              </p>
              <p className="text-gray-400 text-sm mt-2">
                最初のレビューを投稿してみませんか？
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {/* ユーザー名リンク */}
                      <Link
                        href={`/users/${review.userId}`}
                        className="font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        {review.reviewer}
                      </Link>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-500 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        ({review.rating}/5)
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-700 leading-relaxed">
                    {review.comment}
                  </div>
                  {/* 投稿日の表示（createdAtがある場合） */}
                  {review.createdAt && (
                    <div className="text-xs text-gray-400 mt-3">
                      投稿日:{" "}
                      {new Date(review.createdAt).toLocaleDateString("ja-JP")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// http://localhost:3000/books/1でこのページ表示される
// <button onClick={この中の関数をutilsで定義}>レビューを投稿する</button>
