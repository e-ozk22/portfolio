from pydantic import BaseModel
from typing import Optional

class NewBookWithReviewRequest(BaseModel):
    title: str
    author: str
    thumbnail_url: Optional[str]
    rating: int
    comment: str

class BookOut(BaseModel):
    id: int
    title: str
    author: str
    thumbnail_url: Optional[str] #NoneもOK

    class Config:
        orm_mode = True


class BookSchema(BaseModel):
    id: int
    title: str
    author: str
    thumbnail_url: str | None = None  # 画像がないときもあるかも

    class Config:
        orm_mode = True
