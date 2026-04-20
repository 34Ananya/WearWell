from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.auth import get_current_user
from app import crud
from app.schemas.outfit import OutfitCreate, OutfitOut

router = APIRouter()


@router.get("/", response_model=List[OutfitOut])
def list_outfits(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    return crud.get_outfits(db, user_id)


@router.post("/", response_model=OutfitOut, status_code=status.HTTP_201_CREATED)
def create_outfit(
    data: OutfitCreate,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    return crud.create_outfit(db, user_id, data)


@router.get("/{outfit_id}", response_model=OutfitOut)
def get_outfit(
    outfit_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    outfit = crud.get_outfit(db, outfit_id, user_id)
    if not outfit:
        raise HTTPException(status_code=404, detail="Outfit not found")
    return outfit


@router.delete("/{outfit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_outfit(
    outfit_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    deleted = crud.delete_outfit(db, outfit_id, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Outfit not found")
