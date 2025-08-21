from jose import jwt, JWTError
from fastapi import HTTPException
from datetime import datetime
from core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_DELTA
from models.user import User  # Userモデルをインポート
from sqlalchemy.orm import Session

def authenticate_user(email: str, password: str, db: Session):
    user = db.query(User).filter(User.email == email).first()
    if user and user.password == password:
        return user
    return None

def create_access_token(user_id: int):
    token_data = {
        "sub": str(user_id),
        "exp": datetime.utcnow() + ACCESS_TOKEN_EXPIRE_DELTA
    }
    return jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

def get_user_by_token(token: str, db: Session):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
    except (JWTError, ValueError):
        raise HTTPException(status_code=401, detail="無効なトークンです")

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="ユーザーが見つかりません")
    
    return user