"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import HomePage from "../components/HomePage";
import LoginModal from "../components/LoginModal";
import MyPage from "../components/MyPage";
import { Review, UserData } from "../types/types";

export default function Page() {
  const searchParams = useSearchParams();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [currentPage, setCurrentPage] = useState<"home" | "mypage">("home");

  // ✅ ① 初回マウント時にトークンがあれば自動でユーザー取得
  useEffect(() => {
    const to = searchParams.get("to");
    if (to === "mypage" && user) {
      setCurrentPage("mypage");
    }
  }, [searchParams, user]);

  // ✅ ② マイページボタンを押した時の処理
  const handleGoToMyPage = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        await fetchReviews(token); // ← レビューも取得
        setCurrentPage("mypage");
      } else {
        setShowLoginModal(true); // トークン無効ならログインモーダル
      }
    } catch {
      setShowLoginModal(true);
    }
  };

  // ✅ ③ レビュー取得処理
  const fetchReviews = async (token: string) => {
    setLoading(true);
    const res = await fetch("http://localhost:8000/users/me/reviews", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const reviewData = await res.json();
      setUserReviews(reviewData);
    }
    setLoading(false);
  };

  // ✅ ④ ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setUserReviews([]);
    setCurrentPage("home");
  };

  return (
    <>
      {user && currentPage === "mypage" ? (
        <MyPage
          user={user}
          userReviews={userReviews}
          loading={loading}
          onLogout={handleLogout}
          onReviewSelect={(review) => setSelectedReview(review)}
          onHomeClick={() => setCurrentPage("home")}
        />
      ) : (
        <HomePage onLoginClick={handleGoToMyPage} />
      )}

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={async () => {
            setShowLoginModal(false);
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch("http://localhost:8000/users/me", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (res.ok) {
              const userData = await res.json();
              setUser(userData);
              await fetchReviews(token);
              setCurrentPage("mypage");
            }
          }}
        />
      )}
    </>
  );
}
