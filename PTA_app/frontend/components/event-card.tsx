import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, MapPin, Users } from "lucide-react" // Awardを削除

interface EventCardProps {
  id: string
  title: string
  date: string
  time: string
  location: string
  // points: number // プロパティとしては残すが、表示には使用しない
  status: "募集前" | "募集中" | "終了"
  participants: number
  maxParticipants: number
  isParticipatedByCurrentUser: boolean
}

const getStatusColor = (status: "募集前" | "募集中" | "終了") => {
  switch (status) {
    case "募集前":
      return "bg-secondary text-secondary-foreground" // パープル
    case "募集中":
      return "bg-accent text-accent-foreground" // ピンク
    case "終了":
      return "bg-muted text-muted-foreground" // グレー
    default:
      return ""
  }
}

export function EventCard({
  id,
  title,
  date,
  time,
  location,
  // points, // 表示には使用しない
  status,
  participants,
  maxParticipants,
  isParticipatedByCurrentUser,
}: EventCardProps) {
  return (
    <Card className="mb-4 border-l-4 border-l-primary bg-card text-card-foreground">
      <CardHeader className="pb-2">
        {/* バッジのコンテナをタイトルより上に移動 */}
        <div className="flex gap-2 mb-2">
          <Badge
            className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(status)} whitespace-nowrap hover:bg-current hover:text-current`}
          >
            {status}
          </Badge>
          {isParticipatedByCurrentUser && (
            <Badge className="px-3 py-1 text-xs font-medium rounded-full bg-primary text-primary-foreground whitespace-nowrap hover:bg-current hover:text-current">
              参加済み
            </Badge>
          )}
        </div>
        {/* タイトルを大きく太字に */}
        <CardTitle className="text-2xl font-bold mb-2">{title}</CardTitle>
        {/* 情報とボタンのコンテナ */}
        <div className="flex justify-between items-end">
          {/* 日付、場所、参加者数を縦に並べる */}
          <div className="flex flex-col gap-1 text-sm text-foreground/70">
            <div className="flex items-center whitespace-nowrap">
              {" "}
              {/* ここにwhitespace-nowrapを追加 */}
              <Calendar className="h-4 w-4 mr-1" />
              {date} {time}
            </div>
            <div className="flex items-center whitespace-nowrap">
              {" "}
              {/* ここにもwhitespace-nowrapを追加 */}
              <MapPin className="h-4 w-4 mr-1" />
              {location}
            </div>
            <div className="flex items-center whitespace-nowrap">
              {" "}
              {/* ここにもwhitespace-nowrapを追加 */}
              <Users className="h-4 w-4 mr-1 text-secondary" />
              <span className="text-foreground">
                {participants}/{maxParticipants}人
              </span>
            </div>
          </div>
          {/* 詳細表示ボタン */}
          <Link href={`/events/${id}`} passHref>
            <Button size="sm" variant="secondary" className="hover:bg-secondary hover:text-secondary-foreground">
              詳細表示
            </Button>
          </Link>
        </div>
      </CardHeader>
      {/* CardContentはパディングのために残すが、中身は空にする */}
      <CardContent className="pt-0"></CardContent>
    </Card>
  )
}
