# PTA活動アプリ「ちょこっと」 データベース設計書

## 1.概要
本データベースは、保護者と保育園のPTA活動を円滑にするアプリ「ちょこっと」を支える構造です。  
イベント参加、スタンプ、ポイント、優先権などをデータで一元管理し、公平な運営と参加意欲の向上を目指します。

※ 本アプリの全時刻は `Asia/Tokyo`（JST）で記録されます。

---

## 2.テーブル一覧

### `nurseries` テーブル（保育園）

**目的**：保育園ごとの情報を管理する

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| id | UUID | 保育園ID（主キー） |
| name | VARCHAR(255) | 保育園名 |
| created_at | TIMESTAMP | 作成日時 |

---

### `users` テーブル（保護者・職員）

**目的**：アプリのログインユーザー情報を管理

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| id | UUID | ユーザーID（主キー） |
| nursery_id | UUID | 所属保育園ID（FK） |
| name | VARCHAR(255) | 氏名 |
| email | VARCHAR(255) | メールアドレス（一意, NOT NULL） |
| password_hash | VARCHAR(255) | ハッシュ化済みパスワード |
| role | VARCHAR(50) | `保護者` / `職員` |
| is_admin | BOOLEAN | 管理者フラグ（true = 管理者） |
| profile_image_url | VARCHAR(255) | プロフィール画像URL（任意） |
| created_at | TIMESTAMP | 登録日時 |

---

### `children` テーブル（子ども）

**目的**：保護者に紐づく子どもの情報を管理

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| id | UUID | 子どもID（主キー） |
| user_id | UUID | 保護者ユーザーID（FK） |
| name | VARCHAR(255) | 子ども名前 |
| class_name | VARCHAR(100) | クラス名（例：ひよこ組） |
| created_at | TIMESTAMP | 作成日時 |

---

### `events` テーブル（イベント）

**目的**：PTAイベントの基本情報を管理

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| id | UUID | イベントID（主キー） |
| title | VARCHAR(255) | イベント名 |
| description | TEXT | 内容 |
| date | DATE | 実施日 |
| start_time | TIME | イベント開始時間 |
| end_time | TIME | イベント終了時間 |
| location | VARCHAR(255) | 実施場所 |
| required_items | TEXT | 持ち物（例：軍手など） |
| special_notes | TEXT | 特記事項（任意） |
| capacity | INTEGER | 定員（任意） |
| deadline | DATE | 申込締切日 |
| point_reward | INTEGER | 付与ポイント数（ポイント付与されないイベントは0） |
| privilege_allowed | BOOLEAN | 優先権が使用可否 |
| created_by | UUID | 作成ユーザーID（users.id） |
| created_at | TIMESTAMP | 作成日時 |

---

### `event_slots` テーブル（イベント時間枠）

**目的**：イベントを時間帯ごとに分けて管理

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| id | UUID | スロットID（主キー） |
| event_id | UUID | 対象イベントID（FK） |
| start_time | TIME | 開始時刻 |
| end_time | TIME | 終了時刻 |
| capacity | INTEGER | 各時間帯の定員 |
| created_at | TIMESTAMP | 作成日時 |

---

### `event_applications` テーブル（イベント申込）

**目的**：イベントへの参加申込状況を管理

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| id | UUID | 申込ID（主キー） |
| event_id | UUID | イベントID（FK） |
| user_id | UUID | ユーザーID（FK） |
| slot_id | UUID | スロットID |
| status | VARCHAR(20) | `applied` / `cancelled` |
| applied_at | TIMESTAMP | 申込日時 |
| created_at | TIMESTAMP | 作成日時 |

---

### `event_reactions` テーブル（スタンプ・リアクション）

**目的**：イベントへのスタンプ反応（ありがとう等）を記録

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| id | UUID | リアクションID（主キー） |
| event_id | UUID | イベントID（FK） |
| user_id | UUID | 押したユーザーID（FK） |
| emoji | VARCHAR(10) | スタンプ種類（例: 👍） |
| reacted_at | TIMESTAMP | 押した日時 |
| created_at | TIMESTAMP | 作成日時（リアクション登録） |

---

### `points` テーブル（ポイント履歴）

**目的**：ユーザーのポイント履歴を管理

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| id | UUID | ポイントID（主キー） |
| user_id | UUID | ユーザーID（FK） |
| event_id | UUID | イベントID（FK） |
| points | INTEGER | 付与ポイント数 |
| granted_at | TIMESTAMP | 付与日時 |
| created_at | TIMESTAMP | 作成日時（履歴登録） |

---

### `rewards` テーブル（ポイントで交換できる優先権の種類）

**目的**：交換可能な優先権のカタログ情報を管理

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| id | UUID | カタログID（主キー） |
| name | VARCHAR(255) | 優先権名（例：運動会前列スペース） |
| description | TEXT | 説明 |
| points_required | INTEGER | 必要ポイント数 |
| capacity | INTEGER | 利用可能数（例：6枠まで） |
| created_at | TIMESTAMP | 作成日時 |

---

### `privileges` テーブル（イベント優先権：ポイントで交換申請）

**目的**：ユーザーがポイントで交換した優先権の記録

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| id | UUID | 優先権ID（主キー） |
| user_id | UUID | 保護者ユーザーID（FK） |
| event_id | UUID | 対象イベントID（FK） |
| reward_id | UUID | 交換元の優先権の種類ID（FK） |
| status | VARCHAR(20) | `exchanged` / `used` |
| exchanged_at | TIMESTAMP | ポイント交換日時 |
| created_at | TIMESTAMP | 登録日時 |

---

### `payment_methods` テーブル（Stripe決済情報：保育園単位）

**目的**：保育園ごとの決済情報をStripeで管理

| カラム名 | 型 | 説明 |
| --- | --- | --- |
| id | UUID | 支払い情報ID（主キー） |
| nursery_id | UUID | 保育園ID（FK） |
| stripe_customer_id | VARCHAR(255) | Stripe顧客ID |
| stripe_payment_method_id | VARCHAR(255) | Stripe支払方法ID |
| is_active | BOOLEAN | 有効フラグ（true=使用中） |
| created_at | TIMESTAMP | 登録日時 |

---

## 3.リレーション概要

- `users.nursery_id` → `nurseries.id`：ユーザーは保育園に所属
- `children.user_id` → `users.id`：保護者ユーザーに子どもが所属
- `events.created_by` → `users.id`：イベントは職員が作成
- `event_slots.event_id` → `events.id`：イベントごとの時間帯
- `event_applications.user_id` → `users.id`：保護者による申込
- `event_applications.slot_id` → `event_slots.id`：時間枠との紐付け
- `points.event_id` → `events.id`：ポイントはイベントに紐づく
- `privileges.reward_id` → `rewards.id`：優先権の交換履歴
- `payment_methods.nursery_id` → `nurseries.id`：保育園ごとの決済

---

## 4.設計・命名方針メモ

- 各テーブルのIDは「重ならないようにするため」に英数字の長い文字（UUID）を使っています
- 日時を記録するカラム（created_at, updated_at）は、いつ作られたか・更新されたかを残すために使います
- 「はい・いいえ」を表す項目（例：管理者かどうか）は `is_〜` という名前にしています（例：is_admin）
- 状態を表す項目（例：申込ステータスなど）は、英単語の文字でわかりやすく書いています（例：`applied`, `cancelled`）
