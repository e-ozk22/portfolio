from fastapi import APIRouter, Depends, HTTPException
from services.auth_service import get_user_by_token
from fastapi.security import OAuth2PasswordBearer
from schemas.review import ReviewRequest
from datetime import datetime
from sqlalchemy.orm import Session
from models.review import Review
from models.user import User
from database import get_db


router = APIRouter(prefix="/books", tags=["Reviews"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


@router.get("/{book_id}/reviews")
def get_reviews_for_book(book_id: int, db: Session = Depends(get_db)): #URLにくっついてきた「本のID」をbook_idとして受け取る
    #その本のレビューだけを取り出す
    book_reviews = db.query(Review).filter(Review.book_id == book_id).all() #たくさんある本の中から「その本に対するレビュー」だけを取り出す

    #ユーザー名をくっつける
    enriched_reviews = [] #表示されるレビューを入れる空箱用意
    for review in book_reviews:
        user = db.query(User).filter(User.id == review.user_id).first() #レビューを書いた人を探して名前をくっつける
        enriched_reviews.append({
            "user_name" : user.user_name if user else "不明", #表示させるリスト作成
            "rating" : review.rating,
            "comment" : review.comment,
            "created_at" : review.created_at.isoformat() if review.created_at else None
        })

    return enriched_reviews #みんなのレビューを全部まとめてフロントに返す

#登録済みの本に対するレビュー投稿API
@router.post("/{book_id}/reviews") #投稿する時の入口
def post_reviews(
    book_id: int,
    request: ReviewRequest,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
): #レビュー投稿APIの引数を指定→「どの本に、どんなレビューを、誰が書いたか」を受け取って、DBに保存するための準備

    user = get_user_by_token(token, db)

    new_review = Review(
        book_id=book_id,
        user_id=user.id,
        rating=request.rating,
        comment=request.comment,
        created_at=datetime.utcnow()
    )

    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return {
        "message": "レビューを投稿しました",
        "review": {
            "id": new_review.id,
            "book_id": new_review.book_id,
            "user_id": new_review.user_id,
            "rating": new_review.rating,
            "comment": new_review.comment,
            "created_at": new_review.created_at.isoformat() if new_review.created_at else None
        }, 
        "user": {
            "id": user.id,
            "name": user.user_name
        }
    }

#自分のレビューを削除するAPI
@router.delete("/reviews/{review_id}")
def delete_review(
    review_id: int,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
   
    user = get_user_by_token(token, db)

    # 該当のレビューを探す（自分のレビュー限定）
    review_to_delete = db.query(Review).filter(Review.id == review_id).first()

    # レビューが存在しない
    if not review_to_delete:
        raise HTTPException(status_code=404, detail="レビューが見つかりません")
    
    # 自分のレビューじゃない場合
    if review_to_delete.user_id != user.id:
        raise HTTPException(status_code=403, detail="自分のレビューしか削除できません")

    # 該当レビューをリストから削除
    db.delete(review_to_delete)
    db.commit()

    return {"message": "レビューを削除しました"}

#自分のレビューを編集するAPI
@router.put("/reviews/{review_id}")
def update_review(
    review_id: int,
    request: ReviewRequest,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    user = get_user_by_token(token, db)


    # そのレビューが存在するか確認
    review_to_update = db.query(Review).filter(Review.id == review_id).first()
    if not review_to_update:
        raise HTTPException(status_code=404, detail="レビューが見つかりません")

    # 自分のレビューかどうか確認
    if review_to_update.user_id != user.id:
        raise HTTPException(status_code=403, detail="自分のレビューしか編集できません")

    # レビューを更新する
    review_to_update.rating = request.rating
    review_to_update.comment = request.comment
    db.commit()
    db.refresh(review_to_update)


    return {
        "message": "レビューを編集しました",
        "review": {
            "id": review_to_update.id,
            "book_id": review_to_update.book_id,
            "user_id": review_to_update.user_id,
            "rating": review_to_update.rating,
            "comment": review_to_update.comment,
            "created_at": review_to_update.created_at.isoformat() if review_to_update.created_at else None
        }
    }