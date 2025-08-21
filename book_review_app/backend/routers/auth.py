from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from schemas.user import LoginRequest
from services.auth_service import authenticate_user, create_access_token, get_user_by_token
from database import get_db

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(request.email, request.password, db)
    if not user:
        raise HTTPException(status_code=401, detail="メールアドレスまたはパスワードが間違っています")
    token = create_access_token(user.id)
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me")
def read_my_page(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user = get_user_by_token(token, db)
    return {
        "message": f"{user.user_name}さん、ようこそマイページへ!",
        "email": user.email,
        "user_id": user.id
    }