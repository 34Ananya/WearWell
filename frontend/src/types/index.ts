export type Category = 'top' | 'bottom' | 'footwear' | 'outerwear' | 'accessory'
export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'all'
export type Occasion = 'casual' | 'formal' | 'sport' | 'work' | 'party'

export interface ClothingItem {
  id: string
  user_id: string
  name: string
  image_url: string | null
  category: Category
  color: string | null
  season: Season | null
  occasion: Occasion | null
  notes: string | null
  created_at: string
}

export interface OutfitItem {
  id: string
  outfit_id: string
  clothing_item_id: string
  slot: string
}

export interface Outfit {
  id: string
  user_id: string
  title: string
  occasion: string | null
  created_at: string
  items: OutfitItem[]
}

export type SlotMap = Partial<Record<Category, ClothingItem>>

export interface RecommendedItem {
  item: ClothingItem
  score: number
  reasons: string[]
}

export interface RecommendationResponse {
  slot: string
  candidates: RecommendedItem[]
}
