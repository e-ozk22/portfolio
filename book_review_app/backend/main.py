#アプリを動かすスイッチのページ
from fastapi import FastAPI #FastAPIという道具箱から「アプリを作るボタン(FastAPI)」を取り出す
from routers import auth, books, reviews, users #自分が作ったページごとの説明書を読み込む
from fastapi.middleware.cors import CORSMiddleware # CORS設定

#FastAPIをスタートさせてアプリの本体を作る
#この上に「このページはこんな動きをするよ」っていう部品をどんどん乗せていく感じ。
app = FastAPI() 

# ここでCORSを追加 localhost:3000と繋ぐよ！
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# FastAPIの全部のAPIに対して、どんなCORSルールで外部アクセスを許可するか
app.add_middleware(
    CORSMiddleware,               # CORSを管理するミドルウェアを追加するよ！
    allow_origins=origins,        # 上で指定したURLからのアクセスは許可！
    allow_credentials=True,       # 認証情報（Cookie、認証ヘッダー等）も一緒に許可する
    allow_methods=["*"],          # どんなHTTPメソッド（GET/POST/PUT/DELETE…）でもOK！
    allow_headers=["*"],          # どんなHTTPヘッダーでもOK
)

#各ページの説明書をアプリにくっつけるよという命令
app.include_router(auth.router)
app.include_router(books.router)
app.include_router(reviews.router)
app.include_router(users.router)
