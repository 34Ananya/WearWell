import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import type { ClothingItem, Category, Season, Occasion } from '../types'

export const CATEGORIES: Category[] = ['top', 'bottom', 'footwear', 'outerwear', 'accessory']
export const SEASONS: Season[] = ['spring', 'summer', 'fall', 'winter', 'all']
export const OCCASIONS: Occasion[] = ['casual', 'formal', 'sport', 'work', 'party']

export interface ItemFormData {
  name: string
  category: Category
  color: string
  season: Season | ''
  occasion: Occasion | ''
  notes: string
}

export const DEFAULT_FORM: ItemFormData = {
  name: '',
  category: 'top',
  color: '',
  season: '',
  occasion: '',
  notes: '',
}

interface Props {
  open: boolean
  onClose: () => void
  onSaved: (item: ClothingItem) => void
  editing?: ClothingItem | null
}

export function AddEditItemModal({ open, onClose, onSaved, editing }: Props) {
  const { user } = useAuth()
  const [form, setForm] = useState<ItemFormData>(DEFAULT_FORM)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        category: editing.category,
        color: editing.color || '',
        season: editing.season || '',
        occasion: editing.occasion || '',
        notes: editing.notes || '',
      })
      setImagePreview(editing.image_url || null)
    } else {
      setForm(DEFAULT_FORM)
      setImagePreview(null)
    }
    setImageFile(null)
    setError('')
  }, [editing, open])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${user!.id}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('clothing-images').upload(path, file)
    if (error) { setError('Image upload failed: ' + error.message); return null }
    return supabase.storage.from('clothing-images').getPublicUrl(path).data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      let image_url = editing?.image_url ?? null
      if (imageFile) {
        image_url = await uploadImage(imageFile)
        if (!image_url) { setSaving(false); return }
      }

      const payload = {
        ...form,
        image_url,
        season: form.season || null,
        occasion: form.occasion || null,
        color: form.color || null,
        notes: form.notes || null,
      }

      const saved = editing
        ? await api.patch<ClothingItem>(`/clothing-items/${editing.id}`, payload)
        : await api.post<ClothingItem>('/clothing-items/', payload)

      onSaved(saved)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="font-display text-2xl mb-6">
          {editing ? 'Edit item' : 'Add clothing item'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Name *</label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              placeholder="e.g. White Oxford Shirt"
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
          </div>

          {/* Category + Color */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))}
                required
                className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sage-400"
              >
                {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Color</label>
              <input
                value={form.color}
                onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                placeholder="e.g. navy, black"
                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
            </div>
          </div>

          {/* Season + Occasion */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Season</label>
              <select
                value={form.season}
                onChange={e => setForm(f => ({ ...f, season: e.target.value as Season | '' }))}
                className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sage-400"
              >
                <option value="">None</option>
                {SEASONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Occasion</label>
              <select
                value={form.occasion}
                onChange={e => setForm(f => ({ ...f, occasion: e.target.value as Occasion | '' }))}
                className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sage-400"
              >
                <option value="">None</option>
                {OCCASIONS.map(o => <option key={o} value={o} className="capitalize">{o}</option>)}
              </select>
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Photo</label>
            {imagePreview && (
              <div className="mb-2 w-20 h-20 rounded-xl overflow-hidden border border-stone-200">
                <img src={imagePreview} className="w-full h-full object-cover" alt="preview" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-stone-100 file:text-stone-700 file:text-sm file:font-medium hover:file:bg-stone-200 cursor-pointer"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={2}
              placeholder="Optional notes about fit, care, etc."
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 resize-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-stone-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-stone-700 transition disabled:opacity-50"
            >
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Add item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
