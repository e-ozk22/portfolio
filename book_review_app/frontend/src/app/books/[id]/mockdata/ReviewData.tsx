type Data = {
  id: number;
  postDate: string;
  stars: number;
  userName: string;
  review: string;
};

function ReviewData() {
  const reviewData: Data[] = [
    {
      id: 1,
      postDate: "2025-06-01",
      stars: 4,
      userName: "スラダン大好きさん",
      review:
        "子供の時にテレビアニメで放送されていた時から大好きでした！ふと読みたくなって１巻を手に取ったら大人になった今でも面白かったので、全巻読もうと思います。",
    },
    {
      id: 2,
      postDate: "2025-05-28",
      stars: 5,
      userName: "afro",
      review:
        "桜木花道面白すぎて読みながら大爆笑しました。元気が出る漫画です！",
    },
  ];
  return (
    <div>
      <h2>みんなのレビュー</h2>
      <ul>
        {reviewData.map((item) => (
          <li key={item.id}>
            <div>
              ({item.stars}★){"  "}
              <strong>{item.userName}</strong>
              {"   "}
              {item.postDate}
            </div>
            <div>{item.review}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReviewData;
