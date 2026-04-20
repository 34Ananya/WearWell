# WearWell Frontend

React + Vite + TypeScript + Tailwind CSS + Supabase Auth

## Quick start

```bash
cd frontend
npm install
cp .env.example .env    # fill in Supabase URL + anon key
npm run dev             # http://localhost:5173
```

## Supabase setup (one-time)

1. Create a project at https://supabase.com
2. Run `../schema.sql` in **SQL Editor**
3. Go to **Storage → New bucket**
   - Name: `clothing-images`
   - Toggle **Public bucket** ON
4. Copy your **Project URL** and **anon public key** into `.env`

## Environment variables

| Variable              | Where to find it                          |
|-----------------------|-------------------------------------------|
| `VITE_SUPABASE_URL`   | Supabase → Settings → API → Project URL   |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon key  |
| `VITE_API_URL`        | URL where the FastAPI backend is running  |

## Project structure

```
src/
  api/
    client.ts          — Auth-aware fetch wrapper (api.get/post/patch/delete)
  components/
    AddEditItemModal.tsx — Shared form for create / edit clothing items
    ClothingCard.tsx     — Item card with image, tags, hover actions
    Layout.tsx           — Sidebar nav + main content shell
    ProtectedRoute.tsx   — Redirects unauthenticated users to /login
  context/
    AuthContext.tsx      — Supabase session state, useAuth() hook
  lib/
    supabase.ts          — Supabase client singleton
  pages/
    Login.tsx            — Sign-in form
    Signup.tsx           — Registration form with email confirmation handling
    Dashboard.tsx        — Stats overview + recent items
    Wardrobe.tsx         — Filterable clothing grid + add/edit/delete
    OutfitBuilder.tsx    — Slot-based outfit composer + smart suggestions
    SavedOutfits.tsx     — Outfit cards with image strip + delete
  types/
    index.ts             — Shared TypeScript interfaces
```

## Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```
