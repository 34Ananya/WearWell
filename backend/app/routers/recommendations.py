from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
from app.database import get_db
from app.auth import get_current_user
from app.models.clothing_item import ClothingItem
from app.schemas.recommendation import RecommendationRequest, RecommendationResponse, RecommendedItem
from app.schemas.clothing_item import ClothingItemOut

router = APIRouter()

# Simple complementary color groups — items in same group get a bonus
COLOR_GROUPS = [
    {"black", "white", "gray", "grey"},
    {"navy", "blue", "light blue"},
    {"red", "pink", "maroon", "burgundy"},
    {"green", "olive", "khaki"},
    {"brown", "tan", "beige", "cream"},
    {"yellow", "orange", "mustard"},
    {"purple", "lavender", "violet"},
]

NEUTRAL_COLORS = {"black", "white", "gray", "grey", "beige", "cream", "tan"}

ALL_SLOTS = ["top", "bottom", "footwear", "outerwear", "accessory"]


def _color_group(color: str) -> int:
    """Return the index of the color group, or -1 if not found."""
    if not color:
        return -1
    c = color.lower()
    for i, group in enumerate(COLOR_GROUPS):
        if c in group:
            return i
    return -1


def score_item(
    candidate: ClothingItem,
    selected_items: List[ClothingItem],
    selected_slots: Dict[str, str],
) -> tuple[float, List[str]]:
    """
    Deterministic scoring:
    +2  same season as majority of selected items
    +2  same occasion as majority of selected items
    +1  complementary or neutral color match
    -10 duplicate category already filled
    """
    score = 0.0
    reasons = []

    selected_seasons = [i.season for i in selected_items if i.season]
    selected_occasions = [i.occasion for i in selected_items if i.occasion]
    selected_categories = {i.category for i in selected_items}

    # Penalize duplicate category
    if candidate.category in selected_categories:
        score -= 10
        reasons.append(f"Duplicate category ({candidate.category})")

    # Season preference
    if selected_seasons:
        dominant_season = max(set(selected_seasons), key=selected_seasons.count)
        if candidate.season == dominant_season or candidate.season == "all":
            score += 2
            reasons.append(f"Matches season ({candidate.season})")

    # Occasion preference
    if selected_occasions:
        dominant_occasion = max(set(selected_occasions), key=selected_occasions.count)
        if candidate.occasion == dominant_occasion:
            score += 2
            reasons.append(f"Matches occasion ({candidate.occasion})")

    # Color harmony
    if candidate.color:
        cand_color = candidate.color.lower()
        if cand_color in NEUTRAL_COLORS:
            score += 1
            reasons.append("Neutral color — versatile match")
        else:
            cand_group = _color_group(cand_color)
            for item in selected_items:
                if item.color and _color_group(item.color.lower()) == cand_group and cand_group != -1:
                    score += 1
                    reasons.append(f"Complementary color match ({item.color})")
                    break

    return score, reasons


@router.post("/outfit", response_model=List[RecommendationResponse])
def recommend_for_outfit(
    payload: RecommendationRequest,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    # Resolve selected items from their IDs
    selected_item_map: Dict[str, ClothingItem] = {}
    for slot, item_id in payload.selected_slots.items():
        item = db.query(ClothingItem).filter(
            ClothingItem.id == item_id, ClothingItem.user_id == user_id
        ).first()
        if item:
            selected_item_map[slot] = item

    selected_items = list(selected_item_map.values())

    # Determine which slots to recommend for
    filled_slots = set(payload.selected_slots.keys())
    if payload.target_slot:
        empty_slots = [payload.target_slot]
    else:
        empty_slots = [s for s in ALL_SLOTS if s not in filled_slots]

    if not empty_slots:
        raise HTTPException(status_code=400, detail="All slots already filled")

    # Fetch all user clothing items
    all_items = db.query(ClothingItem).filter(ClothingItem.user_id == user_id).all()

    results: List[RecommendationResponse] = []

    for slot in empty_slots:
        candidates = [item for item in all_items if item.category == slot]
        scored = []
        for candidate in candidates:
            score, reasons = score_item(candidate, selected_items, payload.selected_slots)
            if score > -5:  # filter out clearly wrong items
                scored.append(RecommendedItem(
                    item=ClothingItemOut.model_validate(candidate),
                    score=score,
                    reasons=reasons if reasons else ["Available option"],
                ))
        scored.sort(key=lambda x: x.score, reverse=True)
        results.append(RecommendationResponse(slot=slot, candidates=scored[:6]))

    return results
