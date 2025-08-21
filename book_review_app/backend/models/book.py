# 本のモデルを設定するページ


# SQLAlchemyで使うクラスをインポートしている
# Column：テーブルの列、Integer、String：列の型（数値、文字列）
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship


# Baseはテーブルの設計図書くときに必要なもの（親）
# BookクラスがテーブルですよとSQLAlchemyに伝える
# database.pyでBaseを定義しているのでそこからimport
from database import Base 

# Bookというクラス（設計図）を作る宣言をする
# Baseを継承することでSQLAlchemyでDBテーブルを作れる
class Book(Base):
    # テーブル名をbooksにする宣言
    __tablename__ = "books" 
    # primary_key=Trueは主となるキー、index=Trueは検索が早くなるようにインデックスをはる
    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    # nullable=Falseで必須項目にする
    title = Column(String(100), index=True, nullable=False)
    author = Column(String(100), index=True, nullable=False)
    thumbnail_url = Column(String(255))

    reviews = relationship("Review", back_populates="book")