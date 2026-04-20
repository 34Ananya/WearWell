# WearWell — Phase 2 Roadmap

## 1. Calendar & Wear History
- Outfit calendar: assign outfits to specific dates (monthly/weekly view)
- Wear history log: track every time an item or outfit was worn
- "Cost per wear" stat: original price ÷ wear count
- "What to wear today" prompt: suggest outfit based on the date and season

## 2. Image Intelligence
- Background removal on upload (remove.bg API or Replicate rembg model)
- Dominant color auto-detection from image (Colorthief.js or Python colorgram)
- Category suggestion using a vision model (Claude vision or CLIP)
- Duplicate detection: warn if a very similar item already exists

## 3. ML-Based Outfit Ranking
- Replace rule scoring with embedding similarity (sentence-transformers on item tags)
- Track recommendation acceptance/rejection to fine-tune weights
- Style profile: learn preferred palettes, silhouettes, and occasions per user
- Outfit completion score: grade an outfit on coordination before saving

## 4. Social & Inspiration
- Public shareable outfit page (public URL, no login needed to view)
- Opt-in community feed: browse outfits others have shared
- Copy outfit to your own wardrobe with one click
- Like / save inspiration outfits

## 5. Enhanced Wardrobe UX
- Drag-and-drop outfit builder (React DnD or dnd-kit)
- Bulk photo import (multiple images → auto-create items)
- Free-form tags in addition to preset categories
- Item condition tracking: new / good / worn / donate
- Packing list: select a trip and auto-suggest outfits

## 6. Integrations
- Weather API: recommend outfits based on today's forecast (Open-Meteo, free)
- Shopping links: attach a URL to re-purchase or find similar
- Laundry mode: mark items as in the wash → excluded from builder
- Google Calendar sync: pull events and dress accordingly

## 7. Mobile & Offline
- PWA (installable, cache-first) with camera access for quick photo upload
- Offline wardrobe browse via service worker + IndexedDB cache
- Native share target: share an image from the camera roll directly into WearWell

## 8. Admin & Analytics
- Usage dashboard for operators: DAU, items per user, most-used categories
- Abuse moderation for public shared outfits
- Email digest: "You haven't worn your navy coat in 30 days"
