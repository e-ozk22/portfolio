from fastapi import APIRouter, Depends, HTTPException #FastAPIの中にある「ページを分けて管理できるAPIRouterを取り出して使う
from fastapi.security import OAuth2PasswordBearer
from services.auth_service import get_user_by_token
from schemas.book import NewBookWithReviewRequest, BookOut, BookSchema
from datetime import datetime
from sqlalchemy.orm import Session
from database import get_db  # DBセッションを取得する関数（場所に合わせて変えてね）
from models.book import Book
from models.review import Review


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

#これから書くAPIは本に関するものということを分かりやすくまとめておくためのグループの見出しを作っている
#このファイルにある全てのAPIのURLの頭に/booksをつけてねと命令している
#tagsはSwaggerUI用
router = APIRouter(prefix="/books", tags=["Books"])


#データベースに登録されている全ての本の情報を取ってくる
@router.get("", response_model=list[BookOut]) #この下に書く関数はGET /booksにアクセスした時に動くよ
def get_books(db: Session = Depends(get_db)): #GET /booksにアクセスされた時にこの関数が呼ばれる
    return db.query(Book).all() #booksのデータを返す

#特定のIDの本の情報を取ってくる
@router.get("/{book_id}", response_model=BookSchema)
def get_book_detail(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()  # DBから1件だけ取得
    if not book:
        raise HTTPException(status_code=404, detail="本が見つかりません")
    return book

#本とレビューを一緒に登録するAPI(まだ誰も登録していない本のレビューを投稿するので、本の情報＋レビューの投稿)
@router.post("")
def create_book_with_review(
    request: NewBookWithReviewRequest, #この型でリクエストしてね
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    # ログインしているユーザーを取得
    user = get_user_by_token(token, db)

    # 新しい本を作成してDBに追加
    new_book = Book(
        title=request.title,
        author=request.author,
        thumbnail_url=request.thumbnail_url
    )
    db.add(new_book)
    db.commit()
    db.refresh(new_book)  # new_book.id を取得するため

    # レビューも作成してDBに追加
    new_review = Review(
        book_id=new_book.id,
        user_id=user.id,
        rating=request.rating,
        comment=request.comment,
        created_at=datetime.utcnow()
    )
    db.add(new_review) #新しく作ったレビューをデータベースに追加する準備
    db.commit() #実際にDBに保存
    db.refresh(new_review) #DBに保存した後自動で付与されたIDなどの最新情報をnew_reviewに反映

    # フロントに返す
    return {
        "message": "新しい本とレビューを登録しました",
        "book": {
            "id": new_book.id,
            "title": new_book.title,
            "author": new_book.author,
            "thumbnail_url": new_book.thumbnail_url
        },
        "review": {
            "id": new_review.id,
            "book_id": new_review.book_id,
            "user_id": new_review.user_id,
            "rating": new_review.rating,
            "comment": new_review.comment,
            "created_at": new_review.created_at.isoformat()
        }
    }