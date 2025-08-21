// StarRating.tsx
import Image from "next/image";

type StarRatingProps = {
  rating: number;
  onRate: (num: number) => void;
};

export default function StarRating(props: StarRatingProps) {
  return (
    <div className="flex items-center mb-4">
      <span>評価：</span>

      <Image
        src={props.rating >= 1 ? "/star-filled.png" : "/star-empty.png"}
        width={30}
        height={30}
        alt="1つ目の星"
        onClick={() => props.onRate(1)}
        style={{ cursor: "pointer", marginRight: "5px" }}
      />
      <Image
        src={props.rating >= 2 ? "/star-filled.png" : "/star-empty.png"}
        width={30}
        height={30}
        alt="2つ目の星"
        onClick={() => props.onRate(2)}
        style={{ cursor: "pointer", marginRight: "5px" }}
      />
      <Image
        src={props.rating >= 3 ? "/star-filled.png" : "/star-empty.png"}
        width={30}
        height={30}
        alt="3つ目の星"
        onClick={() => props.onRate(3)}
        style={{ cursor: "pointer", marginRight: "5px" }}
      />
      <Image
        src={props.rating >= 4 ? "/star-filled.png" : "/star-empty.png"}
        width={30}
        height={30}
        alt="4つ目の星"
        onClick={() => props.onRate(4)}
        style={{ cursor: "pointer", marginRight: "5px" }}
      />
      <Image
        src={props.rating >= 5 ? "/star-filled.png" : "/star-empty.png"}
        width={30}
        height={30}
        alt="5つ目の星"
        onClick={() => props.onRate(5)}
        style={{ cursor: "pointer", marginRight: "5px" }}
      />
    </div>
  );
}
