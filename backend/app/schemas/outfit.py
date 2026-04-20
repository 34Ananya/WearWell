from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.clothing_item import ClothingItemOut


class OutfitItemCreate(BaseModel):
    clothing_item_id: str
    slot: str


class OutfitCreate(BaseModel):
    title: str
    occasion: Optional[str] = None
    items: List[OutfitItemCreate]


class OutfitItemOut(BaseModel):
    id: str
    outfit_id: str
    clothing_item_id: str
    slot: str

    class Config:
        from_attributes = True


class OutfitItemDetailOut(BaseModel):
    id: str
    outfit_id: str
    slot: str
    clothing_item: Optional[ClothingItemOut] = None

    class Config:
        from_attributes = True


class OutfitOut(BaseModel):
    id: str
    user_id: str
    title: str
    occasion: Optional[str]
    created_at: datetime
    items: List[OutfitItemOut] = []

    class Config:
        from_attributes = True
