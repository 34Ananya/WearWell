import uuid
from sqlalchemy import Column, String, Text, DateTime, func
from app.database import Base


class ClothingItem(Base):
    __tablename__ = "clothing_items"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    image_url = Column(Text)
    category = Column(String(50), nullable=False)  # top, bottom, footwear, outerwear, accessory
    color = Column(String(50))
    season = Column(String(50))    # spring, summer, fall, winter, all
    occasion = Column(String(50))  # casual, formal, sport, work, party
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
