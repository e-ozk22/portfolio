# PTA活動アプリ「ちょこっと」フロントエンド概要

## プロジェクト概要

- PTA活動管理アプリ「ちょこっと」の画面UI全般を実装
- ユーザーによるイベント参加、ポイント管理、優先権利用等の機能を提供
- 入力フォームから取得した情報をバックエンドAPIに送信し、DBから取得した情報を画面表示
- Firebase認証・管理画面・PWA対応（スマホ追加可）に対応

---

## 主要技術

| 技術・ツール         | バージョン     |
|----------------------|---------------|
| TypeScript           | 5.4.0         |
| Node.js              | 18.x/20.x/22.x（いずれか） |
| Next.js              | 15.2.4        |
| React                | 18.2.0        |
| Firebase             | 11.9.1        |
| TailwindCSS          | 4.1.11        |
| zod                  | 3.24.1        |
| ESLint               | 9.29.0        |
| Prettier             | 3.6.0         |
| vitest               | 3.2.4         |
| next-pwa             | 5.6.0         |
| Docker               | （推奨開発環境）|
| GitHub Actions       | （CI/CD運用）  |

---

## ディレクトリ構成

```
frontend/
├── actions/ # サーバーアクション(API通信ロジック)
├── app/ # Next.js App Routerメイン実装・各ページ
│ ├── login/ # ログイン画面
│ ├── register/ # 新規登録画面
│ ├── events/ # イベント一覧・詳細
│ ├── points/ # ポイント情報等
│ ├── point-history/ # ポイント履歴
│ ├── priority-rights/ # 優先権
│ ├── privileges/ # 特典一覧
│ ├── profile/ # プロフィール
│ ├── admin/ # 管理者画面関連
│ │ ├── menu/ # 管理メニュー
│ │ ├── events/ # イベント管理
│ │ ├── points/ # ポイント管理
│ │ ├── rewards/ # 景品管理
│ │ └── card/ # カード管理
│ └── ... # その他機能ページ
├── components/ # 再利用コンポーネント(UI/共通部品)
│ ├── layout/ # レイアウト系
│ └── ui/ # UIパーツ
├── hooks/ # カスタムフック（認証・API呼び出し等）
├── lib/ # Firebase連携、APIクライアント、ユーティリティ
├── data/ # ダミーデータ・初期データ
├── public/ # 画像・PWAマニフェスト等の静的ファイル
├── pages/ # Next.js pages (APIルート、主に認証APIのみ)
│ └── api/ # NextAuthなどAPIエンドポイント（認証API中心）
├── tests/ # テストコード
├── types/ # 型定義
├── .env # 環境変数設定ファイル
├── .env.example # 環境変数サンプル
├── .gitignore # Git管理除外ファイル
├── .prettierrc # Prettier設定
├── eslint.config.js # ESLint設定
├── tailwind.config.ts # TailwindCSS設定
├── vitest.config.ts # vitestテスト設定
├── package.json # 依存管理・スクリプト定義
├── postcss.config.mjs # PostCSS設定
├── tsconfig.json # TypeScript設定
├── next.config.ts # Next.js設定
├── next-env.d.ts # Next.js用型定義
├── vitest.setup.ts # vitestテストセットアップ
└── README.md # フロントエンド全体のREADMEファイル
```

---

## 各ディレクトリの役割

| ディレクトリ      | 役割 |
|-------------------|--------------------------------------------------------|
| `app/`            | Next.js App Router構成の主要ページ、各種ルート実装      |
| `actions/`        | サーバー側で実行するロジック/API通信                    |
| `components/`     | 画面レイアウトやUI部品をまとめたもの                    |
| `hooks/`          | 再利用可能なReactフック（認証管理、APIデータ取得等）     |
| `lib/`            | Firebase連携、APIクライアント、ユーティリティ           |
| `public/`         | 画像・アイコン・PWA用manifestなど静的ファイル           |
| `tests/`          | 単体テスト・E2Eテストコード                             |

---

## 環境構築・起動手順

1. **リポジトリをクローン**

    ```bash
    git clone https://github.com/ms-engineer-bc25-04/section9_teamD.git
    cd section9_teamD/frontend
    ```

2. **Node.js / npmバージョンを確認**
    ```bash
    node -v
    npm -v
    ```
    - **Node.js 18.x系 / 20.x系 / 22.x系 のいずれかでOK**

3. **依存パッケージをインストール**
    ```bash
    npm install
    ```

4. **開発サーバー起動**
    ```bash
    npm run dev
    ```
    - ブラウザで [http://localhost:3000]を開きます。
    - バックエンドAPI/DBは**ルートディレクトリでDocker起動済みが前提**です。

### その他・運用のポイント

- **フロントエンドはDocker不要。npm scriptsで直接開発する運用が標準です。**
- **API/DB（バックエンド）はDockerで管理しています。**  
- **全体運用ルールや起動手順のまとめは、ルートディレクトリ直下の`README.md`も参照してください。**

---

## 環境変数例（.env）

```env
NEXT_PUBLIC_API_URL=xxxxxxxxx

# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxxxxxxxxxxxxxxxxxxxx
```

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

| コマンド           | 説明                                   　|
|--------------------|----------------------------------------|
| `npm run dev`      | 開発サーバー起動                       　|
| `npm run build`    | 本番用ビルド生成                       　|
| `npm run start`    | ビルド済みアプリ起動                   　|
| `npm run lint`     | ESLintによる静的解析                    |
| `npm run format`   | Prettierによるコード整形    　　　　　　 |
| `npm run test`     | vitestによるテスト                      |

---

## 主要な設定ファイル

| ファイル            | 役割                                       |
|---------------------|--------------------------------------------|
| `.env`              | 環境変数設定（APIエンドポイント等）         |
| `.prettierrc`       | コードフォーマット設定                      |
| `eslint.config.js`  | コード品質管理ルール                        |
| `tailwind.config.ts`| CSSフレームワーク設定                       |
| `vitest.config.ts`  | テスト実行設定                              |
| `package.json`      | 依存パッケージ・実行スクリプト管理           |

---

## Tips・よくあるトラブル

- PWA動作に不具合がある場合はキャッシュクリアや`npm run build`再実行を試してください
- Firebase認証でエラーの場合は`.env`やFirebaseコンソールの設定、APIキー・認証情報を再確認
- API連携エラーは `.env` のAPIエンドポイントやネットワーク接続を確認
- その他、開発フローやブランチ運用ルールはルートディレクトリ直下のREADME.mdを参照

---

## 設計・参考ドキュメント

- `../docs/ER図.drawio`           : データベースER図  
- `../docs/API設計書.md`          : バックエンドAPI設計  
- `../docs/アーキテクチャ図.md`   : システム全体構成  
- `../docs/DB設計書.md`           : テーブル詳細  
- `../docs/テスト設計書.md`       : テスト戦略・指針  
- `../docs/画面設計書.md`         : 主要画面UI設計

---
