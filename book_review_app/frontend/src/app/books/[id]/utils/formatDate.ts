//本の詳細ページで使う関数
//urlまたはパスからデータを読み込む
fetch("url")
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });
//インターネットの接続が悪かったり、urlがなかったりするとcatchに行く
