# ユーザーのモデルを設定するページ

# ランダムな文字列（UUID）を作成するためのモジュール
import uuid
# SQLAlchemyで使うクラスをインポートしている
# カラム：テーブルの列、Integer,String：列の型（数値、文字列）、ForeignKey：他のテーブルと繋ぐためのもの
from sqlalchemy import Column, String, ForeignKey, DateTime
# CHAR：MySQLで文字列を固定長で保存する型
from sqlalchemy.dialects.mysql import CHAR

# Baseはテーブルの設計図書くときに必要なもの（親）
# UserクラスがテーブルですよとSQLAlchemyに伝える
# database.pyでBaseを定義しているのでそこからimport
from database import Base 
from datetime import datetime


# Userというクラス（設計図）を作る宣言をする
# Baseを継承することでSQLAlchemyでDBテーブルを作れる
class User(Base):
    # テーブル名をusersにする宣言
    __tablename__ = "users" 
    # primary_key=Trueは主となるキー、index=Trueは検索が早くなるようにインデックスをはる
    # default=lambda: str(uuid.uuid4()) デフォルト値でランダムなUUIDを自動生成
    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    # unique=Trueにすることで同じ名前を登録できないようにする
    user_name = Column(String(40), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    # ハッシュ化したパスワード用
    # ハッシュ化とは、入力されたパスワードから特殊な暗号のような文字列に変換すること
    password = Column(String(255), nullable=False) 
    # 作成日時
    profile_image = Column(String(500), nullable=True)   