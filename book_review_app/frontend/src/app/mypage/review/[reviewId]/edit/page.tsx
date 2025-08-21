// パス例：/mypage/review/123/edit

// "use client";
// import { useEffect, useState } from "react";
// import StarRating from "../../../../books/[id]/review/new/components/StarRating";
// import Image from "next/image";
// import { useParams, useRouter } from "next/navigation";

// export default function ReviewEditPage() {
//   const { reviewId } = useParams();
//   const router = useRouter();

//   // レビュー情報
//   const [bookTitle, setBookTitle] = useState("");
//   const [author, setAuthor] = useState("");
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [thumbnailUrl, setThumbnailUrl] = useState("");

//   // 編集前データの取得（APIから）
//   useEffect(() => {
//     async function fetchReview() {
//       try {
//         const res = await fetch(`/api/reviews/${reviewId}`);
//         const data = await res.json();
//         setBookTitle(data.bookTitle);
//         setAuthor(data.author);
//         setComment(data.comment);
//         setRating(data.rating);
//         setThumbnailUrl(data.thumbnailUrl);
//       } catch (err) {
//         alert("データの取得に失敗しました");
//       }
//     }
//     fetchReview();
//   }, [reviewId]);

//   // 編集送信
//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     await fetch(`/api/reviews/${reviewId}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         bookTitle,
//         author,
//         rating,
//         comment,
//         thumbnailUrl,
//       }),
//     });
//     router.push("/mypage"); // 更新後マイページに戻す
//   }

//   // 削除
//   async function handleDelete() {
//     if (!confirm("本当に削除しますか？")) return;
//     await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
//     router.push("/mypage");
//   }

