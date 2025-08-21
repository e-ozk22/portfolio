// イベントのプレースホルダーデータ
export const events = [
  // {
  //   id: "1",
  //   title: "運動会準備ボランティア",
  //   date: "2025年7月10日(水)",
  //   time: "18:30 - 19:30", // 時間を更新 (1時間作業)
  //   location: "園庭",
  //   points: 20, // 1時間作業で20pt
  //   status: "募集中",
  //   maxParticipants: 10, // 30分あたり5人 x 2枠 = 10人
  //   description:
  //     "運動会の準備をお手伝いいただくボランティアを募集しています。テント設営、会場準備、備品運搬など、力仕事が中心となります。お子様連れでの参加も可能です。",
  //   itemsToBring: "動きやすい服装、軍手、飲み物", // 新しい項目
  //   specialNotes: "小雨決行。中止の場合は当日午前中に連絡します。", // 新しい項目
  // },
  // {
  //   id: "2",
  //   title: "バザー品作成",
  //   date: "2025年7月15日(月)",
  //   time: "18:30 - 19:30", // 時間を更新 (1時間作業)
  //   location: "保育室",
  //   points: 20, // 1時間作業で20pt
  //   status: "募集中",
  //   maxParticipants: 10, // 30分あたり5人 x 2枠 = 10人
  //   description: "バザーで販売する手作り品を作成します。裁縫や工作が得意な方、ぜひご参加ください。",
  //   itemsToBring: "裁縫道具（必要な方）、エプロン",
  //   specialNotes: "材料は園で用意します。お子様連れでの参加も可能です。",
  // },
  // {
  //   id: "3",
  //   title: "園内清掃",
  //   date: "2025年7月20日(土)",
  //   time: "09:00 - 10:30", // 時間を更新 (1.5時間作業)
  //   location: "園舎全体",
  //   points: 30, // 30分作業で10pt x 3枠 = 30pt
  //   status: "募集前",
  //   maxParticipants: 30, // 30分あたり10人 x 3枠 = 30人
  //   description: "園舎全体の大掃除を行います。普段手の届かない場所もきれいにしましょう。",
  //   itemsToBring: "動きやすい服装、タオル",
  //   specialNotes: "清掃用具は園で用意します。",
  // },
  // {
  //   id: "4",
  //   title: "夏祭りお手伝い",
  //   date: "2025年8月5日(火)",
  //   time: "16:00 - 20:00",
  //   location: "園庭・体育館",
  //   points: 80, // 4時間作業で80pt (30分10pt x 8枠)
  //   status: "募集前",
  //   maxParticipants: 40, // 30分あたり5人 x 8枠 = 40人 (既存のmaxParticipants: 20から変更)
  //   description: "夏祭りの準備から運営までお手伝いをお願いします。屋台の準備や会場設営など。",
  //   itemsToBring: "動きやすい服装、帽子、飲み物",
  //   specialNotes: "夕食は各自でご用意ください。休憩スペースあり。",
  // },
  // {
  //   id: "5",
  //   title: "卒園式準備",
  //   date: "2025年3月10日(月)",
  //   time: "09:00 - 12:00",
  //   location: "体育館",
  //   points: 60, // 3時間作業で60pt (30分10pt x 6枠)
  //   status: "終了",
  //   maxParticipants: 18, // 30分あたり3人 x 6枠 = 18人 (既存のmaxParticipants: 12から変更)
  //   description: "卒園式の会場設営や飾り付けを行います。感動的な一日を演出しましょう。",
  //   itemsToBring: "特になし",
  //   specialNotes: "細かい作業が多いです。お子様連れでの参加はご遠慮ください。",
  // },
  {
    id: "6",
    title: "プールの見回り",
    date: "2025年7月31日(木)",
    time: "10:00 - 11:30",
    location: "保育園プール",
    points: 30, // 1.5時間作業で30pt (30分10pt x 3枠)
    status: "募集中",
    maxParticipants: 5, // 30分あたり5人 x 3枠 = 15人
    description: "プールの安全を見守る見回りボランティアです。",
    itemsToBring: "動きやすい服装、タオル、帽子、飲み物",
    specialNotes: "監視員資格は不要です。日差しが強いので熱中症対策をお願いします。",
  },
  // {
  //   id: "7",
  //   title: "七夕飾り付け準備",
  //   date: "2025年7月6日(日)",
  //   time: "18:30 - 19:00",
  //   location: "遊戯室",
  //   points: 10, // 30分作業で10pt
  //   status: "募集前",
  //   maxParticipants: 5, // 30分あたり5人 x 1枠 = 5人
  //   description: "七夕飾りの準備と飾り付けを行います。",
  //   itemsToBring: "特になし",
  //   specialNotes: "ハサミやのりなど、細かい作業があります。",
  // },
  // {
  //   id: "8",
  //   title: "お祭り準備",
  //   date: "2025年8月10日(日)",
  //   time: "18:30 - 19:30",
  //   location: "園庭・体育館",
  //   points: 20, // 1時間作業で20pt
  //   status: "募集前",
  //   maxParticipants: 10, // 30分あたり5人 x 2枠 = 10人
  //   description: "夏祭り会場の設営や屋台の準備をお手伝いいただきます。",
  //   itemsToBring: "動きやすい服装、飲み物",
  //   specialNotes: "力仕事が含まれます。",
  // },
  // {
  //   id: "9",
  //   title: "お祭り片付け",
  //   date: "2025年8月11日(月)",
  //   time: "18:30 - 19:30",
  //   location: "園庭・体育館",
  //   points: 20, // 1時間作業で20pt
  //   status: "募集前",
  //   maxParticipants: 10, // 30分あたり5人 x 2枠 = 10人
  //   description: "夏祭り終了後の片付け作業です。",
  //   itemsToBring: "動きやすい服装、軍手",
  //   specialNotes: "ゴミの分別にご協力ください。",
  // },
  // {
  //   id: "10",
  //   title: "運動会片付け",
  //   date: "2025年7月11日(木)",
  //   time: "18:30 - 19:30",
  //   location: "園庭",
  //   points: 20, // 1時間作業で20pt
  //   status: "募集前",
  //   maxParticipants: 10, // 30分あたり5人 x 2枠 = 10人
  //   description: "運動会終了後の片付け作業です。",
  //   itemsToBring: "動きやすい服装、軍手",
  //   specialNotes: "日没後の作業になります。",
  // },
  {
    id: "11",
    title: "読み聞かせ",
    date: "2025年7月22日(火)",
    time: "09:00 - 09:30",
    location: "保育園",
    points: 10, // 30分作業で10pt
    status: "募集中",
    maxParticipants: 2, // 30分あたり2人 x 1枠 = 2人
    description: "園児への絵本の読み聞かせボランティアです。",
    itemsToBring: "特になし",
    specialNotes: "読み聞かせの絵本は園で用意します。",
  },
  // {
  //   id: "12",
  //   title: "クリスマス会飾り付け",
  //   date: "2025年12月20日(土)",
  //   time: "18:30 - 19:00",
  //   location: "遊戯室",
  //   points: 10, // 30分作業で10pt
  //   status: "募集前",
  //   maxParticipants: 5, // 30分あたり5人 x 1枠 = 5人
  //   description: "クリスマス会の会場飾り付けを行います。",
  //   itemsToBring: "特になし",
  //   specialNotes: "脚立を使用する場合があります。",
  // },
  // {
  //   id: "13",
  //   title: "節分飾り付け",
  //   date: "2026年2月2日(月)",
  //   time: "18:30 - 19:00",
  //   location: "遊戯室",
  //   points: 10, // 30分作業で10pt
  //   status: "募集前",
  //   maxParticipants: 5, // 30分あたり5人 x 1枠 = 5人
  //   description: "節分イベントの会場飾り付けを行います。",
  //   itemsToBring: "特になし",
  //   specialNotes: "鬼のお面作りなど、簡単な工作があります。",
  // },
]

export type Event = Omit<(typeof events)[0], "participants"> & {
  participants?: number
  applicationsCount?: number // ← これ追加！
  itemsToBring: string // 新しいプロパティ
  specialNotes: string // 新しいプロパティ
}
