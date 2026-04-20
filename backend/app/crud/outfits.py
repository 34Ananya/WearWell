from sqlalchemy.orm import Session, joinedload
from typing import Optional, List
from app.models.outfit import Outfit, OutfitItem
from app.schemas.outfit import OutfitCreate


def create_outfit(db: Session, user_id: str, data: OutfitCreate) -> Outfit:
    outfit = Outfit(user_id=user_id, title=data.title, occasion=data.occasion)
    db.add(outfit)
    db.flush()  # get the id without committing

    for item_data in data.items:
        outfit_item = OutfitItem(
            outfit_id=outfit.id,
            clothing_item_id=item_data.clothing_item_id,
            slot=item_data.slot,
        )
        db.add(outfit_item)

    db.commit()
    db.refresh(outfit)
    return outfit


def get_outfits(db: Session, user_id: str) -> List[Outfit]:
    return (
        db.query(Outfit)
        .options(joinedload(Outfit.items))
        .filter(Outfit.user_id == user_id)
        .order_by(Outfit.created_at.desc())
        .all()
    )


def get_outfit(db: Session, outfit_id: str, user_id: str) -> Optional[Outfit]:
    return (
        db.query(Outfit)
        .options(joinedload(Outfit.items))
        .filter(Outfit.id == outfit_id, Outfit.user_id == user_id)
        .first()
    )


def delete_outfit(db: Session, outfit_id: str, user_id: str) -> bool:
    outfit = get_outfit(db, outfit_id, user_id)
    if not outfit:
        return False
    db.delete(outfit)
    db.commit()
    return True
