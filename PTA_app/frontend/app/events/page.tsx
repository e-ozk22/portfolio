import { getEvents } from '@/lib/api-client'

export default async function EventsPage() {
    const events = await getEvents() // APIからイベント一覧を取得

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">イベント一覧</h1>
      <ul>
        {events.map((event) => (
          <li key={event.id} className="border p-4 mb-2">
            <p>名前: {event.title}</p>
            <p>日付: {event.date}</p>
            <p>定員: {event.capacity}</p>
            <p>説明: {event.description}</p>
            <p>締切: {event.deadline}</p>
            <p>ポイント: {event.point}</p>
            <p>参加者数: {event.applicationsCount}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
