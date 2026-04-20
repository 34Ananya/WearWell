import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import type { ClothingItem, Outfit } from '../types'
import { Layout } from '../components/Layout'
import { useAuth } from '../context/AuthContext'

const CATEGORY_COLORS: Record<string, string> = {
  top:       'bg-sky-400',
  bottom:    'bg-violet-400',
  footwear:  'bg-amber-400',
  outerwear: 'bg-teal-400',
  accessory: 'bg-rose-400',
}

export default function Dashboard() {
  const { user } = useAuth()
  const [items, setItems] = useState<ClothingItem[]>([])
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<ClothingItem[]>('/clothing-items/'),
      api.get<Outfit[]>('/outfits/'),
    ])
      .then(([i, o]) => { setItems(i); setOutfits(o) })
      .finally(() => setLoading(false))
  }, [])

  const categoryCount = items.reduce<Record<string, number>>((acc, i) => {
    acc[i.category] = (acc[i.category] ?? 0) + 1
    return acc
  }, {})

  const recentItems = items.slice(0, 4)

  return (
    <Layout>
      <div className="p-6 md:p-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="font-display text-3xl text-stone-900">
            {getGreeting()}&nbsp;👋
          </h2>
          <p className="text-stone-400 text-sm mt-1">{user?.email}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-stone-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total items', value: items.length, icon: '◈' },
                { label: 'Saved outfits', value: outfits.length, icon: '◎' },
                { label: 'Categories', value: Object.keys(categoryCount).length, icon: '⊞' },
                { label: 'Latest item', value: items[0]?.name?.slice(0, 10) || '—', icon: '✦' },
              ].map(s => (
                <div
                  key={s.label}
                  className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-stone-300 text-xl mb-2">{s.icon}</div>
                  <p className="text-2xl font-display text-stone-800 leading-none">{s.value}</p>
                  <p className="text-xs text-stone-400 font-medium mt-1.5 uppercase tracking-wide">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Category breakdown */}
              {items.length > 0 && (
                <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
                  <h3 className="font-medium text-stone-700 text-sm mb-4">Wardrobe breakdown</h3>
                  <div className="space-y-3">
                    {Object.entries(categoryCount)
                      .sort(([, a], [, b]) => b - a)
                      .map(([cat, count]) => (
                        <div key={cat} className="flex items-center gap-3">
                          <span className="text-sm w-20 capitalize text-stone-600 flex-shrink-0">
                            {cat}
                          </span>
                          <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${CATEGORY_COLORS[cat] || 'bg-stone-400'}`}
                              style={{ width: `${(count / items.length) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-stone-400 w-4 text-right flex-shrink-0">
                            {count}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Recent additions */}
              {recentItems.length > 0 && (
                <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
                  <h3 className="font-medium text-stone-700 text-sm mb-4">Recent additions</h3>
                  <div className="space-y-3">
                    {recentItems.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {item.image_url
                            ? <img src={item.image_url} className="w-full h-full object-cover" alt="" />
                            : <span className="text-lg">👗</span>
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-stone-700 truncate">{item.name}</p>
                          <p className="text-xs text-stone-400 capitalize">{item.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Empty state CTA */}
            {items.length === 0 && (
              <div className="text-center bg-white rounded-2xl border border-stone-100 p-12 shadow-sm mb-6">
                <p className="text-5xl mb-4">👗</p>
                <h3 className="font-display text-xl text-stone-800 mb-2">Start building your wardrobe</h3>
                <p className="text-stone-400 text-sm mb-6">Upload your clothes and start creating outfits</p>
                <Link
                  to="/wardrobe"
                  className="bg-stone-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-700 transition"
                >
                  Add your first item
                </Link>
              </div>
            )}

            {/* Quick links */}
            {items.length > 0 && (
              <div className="flex gap-3 flex-wrap mt-6">
                <Link
                  to="/wardrobe"
                  className="bg-stone-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-700 transition"
                >
                  Browse wardrobe
                </Link>
                <Link
                  to="/builder"
                  className="bg-sage-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-sage-700 transition"
                >
                  Build an outfit
                </Link>
                <Link
                  to="/outfits"
                  className="border border-stone-200 text-stone-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-50 transition"
                >
                  View saved outfits
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}
