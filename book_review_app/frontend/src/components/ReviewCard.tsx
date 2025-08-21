"use client";
import { BookOpen, Star } from "lucide-react";
import { Review } from "../types/types";

type Props = {
  review: Review;
  onClick: () => void;
};

export default function ReviewCard({ review, onClick }: Props) {
  return (
    <div
      className="bg-gray-50 rounded-lg p-4 text-center hover:shadow-lg hover:bg-gray-100 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="w-12 h-16 bg-gray-200 rounded mx-auto mb-3 flex items-center justify-center">
        <BookOpen className="w-6 h-6 text-gray-500" />
      </div>
      <h3 className="font-bold text-gray-900 mb-1 text-xs truncate">
        {review.bookTitle}
      </h3>
      <p className="text-gray-600 mb-2 text-xs truncate">{review.author}</p>
      <div className="flex justify-center items-center space-x-0.5 mb-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={`${review.id}-${i}`}
            className={`w-3 h-3 ${
              i < review.rating
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500">({review.rating})</p>
    </div>
  );
}
