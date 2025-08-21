"use client";
import Link from "next/link";

type Props = {
  id: number;
  title: string;
  author: string;
  thumbnailUrl: string;
};

function BookCard({ id, title, author, thumbnailUrl }: Props) {
  return (
    <Link href={`/books/${id}`}>
      <div className="bg-gray-50 rounded-lg p-4 text-center hover:shadow-lg hover:bg-gray-100 transition-all duration-300 cursor-pointer min-h-[320px] flex flex-col items-center">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-64 object-contain rounded-lg bg-white"
        />
        <h3 className="font-bold text-sm text-gray-800 truncate">{title}</h3>
        <p className="text-xs text-gray-600 truncate">{author}</p>
      </div>
    </Link>
  );
}

export default BookCard;
