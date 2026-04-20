import { useEffect, useState, useCallback } from 'react'
import { api } from '../api/client'
import type { ClothingItem, Category, SlotMap, RecommendationResponse } from '../types'
import { Layout } from '../components/Layout'
import { ClothingCard } from '../components/ClothingCard'
import { CATEGORIES, SEASONS, OCCASIONS } from '../components/AddEditItemModal'

const SLOTS: { key: Category; label: string; emoji: string }[] = [
  { key: 'top',       label: 'Top',       emoji: '👕' },
  { key: 'bottom',    label: 'Bottom',    emoji: '👖' },
  { key: 'footwear',  label: 'Footwear',  emoji: '👟' },
  { key: 'outerwear', label: 'Outerwear', emoji: '🧥' },
  { key: 'accessory', label: 'Accessory', emoji: '🧣' },
]

export default function OutfitBuilder() {
  const [items, setItems] = useState<ClothingItem[]>([])
  const [slotMap, setSlotMap] = useState<SlotMap>({})
  const [activeSlot, setActiveSlot] = useState<Category | null>(null)
  const [filterCat, setFilterCat] = useState<Category | ''>('')
  const [title, setTitle] = useState('')
  const [occasion, setOccasion] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState(false)
  const [recs, setRecs] = useState<RecommendationResponse[]>([])
  const [loadingRecs, setLoadingRecs] = useState(false)
  const [showRecs, setShowRecs] = useState(false)

  useEffect(() => {
    api.get<ClothingItem[]>('/clothing-items/').then(setItems)
  }, [])

  const fetchRecs = useCallback(async () => {
    const filledSlots = Object.entries(slotMap).reduce<Record<string, string>>(
      (acc, [slot, item]) => { acc[slot] = item.id; return acc }, {}
    )
    if (Object.keys(filledSlots).length === 0) return
    setLoadingRecs(true)
    try {
      const data = await api.post<RecommendationResponse[]>('/recommendations/outfit', {
        selected_slots: filledSlots,
      })
      setRecs(data)
      setShowRecs(true)
    } finally {
      setLoadingRecs(false)
    }
  }, [slotMap])

  const displayItems = items.filter(item => {
    if (activeSlot) return item.category === activeSlot
    if (filterCat)  return item.category === filterCat
    return true
  })

  const assignItem = (item: ClothingItem) => {
    setSlotMap(prev => ({ ...prev, [item.category]: item }))
    setActiveSlot(null)
    setShowRecs(false)
  }

  const removeSlot = (slot: Category) => {
    setSlotMap(prev => { const n = { ...prev }; delete n[slot]; return n })
    setShowRecs(false)
  }

  const handleSave = async () => {
    if (!title.trim()) { alert('Give your outfit a title'); return }
    const outfitItems = Object.entries(slotMap).map(([slot, item]) => ({
      clothing_item_id: item.id,
      slot,
    }))
    if (outfitItems.length === 0) { alert('Add at least one item to your outfit'); return }
    setSaving(true)
    try {
      await api.post('/outfits/', { title, occasion: occasion || null, items: outfitItems })
      setSavedMsg(true)
      setTimeout(() => {
        setSlotMap({})
        setTitle('')
        setOccasion('')
        setSavedMsg(false)
        setRecs([])
        setShowRecs(false)
      }, 2000)
    } finally {
      setSaving(false)
    }
  }

  const filledCount = Object.keys(slotMap).length

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row min-h-full">

        {/* ── Left: Wardrobe Picker ── */}
        <div className="flex-1 border-b lg:border-b-0 lg:border-r border-stone-100 flex flex-col min-w-0">
          <div className="p-5 border-b border-stone-100">
            <h2 className="font-display text-2xl text-stone-900">Outfit Builder</h2>
            {activeSlot ? (
              <p className="text-sm text-sage-600 font-medium mt-0.5">
                Picking a <span className="capitalize font-semibold">{activeSlot}</span> — click any item below
                <button
                  onClick={() => setActiveSlot(null)}
                  className="ml-2 text-stone-400 hover:text-stone-600 text-xs"
                >(cancel)</button>
              </p>
            ) : (
              <p className="text-sm text-stone-400 mt-0.5">
                Click a slot on the right, then pick an item
              </p>
            )}
          </div>

          {/* Category filter tabs */}
          <div className="flex gap-2 flex-wrap px-5 py-3 border-b border-stone-100">
            <button
              onClick={() => setFilterCat('')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition
                ${!filterCat && !activeSlot ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
            >All</button>
            {SLOTS.map(s => (
              <button
                key={s.key}
                onClick={() => { setFilterCat(s.key); setActiveSlot(null) }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition
                  ${filterCat === s.key && !activeSlot ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
              >
                {s.emoji} {s.label}
              </button>
            ))}
          </div>

          {/* Item grid */}
          <div className="flex-1 overflow-auto p-5">
            {displayItems.length === 0 ? (
              <div className="text-center py-16 text-stone-400">
                <p className="text-3xl mb-3">
                  {activeSlot
                    ? SLOTS.find(s => s.key === activeSlot)?.emoji
                    : '👗'}
                </p>
                <p className="text-sm">No items in this category</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {displayItems.map(item => (
                  <ClothingCard
                    key={item.id}
                    item={item}
                    compact
                    onClick={() => assignItem(item)}
                    selected={Object.values(slotMap).some(s => s.id === item.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Outfit Panel ── */}
        <div className="w-full lg:w-80 flex-shrink-0 bg-stone-50 flex flex-col">
          <div className="p-5 border-b border-stone-100">
            <h3 className="font-display text-xl text-stone-900">
              Your Outfit
              {filledCount > 0 && (
                <span className="ml-2 text-sm text-stone-400 font-sans font-normal">
                  {filledCount} item{filledCount > 1 ? 's' : ''}
                </span>
              )}
            </h3>
          </div>

          {/* Slots */}
          <div className="flex-1 overflow-auto p-5 space-y-2">
            {SLOTS.map(({ key, label, emoji }) => {
              const slotItem = slotMap[key]
              const isActive = activeSlot === key
              return (
                <div
                  key={key}
                  onClick={() => setActiveSlot(isActive ? null : key)}
                  className={`rounded-2xl border-2 p-3 cursor-pointer transition-all
                    ${isActive
                      ? 'border-sage-600 bg-sage-100 shadow-sm'
                      : slotItem
                        ? 'border-stone-200 bg-white hover:border-stone-300'
                        : 'border-dashed border-stone-200 bg-white hover:border-stone-300'
                    }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-stone-700">
                      {emoji} {label}
                    </span>
                    {slotItem && (
                      <button
                        onClick={e => { e.stopPropagation(); removeSlot(key) }}
                        className="text-stone-300 hover:text-red-500 transition text-base leading-none"
                        title="Remove"
                      >×</button>
                    )}
                  </div>
                  {slotItem ? (
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {slotItem.image_url
                          ? <img src={slotItem.image_url} className="w-full h-full object-cover" alt="" />
                          : <span className="text-base">{emoji}</span>
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-stone-700 truncate">{slotItem.name}</p>
                        {slotItem.color && (
                          <p className="text-xs text-stone-400 capitalize">{slotItem.color}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-stone-400 italic">
                      {isActive ? 'Pick from wardrobe →' : 'Tap to select'}
                    </p>
                  )}
                </div>
              )
            })}

            {/* Recommendations */}
            {filledCount >= 1 && (
              <div className="pt-2">
                <button
                  onClick={fetchRecs}
                  disabled={loadingRecs}
                  className="w-full py-2.5 border border-stone-200 rounded-xl text-xs font-medium text-stone-600 hover:bg-white transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loadingRecs ? (
                    <span>Finding suggestions…</span>
                  ) : (
                    <><span>✦</span> Get smart suggestions</>
                  )}
                </button>

                {showRecs && recs.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {recs.map(rec => (
                      rec.candidates.length > 0 && (
                        <div key={rec.slot}>
                          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 capitalize">
                            {rec.slot} suggestions
                          </p>
                          <div className="space-y-1.5">
                            {rec.candidates.slice(0, 3).map(({ item, reasons }) => (
                              <div
                                key={item.id}
                                onClick={() => assignItem(item)}
                                className="flex items-center gap-2 p-2 bg-white rounded-xl border border-stone-100 cursor-pointer hover:border-sage-400 transition group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0">
                                  {item.image_url
                                    ? <img src={item.image_url} className="w-full h-full object-cover" alt="" />
                                    : <span className="w-full h-full flex items-center justify-center text-sm">👗</span>
                                  }
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-medium text-stone-700 truncate">{item.name}</p>
                                  <p className="text-xs text-stone-400 truncate">{reasons[0]}</p>
                                </div>
                                <span className="text-xs text-sage-600 opacity-0 group-hover:opacity-100 transition">+</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Save panel */}
          <div className="p-5 border-t border-stone-100 space-y-3">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Outfit title *"
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 bg-white"
            />
            <select
              value={occasion}
              onChange={e => setOccasion(e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 bg-white"
            >
              <option value="">Occasion (optional)</option>
              {OCCASIONS.map(o => <option key={o} value={o} className="capitalize">{o}</option>)}
            </select>
            <button
              onClick={handleSave}
              disabled={saving || filledCount === 0}
              className={`w-full py-3 rounded-xl text-sm font-medium transition
                ${savedMsg
                  ? 'bg-sage-600 text-white'
                  : 'bg-stone-900 text-white hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
            >
              {savedMsg ? '✓ Outfit saved!' : saving ? 'Saving…' : 'Save outfit'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
