// ログインしてなくても見ることができる「マイページ」
"use client";
import { User, BookOpen, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation"; // ← 遷移用フック
import StarRating from "@/app/books/[id]/review/new/components/StarRating";
import { Review, UserData } from "../types/types";

type Props = {
  users: UserData | null;
  userReviews: Review[];
  loading: boolean;
  onBackClick?: () => void;
};

function PublicUserPage({ users, userReviews, loading, onBackClick }: Props) {
  const router = useRouter(); // ← これで遷移できるようになる
  console.log("users", users);
  console.log("userReviews", userReviews);

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Book Review App</h1>
          <button
            onClick={onBackClick ?? (() => router.push("/"))}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full transition"
          >
            戻る
          </button>
        </div>
      </header>

      <main className="px-6 py-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {users?.username ?? "ユーザー"} さんのマイページ
        </h2>

        {/* プロフィール */}
        {!loading && users && (
          <div className="flex flex-col items-center mt-6 mb-10">
            <div className="w-24 h-24 bg-pink-100 rounded-full overflow-hidden flex items-center justify-center">
              {users.profileImage ? (
                <img
                  src={users.profileImage}
                  alt={users.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-pink-600" />
              )}
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              {users.username}
            </h3>
          </div>
        )}

        {/* ローディング中 */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <p>読み込み中...</p>
          </div>
        )}

        {/* レビュー一覧 */}
        {!loading && users && (
          <section className="mb-4">
            <div className="flex items-center gap-x-4 mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {users.username} さんのレビュー履歴
              </h3>
            </div>

            <div className="space-y-4 mb-8">
              {userReviews.map((review, index) => (
                <div
                  key={review.id || index}
                  className="border-b border-gray-200 pb-4 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  // 他ユーザーのレビューは編集不可なのでonClickなし
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-2">
                        {review.bookTitle}
                      </h4>
                      <div className="flex items-center space-x-1 mb-2">
                        <StarRating rating={review.rating} onRate={() => {}} />
                        <span className="text-sm text-gray-500 ml-2">
                          ({review.rating}/5)
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {review.comment}
                      </p>
                      {review.createdAt && (
                        <p className="text-xs text-gray-400 mt-2">
                          {review.createdAt}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <div className="bg-pink-200 rounded-lg p-8 text-center">
                <BookOpen className="w-12 h-12 text-pink-600 mx-auto mb-2" />
                <span className="text-pink-700 font-medium">more</span>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default PublicUserPage;
