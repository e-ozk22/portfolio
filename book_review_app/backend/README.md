# API 設計書

### ベース URL 　　

```
localhost:8000/
```

🔐 POST /login

- 概要: ログイン処理を行い、トークンを発行する

- 認証: 不要

- リクエスト

```
{
  "email": "user@example.com",
  "password": "password123"
}
```

- レスポンス

```
{
  "access_token": "xxxxxxxx.yyyyyyyy.zzzzzzzz",
  "token_type": "bearer"
}
```

- ステータスコード

  -200 OK: ログイン成功

  -401 Unauthorized: メールアドレスまたはパスワードが間違っている

🏠 GET /me

- 概要: トークンからユーザーを特定

- 認証: 必須（Bearer トークン）

- リクエストヘッダー

```
Authorization: Bearer <access_token>
```

- レスポンス

```
{
  "message": "〇〇さん、ようこそマイページへ!",
  "email": "user@example.com",
  "user_id": 1
}
```

- ステータスコード

  - 200 OK: 正常に取得

  - 401 Unauthorized: トークンが無効

📘 GET /me

- 概要: ログイン中のユーザーのプロフィール情報を取得する

- 認証: 必須（Bearer トークン）

- リクエストヘッダー

```
Authorization: Bearer <access_token>
```

- レスポンス:

```
{
  "id": 1,
  "email": "user@example.com",
  "username": "ユーザー名",
  "profileImage": "/images/profile.jpg"
}
```

- ステータスコード

  - 200 OK: 正常にプロフィールを取得

  - 401 Unauthorized: トークンが無効 or 不足

📘 GET /me/reviews

- 概要: ログイン中のユーザーが投稿したレビュー一覧を取得する（書籍タイトルも含む）

- 認証: 必須（Bearer トークン）

- リクエストヘッダー

```
Authorization: Bearer <access_token>
```

- レスポンス

```
[
  {
    "bookTitle": "本のタイトル",
    "rating": 4,
    "comment": "とても面白かったです",
    "created_at": "2024-06-01T10:30:00"
  },
  ...
]
```

- ステータスコード

  - 200 OK: レビュー一覧を正常に取得

  - 401 Unauthorized: トークンが無効 or 不足

📘 GET /{book_id}/reviews

- 概要: 特定の書籍に対するレビュー一覧を取得する

- 認証: 不要

- パスパラメータ

```
book_id（整数）：対象の本のID
```

- レスポンス

```
[
  {
    "user_name": "読者太郎",
    "rating": 4,
    "comment": "読み応えがありました",
    "created_at": "2024-06-01T10:00:00"
  },
  ...
]
```

- ステータスコード

  - 200 OK: 成功

📘 POST /{book_id}/reviews

- 概要: ログイン中のユーザーが特定の書籍にレビューを投稿する

- 認証: 必須（Bearer トークン）

\*パスパラメータ

```
book_id（整数）：レビュー対象の本ID
```

- リクエスト

```
{
  "rating": 5,
  "comment": "最高の一冊でした！"
}
```

- レスポンス

```
{
  "message": "レビューを投稿しました",
  "review": {
    "id": 12,
    "book_id": 3,
    "user_id": 5,
    "rating": 5,
    "comment": "最高の一冊でした！",
    "created_at": "2024-06-01T11:00:00"
  }
}
```

- ステータスコード

  - 201 Created

  - 401 Unauthorized: 未認証

  - 400 Bad Request: 無効なデータ

📘 DELETE /reviews/{review_id}

- 概要: 自分が投稿したレビューを削除する

- 認証: 必須（Bearer トークン）

- パスパラメータ

```
review_id（整数）：削除対象のレビューID
```

- レスポンス

```
{
  "message": "レビューを削除しました"
}
```

- ステータスコード

  - 200 OK: 削除成功

  - 403 Forbidden: 自分以外のレビュー

  - 404 Not Found: レビューが存在しない

📘 PUT /reviews/{review_id}

- 概要: 自分が投稿したレビューを編集する

- 認証: 必須（Bearer トークン）

- パスパラメータ

```
review_id（整数）：編集対象のレビューID
```

\*リクエスト

```
{
  "rating": 3,
  "comment": "後半が少し退屈だった"
}
```

- レスポンス

```
{
  "message": "レビューを編集しました",
  "review": {
    "id": 12,
    "book_id": 3,
    "user_id": 5,
    "rating": 3,
    "comment": "後半が少し退屈だった",
    "created_at": "2024-06-01T11:30:00"
  }
}
```

- ステータスコード

  - 200 OK: 更新成功

  - 403 Forbidden: 自分以外のレビュー

  - 404 Not Found: レビューが存在しない

📘 GET /books

- 概要: 登録されているすべての書籍情報を取得する

- 認証: 不要

- レスポンス

```
[
  {
    "id": 1,
    "title": "本のタイトル",
    "author": "著者名",
    "thumbnail_url": "/images/sample.jpg"
  },
  ...
]
```

- ステータスコード

  - 200 OK: 成功

📘 GET /books/{book_id}

- 概要: 指定した ID の本の詳細情報を取得する

- 認証: 不要

- パスパラメータ

```
book_id（整数）：対象の書籍ID
```

- レスポンス

```
{
  "id": 1,
  "title": "本のタイトル",
  "author": "著者名",
  "thumbnail_url": "/images/sample.jpg"
}
```

- ステータスコード

  - 200 OK: 成功

  - 404 Not Found: 本が見つからない

📘 POST /books

- 概要: 新しい本と、それに対するレビューを同時に登録する

- 認証: 必須（Bearer トークン）

- リクエスト

```
{
  "title": "新しい本のタイトル",
  "author": "著者名",
  "thumbnail_url": "/images/sample.jpg",
  "rating": 4,
  "comment": "読みやすくて面白かった"
}
```

- レスポンス

```
{
  "message": "新しい本とレビューを登録しました",
  "book": {
    "id": 2,
    "title": "新しい本のタイトル",
    "author": "著者名",
    "thumbnail_url": "/images/sample.jpg"
  },
  "review": {
    "id": 9,
    "book_id": 2,
    "user_id": 1,
    "rating": 4,
    "comment": "読みやすくて面白かった",
    "created_at": "2024-06-08T14:00:00"
  }
}
```

- ステータスコード

  - 201 Created: 登録成功

  - 401 Unauthorized: 認証トークンが無効または不足

  - 400 Bad Request: 入力に不備がある
