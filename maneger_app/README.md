# 🫰🏻 推し活お小言マネージャー 👛

## 概要

「推し活お小言マネージャー」は、LINE Bot だけで完結するミニマルなサービス。推し活用のサブ口座をもつ個人ユーザーを対象に、月予算と実際の残高を比較し、予算オーバーなら あなただけの敏腕マネージャー（ChatGPT）がユーモアたっぷりのお小言を、予算内に収まっていれば愛ある称賛のひと言を返すチャットボットです。

## ターゲットユーザー

- 推し活の支出管理をしたい人
- 推し活用に別口座（例：GMO あおぞら銀行のサンドボックス口座など）を管理している人
- 家計簿や複雑なアプリではなく、LINE だけで完結したい人

## 主な機能

1. **基本機能**

   - 残高照会 (`残高`)
   - 明細履歴の確認 (`明細`)
   - 今月の出費と予算の比較＋ AI 評価 (`今月どう？`)

2. **予算管理**

   - 月間予算を登録（DynamoDB に保存） (`予算 {金額}`)

3. **振替機能**

   - 親口座 → 子口座へ振替 (`振替 {金額}`)
   - 子口座 → 親口座へ支出処理（`推し活支払 {金額}`）
   - EventBridge による定期自動振替（スケジューラー対応）

4. **通知機能**
   - 予算オーバーのときに自動で LINE 通知（CloudWatch + EventBridge）

## 技術スタック

| 区分           | 使用技術             |
| -------------- | -------------------- |
| Bot I/F        | LINE Messaging API   |
| 実行環境       | AWS Lambda (Node.js) |
| Webhook        | API Gateway          |
| データベース   | Amazon DynamoDB      |
| 銀行連携       | sunabar API          |
| スケジューラー | Amazon EventBridge   |
| ログ・監視     | CloudWatch Logs      |
| AI 連携        | OpenAI GPT-4o-mini   |

## 環境構築手順

### 必要な環境変数（.env など）

```bash
# LINE Bot設定
channelSecretLINE=YOUR_LINE_CHANNEL_SECRET
channelAccessTokenLINE=YOUR_LINE_CHANNEL_ACCESS_TOKEN

# OpenAI API設定
OPENAI_API_KEY=YOUR_OPENAI_API_KEY

# すなばAPI設定
sunabarToken=YOUR_SUNABAR_TOKEN

# 口座情報
OSHIKATSU_ACCOUNT_ID=YOUR_OSHIKATSU_ACCOUNT_ID
PARENT_ACCOUNT_ID=YOUR_PARENT_ACCOUNT_ID
accountid=YOUR_ACCOUNT_ID
```

### インストール

```bash
npm install
```

## 開発者向け情報

### ディレクトリ構成

```bash
Section8_teamA/
├─ index.js                            # Lambdaのエントリーポイント
├─ checkBalance.js                     # 残高照会処理
├─ checkStatement.js                   # 明細照会処理
├─ budgetRegister.js                   # 月間予算の登録
├─ monthlySummary.js                   # 今月の使用状況をまとめてAI返信
├─ oshikatsuPayment.js                # 子口座から支払い（擬似処理）
├─ transfer_parent_to_child_account.js # 親→子口座への資金移動
├─ scheduledPush.js                    # 自動通知（EventBridge）
├─ scheduledTransfer.js                # 定期自動振替
├─ defaultReply.js                     # デフォルトメッセージ応答
├─ package.json                        # 依存パッケージ定義
```

### コードベース：Node.js

### 依存パッケージ

```bash
{
  "dependencies": {
    "@aws-sdk/client-dynamodb": "^3.830.0",
    "@aws-sdk/lib-dynamodb": "^3.830.0",
    "@line/bot-sdk": "^10.0.0",
    "openai": "^5.5.1"
  }
}
```

## API 機能一覧（Lambda 単位）

| 関数名                              | 機能概要                                         |
| ----------------------------------- | ------------------------------------------------ |
| index.js                            | Lambda の統合エントリーポイント                  |
| checkBalance.js                     | 残高照会（GMO あおぞらサンドボックス連携）       |
| budgetRegister.js                   | 月間予算の登録と更新（DynamoDB）                 |
| monthlySummary.js                   | 出金額と予算を比較 → OpenAI で褒め or お小言生成 |
| checkStatement.js                   | 取引明細の取得と整形返信                         |
| oshikatsuPayment.js                 | 推し活支払い処理（DynamoDB 反映）                |
| transfer_parent_to_child_account.js | 親 → 子口座への資金移動処理                      |
| scheduledPush.js                    | 予算超過などの定期通知（EventBridge 起動）       |
| defaultReply.js                     | その他のメッセージへのデフォルト応答             |

### 備考

本プロジェクトは短期間での MVP 開発のため、LINE Bot は 1 チャネルに統一。
開発・検証用 Bot 分離や CI/CD の導入も今後の検討課題としています。
