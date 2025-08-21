"use client";
import { useRouter, useParams } from "next/navigation";

function SendButton() {
  const router = useRouter();
  const params = useParams(); // URLの情報をゲット！

  const id = params.id; // これが「今表示している本のID」

  function goToReviewPage() {
    router.push(`/books/${id}/review/new`);
  }

  return (
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      onClick={goToReviewPage}
    >
      レビューを書く
    </button>
  );
}

export default SendButton;
