import { useEffect, useState, useCallback } from 'react'
import { api } from '../api/client'
import type { ClothingItem, Category, Season, Occasion } from '../types'
import { Layout } from '../components/Layout'
import { ClothingCard } from '../components/ClothingCard'
import { AddEditItemModal } from '../components/AddEditItemModal'
import { CATEGORIES, SEASONS, OCCASIONS } from '../components/AddEditItemModal'

interface Filters {
  category: string
  season: string
  occasion: string
  search: string
}

export default function Wardrobe() {
  const [items, setItems] = useState<ClothingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({ category: '', season: '', occasion: '', search: '' })
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ClothingItem | null>(null)

  const fetchItems = useCallback(async () => {
    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (filters.season)   params.set('season', filters.season)
    if (filters.occasion) params.set('occasion', filters.occasion)
    if (filters.search)   params.set('search', filters.search)
    return api.get<ClothingItem[]>(`/clothing-items/?${params}`)
  }, [filters])

  useEffect(() => {
    setLoading(true)
    fetchItems()
      .then(setItems)
      .finally(() => setLoading(false))
  }, [fetchItems])

  const handleSaved = (item: ClothingItem) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === item.id)
      return exists
        ? prev.map(i => (i.id === item.id ? item : i))
        : [item, ...prev]
    })
    setEditing(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item? It will also be removed from any outfits.')) return
    await api.delete(`/clothing-items/${id}`)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const openAdd = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (item: ClothingItem) => { setEditing(item); setModalOpen(true) }

  const activeFilterCount = [filters.category, filters.season, filters.occasion, filters.search]
    .filter(Boolean).length

  return (
    <Layout>
      <div className="flex flex-col md:flex-row min-h-full">
        {/* Filter sidebar */}
        <aside className="w-full md:w-56 bg-white border-b md:border-b-0 md:border-r border-stone-100 flex-shrink-0">
          <div className="p-4 md:p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Filters</h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => setFilters({ category: '', season: '', occasion: '', search: '' })}
                  className="text-xs text-sage-600 hover:underline"
                >
                  Clear {activeFilterCount}
                </button>
              )}
            </div>

            {/* Search */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                placeholder="Item name…"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
            </div>

            {/* Category filter */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">Category</label>
              <div className="flex flex-wrap gap-1.5 md:flex-col md:gap-1">
                {(['', ...CATEGORIES] as (Category | '')[]).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilters(f => ({ ...f, category: cat }))}
                    className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition capitalize text-left
                      ${filters.category === cat
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
                  >
                    {cat || 'All'}
                  </button>
                ))}
              </div>
            </div>

            {/* Season filter */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">Season</label>
              <select
                value={filters.season}
                onChange={e => setFilters(f => ({ ...f, season: e.target.value }))}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sage-400"
              >
                <option value="">All seasons</option>
                {SEASONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>

            {/* Occasion filter */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">Occasion</label>
              <select
                value={filters.occasion}
                onChange={e => setFilters(f => ({ ...f, occasion: e.target.value }))}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sage-400"
              >
                <option value="">All occasions</option>
                {OCCASIONS.map(o => <option key={o} value={o} className="capitalize">{o}</option>)}
              </select>
            </div>
          </div>
        </aside>

        {/* Main grid */}
        <div className="flex-1 p-6 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl text-stone-900">
              My Wardrobe
              <span className="text-stone-400 text-lg ml-2">({items.length})</span>
            </h2>
            <button
              onClick={openAdd}
              className="bg-stone-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-stone-700 transition flex items-center gap-1.5"
            >
              <span>+</span> Add item
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-56 bg-stone-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-24 text-stone-400">
              <p className="text-5xl mb-4">👗</p>
              <p className="font-medium text-stone-600">
                {activeFilterCount > 0 ? 'No items match your filters' : 'Your wardrobe is empty'}
              </p>
              <p className="text-sm mt-1">
                {activeFilterCount > 0
                  ? 'Try clearing some filters'
                  : 'Add your first clothing item to get started'}
              </p>
              {activeFilterCount === 0 && (
                <button
                  onClick={openAdd}
                  className="mt-4 bg-stone-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-700 transition"
                >
                  Add item
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map(item => (
                <ClothingCard
                  key={item.id}
                  item={item}
                  onEdit={() => openEdit(item)}
                  onDelete={() => handleDelete(item.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddEditItemModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        onSaved={handleSaved}
        editing={editing}
      />
    </Layout>
  )
}
