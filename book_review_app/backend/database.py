from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os #追記しました
from dotenv import load_dotenv

# .env を読み込む
load_dotenv() #追記しました

# 接続情報を .env から取得
DATABASE_URL = os.getenv("DATABASE_URL") #追記しました

# SQLAlchemy エンジン・セッション作成
engine = create_engine(DATABASE_URL) #追記しました
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False) #追記しました

Base = declarative_base()

# DBセッションを取得する関数（FastAPIで使用）データベースの操作をするAPI全てに記述が必要な関数を作っている
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
