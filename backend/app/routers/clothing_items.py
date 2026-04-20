from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.auth import get_current_user
from app import crud
from app.schemas.clothing_item import ClothingItemCreate, ClothingItemUpdate, ClothingItemOut

router = APIRouter()


@router.get("/", response_model=List[ClothingItemOut])
def list_clothing_items(
    category: Optional[str] = None,
    color: Optional[str] = None,
    season: Optional[str] = None,
    occasion: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    return crud.get_clothing_items(db, user_id, category, color, season, occasion, search)


@router.post("/", response_model=ClothingItemOut, status_code=status.HTTP_201_CREATED)
def create_clothing_item(
    data: ClothingItemCreate,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    return crud.create_clothing_item(db, user_id, data)


@router.get("/{item_id}", response_model=ClothingItemOut)
def get_clothing_item(
    item_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    item = crud.get_clothing_item(db, item_id, user_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.patch("/{item_id}", response_model=ClothingItemOut)
def update_clothing_item(
    item_id: str,
    data: ClothingItemUpdate,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    item = crud.update_clothing_item(db, item_id, user_id, data)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_clothing_item(
    item_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    deleted = crud.delete_clothing_item(db, item_id, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Item not found")
