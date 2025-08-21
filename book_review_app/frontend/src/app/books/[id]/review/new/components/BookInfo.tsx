import Image from "next/image";

type Props = {
  title: string;
  author: string;
};

export default function BookInfo({ title, author }: Props) {
  return (
    <div>
      <Image
        src="/sd.jpeg"
        alt="スラムダンクサンプル画像"
        width={180}
        height={38}
      />
      <p>タイトル：{title}</p>
      <p>著者名：{author}</p>
    </div>
  );
}
