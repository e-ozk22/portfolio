# レビューのモデルを設定するページ

# SQLAlchemyで使うクラスをインポートしている
# カラム：テーブルの列、Integer,String：列の型（数値、文字列）、ForeignKey：他のテーブルと繋ぐためのもの
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.dialects.mysql import CHAR
from models.book import Book
from sqlalchemy.orm import relationship



# Baseはテーブルの設計図書くときに必要なもの（親）
# ReviewクラスがテーブルですよとSQLAlchemyに伝える
# database.pyでBaseを定義しているのでそこからimport
from database import Base 
from datetime import datetime

# Reviewというクラス（設計図）を作る宣言をする
# Baseを継承することでSQLAlchemyでDBテーブルを作れる
class Review(Base):
    # テーブル名をreviewsにする宣言
    __tablename__ = "reviews" 
    # primary_key=Trueは主となるキー、index=Trueは検索が早くなるようにインデックスをはる
    id = Column(Integer, primary_key=True, index=True) 
    # どの本へのレビューかを表すbooks_id。booksテーブルのid列と繋げる
    book_id = Column(Integer, ForeignKey("books.id"), index=True)
    # 誰が書いたレビューかを表す
    user_id = Column(CHAR(36), ForeignKey("users.id"),index=True)
    # 本の評価（１〜５、整数で）
    rating = Column(Integer)
    comment = Column(String(400))
    created_at = Column(DateTime, default=datetime.utcnow) 
   
    book = relationship("Book")  # ✅ 本の詳細も一緒に取り出せるように
