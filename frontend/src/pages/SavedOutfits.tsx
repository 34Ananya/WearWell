import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import type { Outfit, ClothingItem } from '../types'
import { Layout } from '../components/Layout'

export default function SavedOutfits() {
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [itemMap, setItemMap] = useState<Record<string, ClothingItem>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Outfit[]>('/outfits/'),
      api.get<ClothingItem[]>('/clothing-items/'),
    ])
      .then(([outfitData, clothingItems]) => {
        setOutfits(outfitData)
        const m: Record<string, ClothingItem> = {}
        clothingItems.forEach(i => { m[i.id] = i })
        setItemMap(m)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this outfit?')) return
    await api.delete(`/outfits/${id}`)
    setOutfits(prev => prev.filter(o => o.id !== id))
  }

  return (
    <Layout>
      <div className="p-6 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl text-stone-900">Saved Outfits</h2>
            {!loading && (
              <p className="text-stone-400 text-sm mt-1">
                {outfits.length} outfit{outfits.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <Link
            to="/builder"
            className="bg-stone-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-stone-700 transition"
          >
            + New outfit
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-56 bg-stone-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : outfits.length === 0 ? (
          <div className="text-center py-24 text-stone-400 bg-white rounded-2xl border border-stone-100 shadow-sm">
            <p className="text-5xl mb-4">👔</p>
            <p className="font-medium text-stone-600">No saved outfits yet</p>
            <p className="text-sm mt-1 mb-6">Head to the Outfit Builder to create one</p>
            <Link
              to="/builder"
              className="bg-stone-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-700 transition"
            >
              Build an outfit
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outfits.map(outfit => {
              const outfitClothes = outfit.items
                .map(oi => itemMap[oi.clothing_item_id])
                .filter(Boolean)

              return (
                <div
                  key={outfit.id}
                  className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                >
                  {/* Image strip */}
                  <div className="h-32 flex bg-stone-50 overflow-hidden">
                    {outfitClothes.length > 0 ? (
                      outfitClothes.slice(0, 5).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex-1 overflow-hidden border-r border-stone-100 last:border-0"
                        >
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl bg-stone-100">
                              {item.category === 'top' ? '👕'
                                : item.category === 'bottom' ? '👖'
                                : item.category === 'footwear' ? '👟'
                                : item.category === 'outerwear' ? '🧥'
                                : '🧣'}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="w-full flex items-center justify-center text-4xl text-stone-200">
                        👔
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-stone-800 leading-tight">{outfit.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {outfit.occasion && (
                            <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-stone-100 text-stone-500 capitalize">
                              {outfit.occasion}
                            </span>
                          )}
                          <span className="text-xs text-stone-400">
                            {new Date(outfit.created_at).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(outfit.id)}
                        className="flex-shrink-0 text-stone-300 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50"
                        title="Delete outfit"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M1 3h12M5 3V1.5h4V3M2 3l1 9.5h8L12 3" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>

                    {/* Slot pills */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {outfit.items.map(oi => {
                        const clothingItem = itemMap[oi.clothing_item_id]
                        return (
                          <span
                            key={oi.id}
                            className="text-xs px-2 py-0.5 bg-stone-50 border border-stone-100 rounded-full text-stone-500"
                          >
                            <span className="capitalize text-stone-400">{oi.slot}:</span>{' '}
                            {clothingItem?.name ?? '—'}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
