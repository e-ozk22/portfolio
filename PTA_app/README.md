# PTA活動アプリ「ちょこっと」
section9_teamD プロジェクト概要

---

## 🎯 プロジェクトの目的

保育園のPTA活動（役員・ボランティア）は「やりたくないわけではないけど、家庭や仕事の都合で参加しづらい」「毎回同じ人に負担が集中する」といった課題がありました。

このアプリは、**ポイント制度・貢献度の見える化・優先権・スタンプ等を通じて、参加のメリットと公平感をつくり出す**ことで、  
- 「無理なく一歩踏み出せる」保護者を増やし  
- **全員参加型で協力しやすい運営**  
- **先生や管理者の説明・調整負担も軽減できる仕組み**  
を実現することを目指します。

「やりたくない」を「やってみてもいいかも」へ――  
保護者も先生も**気持ちよく協力できるPTA活動**をサポートします。

---

## 🏗️ 技術構成

- **フロントエンド**: Next.js（TypeScript, React, TailwindCSS, Firebase, PWA対応, ESLint/Prettier, Vitest）
- **バックエンド**: Express（TypeScript, Prisma, MySQL, Stripe, Firebase認証, ESLint/Prettier, Vitest）
- **開発/運用**: Docker・Docker Compose・GitHub Actions（CI/CD）

---

## 📂 ディレクトリ構成

```
section9_teamD/
├── frontend/               # フロントエンド
│   ├── app/                # Next.jsページ・ルーティング
│   ├── actions/            # サーバーアクション
│   ├── components/         # 再利用コンポーネント
│   ├── hooks/              # カスタムフック
│   ├── lib/                # ライブラリ/ユーティリティ
│   ├── public/             # 画像・PWA設定など静的ファイル
│   ├── pages/              # NextAuth用APIエンドポイント
│   ├── data/               # データ
│   ├── types/              # 型定義
│   ├── tests/              # テストコード
│   ├── ...                 # 設定ファイル群
├── backend/                # バックエンド
│   ├── src/                # アプリケーション本体
│   │   ├── controllers/    # 各種コントローラー（機能ごとに処理を記述）
│   │   ├── routes/         # ルーティング設定
│   │   ├── middlewares/    # ミドルウェア（認証・エラーハンドリング等）
│   │   ├── services/       # サービス層（ビジネスロジック）
│   │   ├── utils/          # ユーティリティ
│   │   ├── types/          # 型定義
│   ├── prisma/             # Prisma ORM設定・マイグレーション
│   ├── ...                 # 設定ファイル群
├── docs/                   # ドキュメント（設計書・ER図・テスト戦略など）
├── .github/                # GitHub Actions（CI/CD設定）
│   └── workflows/          # ワークフローファイル置き場
│       └── develop-ci.yml  # developブランチ用CI（自動テスト・Lintを自動実行）
├── docker-compose.yml      # Dockerサービス管理
├── .env, .env.example      # 環境変数
└── README.md               # プロジェクト全体の概要・運用ルール（詳細は各ディレクトリのREADME参照）

※ フロントエンド・バックエンドの詳細な構成・セットアップ・利用方法は、それぞれの `frontend/README.md` および `backend/README.md` を参照してください。

```

---

## 🚀 セットアップ・起動手順（全体）

※ 必要環境：Node.js 18.x系 / 20.x系 / 22.x系 のいずれか（npmは9.x/10.xどちらも可）

1. **リポジトリをクローン**
    ```bash
    git clone https://github.com/ms-engineer-bc25-04/section9_teamD.git
    cd section9_teamD
    ```

2. **Dockerサービス起動（初回は --build 推奨）**
    ```bash
    docker compose up --build
    ```
    - 2回目以降は `docker compose up -d` でOK

3. **（初回のみ）バックエンドDBマイグレーション**
    ```bash
    docker compose exec backend npx prisma migrate dev --name init
    ```

4. **依存パッケージのインストール**

    ```bash
    # frontend用（通常はこちらのみインストール）
    cd frontend
    npm install

    # backend用（通常はDocker内で動くので不要だが、直接叩く場合のみ）
    cd backend
    npm install
    ```

5. **テスト実行**
    ```bash
    # frontend用
    cd frontend
    npm run test

    # backend用（Dockerコンテナ内で実行）
    docker compose exec backend npm run test

    # backendをローカルで直接実行する場合（上記でnpm install済みなら）
    cd backend
    npm run test

    ```

---

## 🧑‍💻 コーディング規約（Coding Convention）

### 📝 命名スタイル

- 命名はコードの可読性を大きく左右するため、以下のルールに従います。

| 名前の種類                     | 書き方                 | 例                            |
| ------------------------------ | ---------------------- | ----------------------------- |
| 変数 / 関数 / インスタンス     | `camelCase`            | `userName`, `fetchUser`       |
| 型（type / interface / class） | `PascalCase`           | `UserInfo`, `AuthContext`     |
| 定数（.env など）              | `SCREAMING_SNAKE_CASE` | `MAX_USER_COUNT`              |
| 真偽値（boolean 型）           | `isXxx`, `hasXxx`      | `isLoggedIn`, `hasPermission` |

### ❌ 禁止事項

- 意味のない**1 文字の命名は禁止**

```ts
// ❌ NG
const q = () => {};

// ✅ OK
const query = () => {};
```

### 変数宣言のルール

- const：基本の宣言（再代入しない場合）
- let：再代入が必要なときのみ使用
- var：使用禁止（スコープが不明瞭になるため）

