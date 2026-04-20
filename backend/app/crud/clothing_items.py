from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.clothing_item import ClothingItem
from app.schemas.clothing_item import ClothingItemCreate, ClothingItemUpdate


def create_clothing_item(db: Session, user_id: str, data: ClothingItemCreate) -> ClothingItem:
    item = ClothingItem(user_id=user_id, **data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def get_clothing_items(
    db: Session,
    user_id: str,
    category: Optional[str] = None,
    color: Optional[str] = None,
    season: Optional[str] = None,
    occasion: Optional[str] = None,
    search: Optional[str] = None,
) -> List[ClothingItem]:
    q = db.query(ClothingItem).filter(ClothingItem.user_id == user_id)
    if category:
        q = q.filter(ClothingItem.category == category)
    if color:
        q = q.filter(ClothingItem.color == color)
    if season:
        q = q.filter(ClothingItem.season == season)
    if occasion:
        q = q.filter(ClothingItem.occasion == occasion)
    if search:
        q = q.filter(ClothingItem.name.ilike(f"%{search}%"))
    return q.order_by(ClothingItem.created_at.desc()).all()


def get_clothing_item(db: Session, item_id: str, user_id: str) -> Optional[ClothingItem]:
    return db.query(ClothingItem).filter(
        ClothingItem.id == item_id, ClothingItem.user_id == user_id
    ).first()


def update_clothing_item(
    db: Session, item_id: str, user_id: str, data: ClothingItemUpdate
) -> Optional[ClothingItem]:
    item = get_clothing_item(db, item_id, user_id)
    if not item:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


def delete_clothing_item(db: Session, item_id: str, user_id: str) -> bool:
    item = get_clothing_item(db, item_id, user_id)
    if not item:
        return False
    db.delete(item)
    db.commit()
    return True
