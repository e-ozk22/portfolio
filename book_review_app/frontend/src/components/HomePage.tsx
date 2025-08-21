"use client";

import { useEffect, useState } from "react";
import { BookOpen, User } from "lucide-react";
import Link from "next/link";
import BookCard from "./BookCard";

type Book = {
  id: number;
  title: string;
  author: string;
  thumbnail_url: string;
};

type Props = {
  onLoginClick: () => void;
};
function HomePage({ onLoginClick }: Props) {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await fetch("http://localhost:8000/books");
      const data = await res.json();
      setBooks(data);
    };

    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー：そのまま使う */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Book Review App</h1>
          <button
            onClick={onLoginClick}
            className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded-full font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <span>My Pageへ</span>
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 本の紹介メッセージ（見た目そのまま） */}
      <main className="px-6 py-8">
        <section className="text-center mb-12">
          <div className="flex justify-center items-center mb-8">
            <div className="bg-pink-100 rounded-full p-8 mr-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Enjoy
                <br />
                Reading!
              </h2>
            </div>
            <div className="text-gray-600">
              <BookOpen className="w-20 h-20" />
            </div>
          </div>
        </section>

        {/* 本のカード一覧表示（画像・著者・タイトル） */}
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                thumbnailUrl={book.thumbnail_url}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
