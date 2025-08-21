# PTA活動アプリ「ちょこっと」バックエンド概要

## プロジェクト概要

- PTA活動管理アプリ「ちょこっと」のバックエンドAPIを実装
- Express/TypeScriptで各種APIエンドポイントを提供
- MySQL（Docker＋Prisma）でDB管理
- Firebase Authentication（トークン認証）、Stripe決済API連携

---

## 主要技術

| 技術・ツール         | バージョン例   |
|----------------------|---------------|
| TypeScript           | 5.8.3         |
| Node.js              | 18.x/20.x/22.x（いずれか） |
| Express              | 5.1.0         |
| Prisma               | 6.10.1        |
| MySQL                | 8             |
| Firebase Admin       | 13.4.0        |
| Stripe               | 18.2.1        |
| ESLint               | 9.29.0        |
| Prettier             | 3.6.0         |
| vitest               | 3.2.4         |
| Docker               | -             |

---

## ディレクトリ構成

```
backend/
├── src/
│   ├── index.ts               # エントリーポイント
│   ├── controllers/           # 各種APIコントローラー
│   │   ├── event-controller.ts
│   │   ├── point-controller.ts
│   │   ├── privileges-controller.ts
│   │   ├── reward-controller.ts
│   │   ├── stampController.ts
│   │   └── user-controller.ts
│   ├── routes/                # Expressルーティング
│   │   ├── events.ts
│   │   ├── points.ts
│   │   ├── rewards.ts
│   │   ├── privileges.ts
│   │   ├── users.ts
│   │   ├── stamp.ts
│   │   └── auth.ts
│   ├── middlewares/           # 認証・エラー処理など
│   │   ├── auth-middleware.ts
│   │   └── error-handler.ts
│   ├── services/              # サービスロジック
│   │   ├── user-service.ts
│   │   └── event-service.ts
│   ├── utils/                 # JWT関連など
│   │   └── jwt.ts
│   └── types/                 # 型定義
│       └── index.d.ts
├── prisma/
│   ├── schema.prisma          # Prismaスキーマ
│   ├── client.ts              # Prismaクライアント設定
│   ├── migrations/            # マイグレーション履歴
│   └── seed.ts                # シーディングスクリプト
├── .env                       # 環境変数ファイル
├── .env.example               # サンプル環境変数ファイル
├── .gitignore
├── Dockerfile
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md                  # バックエンド全体のREADMEファイル
```

---

## 各ディレクトリの役割

| ディレクトリ      | 役割 |
|-------------------|--------------------------------------------------------|
| `src/`            | サーバーサイドAPI実装のメインディレクトリ              |
| `prisma/`         | Prisma用DBスキーマ・マイグレーション・クライアント     |

---

## 環境構築・起動手順

1. **リポジトリをクローン**

    ```bash
    git clone https://github.com/ms-engineer-bc25-04/section9_teamD.git
    cd section9_teamD
    ```

2. **Node.js / npmバージョンを確認**

    ```bash
    node -v
    npm -v
    ```
    - **Node.js 18.x系 / 20.x系 / 22.x系 のいずれかでOK**

3. **Dockerコンテナの起動**
    ※通常はDockerコンテナとしてバックエンド・DBを管理しています。  
      ルートディレクトリ（section9_teamD/）直下で下記コマンドを実行してください。

    ```bash
    docker compose up -d
    ```
    - MySQL・バックエンドAPIなど全サービスが起動します。

4. **PrismaマイグレーションとDB初期化（初回のみ）**

    ```bash
    docker compose exec backend npx prisma migrate dev --name init
    ```

