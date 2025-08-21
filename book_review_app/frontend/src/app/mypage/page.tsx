// 自分用マイページ（要認証） /mypageでアクセス
"use client";
import { useState } from "react";

const dummyMyInfo = {
  name: "eriko",
  icon: "/user1.png",
  reviews: [
    {
      id: 2,
      bookTitle: "ハイキュー‼︎ 1巻",
      author: "古舘春一",
      rating: 5,
      comment:
        "熱い試合展開が最高です！どんな状況でも諦めない選手から元気をもらえます",
    },
    {
      id: 3,
      bookTitle: "忘却バッテリー 1巻",
      author: "みかわ絵子",
      rating: 5,
      comment: "ギャグとシリアスの温度差で風邪引きます",
    },
  ], // ここは後ほど設定
};

export default function MyPage() {
  // 認証の実装ができるまで仮でtrue
  const isLoggedIn = true;

  if (!isLoggedIn) {
    return <div>ログインしてください</div>;
  }

  const user = dummyMyInfo;

  return (
    <main>
      <h1>My Page（自分用）</h1>
      <img src={user.icon} width={60} alt="ユーザーアイコン" />
      <p>{user.name}</p>
      <h2>My Review</h2>
      <ul>
        {user.reviews.map((review) => (
          <li key={review.id}>
            {review.bookTitle}：{review.rating} : {review.comment}
            {/* 削除ボタンを仮で設置 */}
            <button
              onClick={() => {
                // 仮実装なので「まだ実装中」とアラートだけでもOK
                alert("削除機能は後で追加します！");
              }}
              style={{ marginLeft: "1em" }}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

// import { useState } from "react";

// export default function MyPage() {
//   // ダミーデータをuseStateで管理
//   const [myInfo, setMyInfo] = useState(dummyMyInfo);
//   const isLoggedIn = true;

//   if (!isLoggedIn) return <div>ログインしてください</div>;

//   return (
//     <main>
//       <h1>マイページ（自分用）</h1>
//       <img src={myInfo.icon} width={60} alt="ユーザーアイコン" />
//       <h2>自分のレビュー一覧</h2>
//       <ul>
//         {myInfo.reviews.map((review) => (
//           <li key={review.id}>
//             {review.bookTitle}：{review.comment}
//             <button
//               onClick={() => {
//                 setMyInfo({
//                   ...myInfo,
//                   reviews: myInfo.reviews.filter((r) => r.id !== review.id),
//                 });
//               }}
//               style={{ marginLeft: "1em" }}
//             >
//               削除
//             </button>
//           </li>
//         ))}
//       </ul>
//     </main>
//   );
// }