```ts
const name = "Eriko"; // ✅ OK
let count = 0; // ✅ 再代入の必要があるときだけ
```

### 🗂️ ファイル・ディレクトリ構成

📁 ファイル命名ルール：kebab-case
小文字とハイフン（-）で統一
拡張子を忘れずに（例：.tsx, .ts）

```
components/user-card.tsx
hooks/use-auth.ts
```

### 📦 ディレクトリの役割ごとの構成

| ディレクトリ名 | 用途説明                                   |
| -------------- | ------------------------------------------ |
| components     | 再利用可能な UI 部品（ボタン・カードなど） |
| hooks          | カスタムフック（React 専用の再利用処理）   |
| lib            | 外部連携・ロジック処理（API, 認証など）    |
| features       | 機能ごとのまとまり（ドメイン単位）         |
| utils          | 汎用的な便利関数（フォーマットなど）       |

---

## 👨‍💻 開発フロー・ブランチ運用ルール

- **main / develop への直接push禁止**
- **必ず作業用ブランチを作成し、Pull Request（PR）経由で develop → main の順でマージ**
  - ブランチ名例: `feature/xxxx`, `bugfix/xxxx`, `docs/xxxx`
- **PRテンプレートを活用し、「目的・背景・内容・確認方法」など明記**

---

## 👥 プルリクエスト・レビューのポイント

- **PRは必ずチームメンバーの誰かに「レビュー&承認」を依頼**
    - PRを出したら、**SlackやGitHubの通知で「レビューお願いします！」も忘れずに！**
- **main / develop への直接pushは禁止**
- **必ずPR経由でレビュー後にマージ（develop→mainの順）**

---

## 🌿 ブランチ名一覧（推奨パターン）

| ブランチ名           | 一言説明                        | よく使う場面                                |
| -------------------- | ------------------------------- | ------------------------------------------- |
| main（または master）| 本番用の完成されたコード         | 最終的にここにマージされる                  |
| develop              | 開発中のコードをまとめる場所     | 機能をまとめてから main へマージ            |
| feature/〇〇         | 新機能の開発用                   | 1つの機能を集中して作るとき                 |
| bugfix/〇〇          | 不具合の修正用                   | 小さなバグ修正など                          |
| hotfix/〇〇          | 緊急の修正用                     | main に直接必要な急ぎの修正                 |
| release/〇〇         | リリース準備用                   | 本番公開前の最終チェック                    |
| test/〇〇            | テスト用                         | 検証・動作確認用の一時的ブランチ            |
| experiment/〇〇      | 試作・実験用                     | 新しい試み・実験コードを書くとき            |

---

## 🔀 マージ戦略

- **Merge commit（マージコミット）**  
  → 別々で進んだ内容を、developブランチで合体するときに使用します。

---

## 📥 プルリクエストのルール一覧（チーム共通）

| ルール内容                                                  |
| ----------------------------------------------------------- |
| タイトルは「目的｜対象ファイルや機能名」でわかりやすく書く  |
| 概要・背景・変更内容・影響範囲・スクショ（あれば）を明記    |
| ローカルで動作確認・lint・format 済みであることを前提に出す |
| WIP（作業中）のときは `[WIP]` をタイトルに含める            |
| 他人が見てすぐ理解できるよう、Markdown で整形して書く       |

## 📄 プルリクエストのテンプレート

### 🔍 概要

- ○○ 機能の追加（または修正／削除）
- 対象ページ：`/example-page`
- 対象ファイル：`example.tsx`, `example-api.ts`

### 🎯 背景・目的

- なぜこの変更を行ったか
- 例）◯◯ の UX 改善のため、△△ のような動作に修正した

### 🛠️ 変更内容
- 追加：〇〇コンポーネント
- 修正：API のレスポンス構造を変更
- 削除：未使用だった ×× 関数

### 🧪 動作確認
- [x] ローカルで表示確認
- [x] Lint / Format 実行済み
- [x] 該当機能のテストが通ることを確認（手動／自動）

### 📷 スクリーンショット（UI変更時のみ）
- 変更前・変更後の比較を画像で貼付

### 📝 補足
- 今後この部分をhooks化する予定です

---

## ⚠️ 注意・Tips

- **docker-compose up -dは必ずルートディレクトリで実行**
- **.envファイル（DB認証情報・APIキーなど）は絶対にGit管理/公開しないこと**
- **詳しいセットアップ・運用は frontend/backend 各README.md参照**
- **GitHub ActionsによるCI（developブランチ用）でLint/テスト自動実行**
- **mainブランチの.github/workflowsだけがCI有効。**  
- **設計・運用ルール・開発の詳細は /docs 内の設計書も必ず確認すること**

---

## 📚 関連ドキュメント

- [docs/ER図.drawio](./docs/ER図.drawio)　：ER図  
- [docs/API設計書.yaml](./docs/API設計書.yaml) ：API設計  
- [docs/アーキテクチャ図.md](./docs/アーキテクチャ図.md) ：システム構成  
- [docs/DB設計書.md](./docs/DB設計書.md) ：DB設計  
- [docs/テスト設計書.md](./docs/テスト設計書.md) ：テスト戦略  
- [docs/画面設計書.md](./docs/画面設計書.md) ：画面UI設計  

---

## 🚩 チーム開発のお願い

- 本プロジェクトは**Pull Request駆動開発**です
- 質問・レビュー・改善提案は遠慮なくSlackやIssueで共有してください！

---

**最終更新：2025年7月（進捗に応じて適宜アップデート）**

---



