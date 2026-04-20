-- =============================================================
-- WearWell — Supabase SQL Schema
-- Run this in your Supabase project's SQL editor
-- =============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------
-- clothing_items
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clothing_items (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    image_url   TEXT,
    category    TEXT NOT NULL CHECK (category IN ('top','bottom','footwear','outerwear','accessory')),
    color       TEXT,
    season      TEXT CHECK (season IN ('spring','summer','fall','winter','all')),
    occasion    TEXT CHECK (occasion IN ('casual','formal','sport','work','party')),
    notes       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS clothing_items_user_id_idx ON clothing_items(user_id);
CREATE INDEX IF NOT EXISTS clothing_items_category_idx ON clothing_items(category);

-- ---------------------------------------------------------------
-- outfits
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS outfits (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    occasion    TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS outfits_user_id_idx ON outfits(user_id);

-- ---------------------------------------------------------------
-- outfit_items  (junction: outfit ↔ clothing_item)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS outfit_items (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outfit_id         UUID NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
    clothing_item_id  UUID NOT NULL REFERENCES clothing_items(id) ON DELETE CASCADE,
    slot              TEXT NOT NULL CHECK (slot IN ('top','bottom','footwear','outerwear','accessory'))
);

CREATE INDEX IF NOT EXISTS outfit_items_outfit_id_idx ON outfit_items(outfit_id);

-- ---------------------------------------------------------------
-- Row-Level Security
-- ---------------------------------------------------------------
ALTER TABLE clothing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfits        ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_items   ENABLE ROW LEVEL SECURITY;

-- clothing_items: users see only their own
CREATE POLICY "clothing_items: owner access"
    ON clothing_items FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- outfits: users see only their own
CREATE POLICY "outfits: owner access"
    ON outfits FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- outfit_items: accessible when the parent outfit belongs to the user
CREATE POLICY "outfit_items: owner access via outfit"
    ON outfit_items FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM outfits
            WHERE outfits.id = outfit_items.outfit_id
              AND outfits.user_id = auth.uid()
        )
    );

-- ---------------------------------------------------------------
-- Storage bucket  (run separately or via Supabase dashboard)
-- ---------------------------------------------------------------
-- 1. Go to Storage → New bucket
--    Name: clothing-images
--    Public bucket: ON
--
-- 2. Run these policies:
--
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('clothing-images', 'clothing-images', TRUE)
-- ON CONFLICT DO NOTHING;
--
-- CREATE POLICY "Authenticated upload"
--     ON storage.objects FOR INSERT TO authenticated
--     WITH CHECK (bucket_id = 'clothing-images');
--
-- CREATE POLICY "Public read"
--     ON storage.objects FOR SELECT
--     USING (bucket_id = 'clothing-images');
--
-- CREATE POLICY "Owner delete"
--     ON storage.objects FOR DELETE TO authenticated
--     USING (bucket_id = 'clothing-images' AND auth.uid()::text = (storage.foldername(name))[1]);
