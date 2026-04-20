from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import clothing_items, outfits, recommendations
from app.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="WearWell API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clothing_items.router, prefix="/clothing-items", tags=["clothing-items"])
app.include_router(outfits.router, prefix="/outfits", tags=["outfits"])
app.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])


@app.get("/health")
def health_check():
    return {"status": "ok"}
