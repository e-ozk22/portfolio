from fastapi import APIRouter, Depends #FastAPIの道具箱から「APIの入り口」と「助っ人を呼ぶ機能」を取り出す
from fastapi.security import OAuth2PasswordBearer # トークン（カギ）のチェック方法を使う準備
from services.auth_service import get_user_by_token # トークンから「この人だよ！」っていう本人を調べる関数を使う
from database import get_db
from sqlalchemy.orm import Session
from models.review import Review
from models.book import Book

router = APIRouter(prefix="/users", tags=["Users"]) #このファイルのAPIは全部 /users で始まるURLになる
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login") # 「ログインしたときにもらったトークン」をどうやって取り出すか決める道具

@router.get("/me")
def get_my_page(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)): #この関数は「カギ（トークン）」を持ってる人しか呼べない
    user = get_user_by_token(token, db) #トークンから「この人は誰か？」を調べて、ユーザー情報を取り出す

    return {
        "id": user.id,
        "email": user.email,
        "username": user.user_name,         # ✅ ユーザー名を追加
        "profileImage": user.profile_image  # ✅ プロフィール画像を追加（キー名はフロントと揃える）
    }

@router.get("/me/reviews")
def get_my_reviews(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user = get_user_by_token(token, db)

    # 自分が書いたレビューを全て取得（本の情報も結合して取得）
    my_reviews = db.query(Review).join(Book).filter(Review.user_id == user.id).all()

    # 必要な情報だけを抜き出して返す
    result = []
    for review in my_reviews:
        result.append({
            "bookTitle": review.book.title,
            "rating": review.rating,
            "comment": review.comment,
            "created_at": review.created_at.isoformat()
        })

    return result