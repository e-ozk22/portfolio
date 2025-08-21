'use client';

import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button'
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Reward = {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  capacity?: number;
  createdAt: string;
};

// NOTE: 本番環境/開発環境ごとにAPI_BASEを切り替えます。
// 今はローカル開発用（Docker: バックエンドAPIがlocalhost:4000で起動）
// TODO: .envや環境変数で動的に切り替えたい。
const API_BASE = 'http://127.0.0.1:4000/api/rewards';

export default function RewardsPage() {
  const router = useRouter();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<Partial<Reward>>({});
  const [editId, setEditId] = useState<string | null>(null);

  // 一覧取得
  const fetchRewards = async () => {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) {
      throw new Error(`取得失敗: ${res.status}`);
    }
    const data = await res.json();
    setRewards(data);
  } catch (err) {
    // TODO: ユーザーにもっと詳細なエラー内容を表示したい
    alert('優先権アイテムの取得に失敗しました');
    console.error(err);
  }
};

  useEffect(() => { fetchRewards(); }, []);

  // フォーム送信（追加/編集）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      pointsRequired: Number(form.pointsRequired),
      capacity: form.capacity ? Number(form.capacity) : undefined,
    };
    try {
    let res;
    if (editId) {
      // 編集
      res = await fetch(`${API_BASE}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      // 新規追加
      res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    if (!res.ok) {
      const errorText = await res.text();
      alert(`保存に失敗しました: ${res.status} ${errorText}`);
      return;
    }
    setForm({});
    setEditId(null);
    fetchRewards();
   } catch (err) {
    alert('通信エラーが発生しました');
    console.error(err);
  }
};

  // 編集開始
  const handleEdit = (reward: Reward) => {
    const onlyId = reward.id.split(':')[0]; // 余計な「:1」をカット
    setForm(reward);
    setEditId(onlyId); // ここでstringに統一
  };

  // 削除
  const handleDelete = async (id: string) => {
    if (!window.confirm('本当に削除しますか？')) return;
     try {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert('削除に失敗しました');
      return;
    }
    fetchRewards();
  } catch (err) {
    alert('通信エラーが発生しました');
    console.error(err);
  }
};

  // 検索
  const filtered = rewards.filter(r =>
    r.name.includes(search) ||
    r.description.includes(search)
  );

  return (
    <div className="min-h-screen bg-[#fcf6ea] p-8">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/menu')}
          className="mr-4 text-main-text hover:bg-[#eac6d9]/30"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          管理ダッシュボードへ
        </Button>
      <h1 className="text-2xl font-bold">優先権管理</h1>
      </div>

      {/* フォーム（新規・編集） */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#fffbe9] rounded-xl shadow p-6 max-w-3xl mx-auto mb-8 flex flex-col gap-3"
      >
        <div className="text-2xl font-bold mb-2">{editId ? 'アイテム編集' : '新規登録'}</div>
        <input
          type="text"
          className="border rounded px-3 py-2"
          placeholder="アイテム名"
          value={form.name ?? ''}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          required
        />
        <textarea
          className="border rounded px-3 py-2"
          placeholder="説明"
          value={form.description ?? ''}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          required
        />
        <input
          type="number"
          className="border rounded px-3 py-2"
          placeholder="必要ポイント"
          value={form.pointsRequired ?? ''}
          onChange={e => setForm(f => ({ ...f, pointsRequired: Number(e.target.value) }))}
          required
          min={0}
        />
        <input
          type="number"
          className="border rounded px-3 py-2"
          placeholder="定員（省略可）"
          value={form.capacity ?? ''}
          onChange={e => setForm(f => ({ ...f, capacity: Number(e.target.value) }))}
          min={0}
        />
        <div className="flex gap-2 mt-1">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded transition duration-200 scale-100 hover:scale-105"
          >
            {editId ? '更新' : '登録'}
          </button>
          {editId && (
            <button
              type="button"
              className="bg-gray-200 text-gray-700 px-5 py-2 rounded"
              onClick={() => { setEditId(null); setForm({}); }}
            >
              キャンセル
            </button>
          )}
        </div>
      </form>

      {/* 検索 */}
      <div className="bg-[#fffbe9] rounded-xl shadow p-6 max-w-3xl mx-auto mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-yellow-500 text-lg">★</span>
          <span className="text-2xl font-bold">優先権アイテム一覧</span>
        </div>
        <input
          type="text"
          className="border border-[#ede3d1] bg-[#f9f8f4] rounded px-3 py-2 mb-6 w-full"
          placeholder="優先権アイテム名で検索..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* カード一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(r => (
            <div
              key={r.id}
              className="relative bg-[#fcfbf8] rounded-xl border border-[#f4e7cd] shadow-sm p-5 pl-7"
            >
              {/* 青い縦ライン */}
              <span className="absolute left-0 top-0 bottom-0 w-1.5 rounded-bl-xl rounded-tl-xl bg-blue-500" />
              <div className="flex items-center justify-between mb-1">
                <div className="font-semibold text-base">{r.name}</div>
                <span className="bg-yellow-100 text-yellow-700 rounded px-2 py-1 text-xs font-bold">
                  {r.pointsRequired}ポイント
                </span>
              </div>
              <div className="mb-2 text-xs text-gray-600 whitespace-pre-line">{r.description}</div>
              {r.capacity !== undefined && (
                <div className="text-xs text-gray-500">定員：{r.capacity}人</div>
              )}
              <div className="flex gap-2 mt-3">
                <button
                  className="px-3 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium"
                  onClick={() => handleEdit(r)}
                >編集</button>
                <button
                  className="px-3 py-1 rounded bg-red-50 text-red-700 text-xs font-medium"
                  onClick={() => handleDelete(r.id)}
                >削除</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
