from pydantic import BaseModel
from typing import Optional
from datetime import datetime


VALID_CATEGORIES = {"top", "bottom", "footwear", "outerwear", "accessory"}
VALID_SEASONS = {"spring", "summer", "fall", "winter", "all"}
VALID_OCCASIONS = {"casual", "formal", "sport", "work", "party"}


class ClothingItemCreate(BaseModel):
    name: str
    image_url: Optional[str] = None
    category: str
    color: Optional[str] = None
    season: Optional[str] = None
    occasion: Optional[str] = None
    notes: Optional[str] = None


class ClothingItemUpdate(BaseModel):
    name: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    color: Optional[str] = None
    season: Optional[str] = None
    occasion: Optional[str] = None
    notes: Optional[str] = None


class ClothingItemOut(BaseModel):
    id: str
    user_id: str
    name: str
    image_url: Optional[str]
    category: str
    color: Optional[str]
    season: Optional[str]
    occasion: Optional[str]
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
