export type Book = {
  id: number;
  title: string;
  author: string;
  thumbnail_url?: string;
};

export type Review = {
  id: number;
  bookId: number;
  bookTitle: string;
  author: string;
  rating: number; // 評価☆
  comment: string;
  reviewer: string; // レビュー書いた人
  userId: string;
  thumbnailUrl?: string; // 本の画像
  createdAt?: string; // 投稿日時
};

export type UserData = {
  id: number;
  username: string;
  profileImage?: string;
  reviews: Review[];
};