5. **開発サーバーの起動**

   - Docker起動後、自動的に[http://localhost:4000]でAPIサーバーが立ち上がります。


### (参考)ローカルでNode.js単体で開発したい場合

※基本は不要です。直接TypeScriptでコードを試したい・個別デバッグしたい場合のみ。

1. **依存パッケージのインストール**

    ```bash
    cd backend
    npm install
    ```
2. **開発サーバーの起動**

    ```bash
    npm run dev
    ```
    - ブラウザで[http://localhost:4000]を開きます。

3. **（任意）テスト実行**

    ```bash
    npm run test
    ```

- **通常運用はDocker管理です。npm install等は直接開発時以外は不要です！**
- **フロントエンドとのAPI連携もDockerで自動的に接続されます。**
- **全体運用ルールや起動手順のまとめは、ルートディレクトリ直下の`README.md`も参照してください。**

---

## よく使うPrisma関連コマンド（必要に応じて）

以下は主に**直接バックエンドを開発/デバッグしたい場合**や**DBスキーマ変更時**に使用します。

```bash
# マイグレーション適用（DBスキーマの反映）
npm run migrate

# Prismaクライアント生成（モデル更新時）
npm run generate

# シーディング（初期データ投入）
npm run seed

# Prisma Studio（GUIでDBを確認）
npm run studio
```

- 通常は docker compose exec backend npx prisma migrate dev --name init だけでOKです。
- 詳細な手順や使い方はチーム運用にあわせて適宜調整してください。

---

## 環境変数例（.env）

```env
# Firebase
FIREBASE_PROJECT_ID=xxxxxxx
FIREBASE_CLIENT_EMAIL=xxxx@xxxx.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxxxxxx
```

---

## APIエンドポイント例

- /api/events : イベント一覧・作成・編集
- /api/points : ポイント履歴取得・付与
- /api/priority-rights : 優先権情報取得
- /api/rewards : 優先権管理
- /api/stamps : スタンプ機能
- /api/users : ユーザー情報

（管理者向けAPI・Firebase認証API・Stripe決済APIなども実装可）

---

## 静的解析・フォーマッタ・テスト運用

- **リント/フォーマットチェック**

    ```bash
    npm run lint    # ESLint
    npm run format  # Prettier
    ```

- **テスト実行**

    ```bash
    npm run test
    ```

- **CI/CD**
    - developブランチへのpush・PR時、自動でLint＆テストをGitHub Actionsで実行

---

## よく使うスクリプト

| コマンド           | 説明                                   |
|--------------------|----------------------------------------|
| `npm run dev`      | 開発サーバー起動                       |
| `npm run build`    | 本番用ビルド生成（TypeScript→JS変換）   |
| `npm run start`    | ビルド済みアプリ起動                   |
| `npm run migrate`  | Prismaマイグレーション適用             |
| `npm run generate` | Prismaクライアント生成                　|
| `npm run studio`   | Prisma Studio（DB GUI）起動            |
| `npm run lint`     | ESLintによる静的解析                    |
| `npm run format`   | ESLintによる静的解析                    |
| `npm run test`     | vitestによるテスト                      |

---

## 主要な設定ファイル

| ファイル　              | 用途                                         |
|------------------------|----------------------------------------------|
| `.env`                  | 環境変数の設定（DB接続・認証キーなど）        |
| `tsconfig.json`         | TypeScriptコンパイラ設定                      |
| `prisma/schema.prisma`  | Prisma（DB）スキーマ設定                      |
| `prisma/client.ts`      | Prismaクライアント設定                        |
| `Dockerfile`            | Dockerコンテナ用のビルド設定                  |
| `vitest.config.ts`      | テストフレームワーク（Vitest）の設定           |
| `package.json`          | npmパッケージ・スクリプト設定                 |

---

## Tips・よくあるトラブル
- Prisma StudioでDBの中身を見たいとき：
```bash
npm run studio
```

- MySQLに接続できない場合は .env の DATABASE_URL が正しいか確認
- DockerのMySQLコンテナが起動しているか docker ps で確認
- Firebase認証に関するエラーは秘密鍵・プロジェクトIDが正しいか確認
- マイグレーション/Seedingエラー：DB初期化やマイグレーション漏れに注意
- Node.jsバージョンはCIと同じく18/20/22系いずれかでOK
- その他、開発フローやブランチ運用ルールはルートディレクトリ直下のREADME.mdを参照

---

## ⚠️開発時の注意事項
- 必ずdocker-compose up -dはルートディレクトリで実行！
- .envファイルはGit管理しない・公開しないこと！
- DB構成変更時は、Prismaマイグレーション＆マニュアルに必ず反映

---

## 設計・参考ドキュメント

- `../docs/ER図.drawio`           : データベースER図  
- `../docs/API設計書.md`          : バックエンドAPI設計  
- `../docs/アーキテクチャ図.md`   : システム全体構成  
- `../docs/DB設計書.md`           : テーブル詳細  
- `../docs/テスト設計書.md`       : テスト戦略・指針

---
