"use client";
import { Review } from "../types/types";
import StarRating from "../app/books/[id]/review/new/components/StarRating";

type Props = {
  review: Review;
  onClose: () => void;
};

function ReviewModal({ review, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-start space-x-4 mb-4">
          <img
            src={review.thumbnailUrl || "/api/placeholder/60/90"}
            alt={review.bookTitle}
            className="w-16 h-24 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{review.bookTitle}</h3>
            <p className="text-gray-600 mb-2">著者: {review.author}</p>
            <div className="flex items-center space-x-1 mb-2">
              <StarRating rating={review.rating} onRate={() => {}} />
              <span className="text-sm text-gray-500 ml-2">
                ({review.rating}/5)
              </span>
            </div>
            <p className="text-sm text-gray-500">
              レビュアー: {review.reviewer}
            </p>
            {review.createdAt && (
              <p className="text-sm text-gray-500">
                投稿日: {review.createdAt}
              </p>
            )}
          </div>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold mb-2">レビュー</h4>
          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
export default ReviewModal;
