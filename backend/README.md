# WearWell Backend

FastAPI + SQLAlchemy + Supabase Postgres

## Quick start

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # fill in your Supabase credentials
uvicorn app.main:app --reload --port 8000
```

API docs at http://localhost:8000/docs

## Environment variables

| Variable                   | Where to find it                                   |
|----------------------------|----------------------------------------------------|
| `DATABASE_URL`             | Supabase → Settings → Database → Connection string |
| `SUPABASE_URL`             | Supabase → Settings → API → Project URL            |
| `SUPABASE_ANON_KEY`        | Supabase → Settings → API → anon/public key        |
| `SUPABASE_SERVICE_ROLE_KEY`| Supabase → Settings → API → service_role key       |
| `SUPABASE_JWT_SECRET`      | Supabase → Settings → API → JWT Secret             |

## Endpoints

### Clothing Items
| Method | Path                    | Description              |
|--------|-------------------------|--------------------------|
| GET    | /clothing-items/        | List (supports filters)  |
| POST   | /clothing-items/        | Create                   |
| GET    | /clothing-items/{id}    | Get single item          |
| PATCH  | /clothing-items/{id}    | Update                   |
| DELETE | /clothing-items/{id}    | Delete                   |

Query params for GET /clothing-items/: `category`, `color`, `season`, `occasion`, `search`

### Outfits
| Method | Path              | Description   |
|--------|-------------------|---------------|
| GET    | /outfits/         | List outfits  |
| POST   | /outfits/         | Create outfit |
| GET    | /outfits/{id}     | Get outfit    |
| DELETE | /outfits/{id}     | Delete outfit |

### Recommendations
| Method | Path                    | Description                        |
|--------|-------------------------|------------------------------------|
| POST   | /recommendations/outfit | Get ranked item recs for an outfit |

Request body:
```json
{
  "selected_slots": { "top": "<item_id>", "bottom": "<item_id>" },
  "target_slot": "footwear"
}
```

## Project structure

```
app/
  main.py          — FastAPI app, CORS, router registration
  config.py        — Pydantic settings from .env
  database.py      — SQLAlchemy engine + session + Base
  auth.py          — JWT validation dependency
  models/          — SQLAlchemy ORM models
  schemas/         — Pydantic request/response models
  crud/            — Database operations
  routers/         — FastAPI route handlers
```
