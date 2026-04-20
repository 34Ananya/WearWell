from pydantic import BaseModel
from typing import Optional, List, Dict
from app.schemas.clothing_item import ClothingItemOut


class RecommendationRequest(BaseModel):
    # slot -> clothing_item_id for already selected items
    selected_slots: Dict[str, str] = {}
    # Which slot are we recommending for? If None, return recs for all empty slots.
    target_slot: Optional[str] = None


class RecommendedItem(BaseModel):
    item: ClothingItemOut
    score: float
    reasons: List[str]


class RecommendationResponse(BaseModel):
    slot: str
    candidates: List[RecommendedItem]
