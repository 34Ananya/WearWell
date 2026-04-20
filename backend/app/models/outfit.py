import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


class Outfit(Base):
    __tablename__ = "outfits"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    occasion = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    items = relationship("OutfitItem", back_populates="outfit", cascade="all, delete-orphan")


class OutfitItem(Base):
    __tablename__ = "outfit_items"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    outfit_id = Column(String, ForeignKey("outfits.id", ondelete="CASCADE"), nullable=False)
    clothing_item_id = Column(String, ForeignKey("clothing_items.id", ondelete="CASCADE"), nullable=False)
    slot = Column(String(50), nullable=False)  # top, bottom, footwear, outerwear, accessory

    outfit = relationship("Outfit", back_populates="items")