//   return (
//     <div style={{ padding: 20, maxWidth: 400 }}>
//       <h1>レビュー編集</h1>
//       {/* タイトル入力 */}
//       <label>
//         タイトル：
//         <input
//           type="text"
//           value={bookTitle}
//           onChange={(e) => setBookTitle(e.target.value)}
//           style={{
//             width: "100%",
//             padding: 6,
//             marginTop: 4,
//             marginBottom: 10,
//             borderRadius: 4,
//             border: "1px solid #ccc",
//           }}
//         />
//       </label>
//       {/* 作者名入力 */}
//       <label>
//         著者名：
//         <input
//           type="text"
//           value={author}
//           onChange={(e) => setAuthor(e.target.value)}
//           style={{
//             width: "100%",
//             padding: 6,
//             marginTop: 4,
//             marginBottom: 10,
//             borderRadius: 4,
//             border: "1px solid #ccc",
//           }}
//         />
//       </label>
//       <label>
//         画像URL：
//         <input
//           type="text"
//           value={thumbnailUrl}
//           onChange={(e) => setThumbnailUrl(e.target.value)}
//           style={{
//             width: "100%",
//             padding: 6,
//             marginTop: 4,
//             marginBottom: 10,
//             borderRadius: 4,
//             border: "1px solid #ccc",
//           }}
//         />
//       </label>
//       <Image
//         src={thumbnailUrl || "/noimage.png"}
//         alt="本の画像"
//         width={180}
//         height={38}
//       />
//       <form onSubmit={handleSubmit}>
//         {/* レーティング */}
//         <StarRating rating={rating} onRate={setRating} />
//         {/* コメント */}
//         <textarea
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           style={{
//             width: "100%",
//             height: 100,
//             marginTop: 8,
//             borderRadius: 4,
//             border: "1px solid #ccc",
//           }}
//         />
//         <div style={{ marginTop: 12 }}>
//           <button type="submit" style={{ marginRight: 12 }}>
//             更新する
//           </button>
//           <button
//             type="button"
//             style={{ background: "red", color: "#fff" }}
//             onClick={handleDelete}
//           >
//             削除
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { User, BookOpen, ChevronRight, Loader2 } from "lucide-react";

// // StarRating コンポーネント
// const StarRating = ({ rating, onRate }) => {
//   return (
//     <div className="flex items-center space-x-1">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <button
//           key={star}
//           onClick={() => onRate(star)}
//           className="focus:outline-none"
//         >
//           <span
//             className={`text-lg ${
//               star <= rating ? "text-yellow-400" : "text-gray-300"
//             }`}
//           >
//             ★
//           </span>
//         </button>
//       ))}
//     </div>
//   );
// };

// // サンプルデータ
// const sampleUser = {
//   username: "田中太郎",
//   profileImage: null, // プロフィール画像がない場合
// };

// const sampleReviews = [
//   {
//     id: 1,
//     bookTitle: "吾輩は猫である",
//     rating: 4,
//     comment:
//       "夏目漱石の代表作の一つ。猫の視点から人間社会を風刺した作品で、ユーモアに富んでいながらも深い洞察が込められている。",
//     createdAt: "2024-05-15",
//   },
//   {
//     id: 2,
//     bookTitle: "こころ",
//     rating: 5,
//     comment:
//       "人間の心の奥底に潜む複雑な感情を描いた名作。先生とKの関係、そして「私」への告白は読む者の心を深く揺さぶる。",
//     createdAt: "2024-05-10",
//   },
//   {
//     id: 3,
//     bookTitle: "坊っちゃん",
//     rating: 3,
//     comment:
//       "痛快な青春小説。主人公の正義感あふれる性格が魅力的だが、やや単調な部分もある。",
//     createdAt: "2024-05-05",
//   },
// ];

// const MyPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [user] = useState(sampleUser);
//   const [userReviews] = useState(sampleReviews);
//   const [selectedReview, setSelectedReview] = useState(null);

//   const handleLogout = () => {
//     // ログアウト処理
//     console.log("ログアウトしました");
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <header className="bg-white border-b border-gray-200 px-6 py-4">
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-gray-900">Book Review App</h1>
//           <button
//             onClick={handleLogout}
//             className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium transition-colors duration-200 flex items-center space-x-2"
//           >
//             <span>log out</span>
//             <span>✏️</span>
//           </button>
//         </div>
//       </header>

//       <main className="px-6 py-8">
//         <h2 className="text-xl font-bold text-gray-900 mb-6">My Page</h2>

//         {loading && (
//           <div className="flex justify-center items-center py-12">
//             <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
//             <span className="ml-2 text-gray-600">読み込み中...</span>
//           </div>
//         )}

//         {!loading && user && (
//           <>
//             <div className="flex items-center space-x-4 mb-8">
//               <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center overflow-hidden">
//                 {user.profileImage ? (
//                   <img
//                     src={user.profileImage}
//                     alt={user.username}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <User className="w-8 h-8 text-pink-600" />
//                 )}
//               </div>
//               <div>
//                 <h3 className="font-bold text-gray-900">{user.username}</h3>
//                 <p className="text-sm text-gray-500">
//                   レビュー数: {userReviews.length}
//                 </p>
//               </div>
//             </div>

//             <section>
//               <h3 className="text-lg font-bold text-gray-900 mb-4">
//                 レビュー履歴
//               </h3>

//               <div className="space-y-4 mb-8">
//                 {userReviews.map((review) => (
//                   <div
//                     key={review.id}
//                     className="border-b border-gray-200 pb-4 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
//                     onClick={() => setSelectedReview(review)}
//                   >
//                     <div className="flex justify-between items-start">
//                       <div className="flex-1">
//                         <h4 className="font-bold text-gray-900 mb-2">
//                           {review.bookTitle}
//                         </h4>
//                         <div className="flex items-center space-x-1 mb-2">
//                           <StarRating
//                             rating={review.rating}
//                             onRate={() => {}}
//                           />
//                           <span className="text-sm text-gray-500 ml-2">
//                             ({review.rating}/5)
//                           </span>
//                         </div>
//                         <p className="text-gray-600 text-sm line-clamp-2">
//                           {review.comment}
//                         </p>
//                         {review.createdAt && (
//                           <p className="text-xs text-gray-400 mt-2">
//                             {review.createdAt}
//                           </p>
//                         )}
//                       </div>
//                       <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="flex justify-center">
//                 <div className="bg-pink-200 rounded-lg p-8 text-center cursor-pointer hover:bg-pink-300 transition-colors duration-200">
//                   <BookOpen className="w-12 h-12 text-pink-600 mx-auto mb-2" />
//                   <span className="text-pink-700 font-medium">more</span>
//                 </div>
//               </div>
//             </section>
//           </>
//         )}
//       </main>
//     </div>
//   );
// };

// export default MyPage;
