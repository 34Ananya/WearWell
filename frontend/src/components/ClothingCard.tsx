import type { ClothingItem } from '../types'

interface Props {
  item: ClothingItem
  onClick?: () => void
  selected?: boolean
  onDelete?: () => void
  onEdit?: () => void
  compact?: boolean
}

const CATEGORY_PILL: Record<string, string> = {
  top:       'bg-sky-100 text-sky-700',
  bottom:    'bg-violet-100 text-violet-700',
  footwear:  'bg-amber-100 text-amber-700',
  outerwear: 'bg-teal-100 text-teal-700',
  accessory: 'bg-rose-100 text-rose-700',
}

export function ClothingCard({ item, onClick, selected, onDelete, onEdit, compact }: Props) {
  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm border-2 transition-all
        ${onClick ? 'cursor-pointer' : ''}
        ${selected
          ? 'border-sage-600 ring-2 ring-sage-200 shadow-md'
          : 'border-stone-100 hover:border-stone-200 hover:shadow-md'
        }`}
    >
      {/* Image */}
      <div className={`bg-stone-100 overflow-hidden flex items-center justify-center ${compact ? 'h-28' : 'h-44'}`}>
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-4xl text-stone-300 select-none">
            {item.category === 'top' ? '👕'
              : item.category === 'bottom' ? '👖'
              : item.category === 'footwear' ? '👟'
              : item.category === 'outerwear' ? '🧥'
              : '🧣'}
          </span>
        )}
      </div>

      {/* Body */}
      <div className={compact ? 'p-2.5' : 'p-3.5'}>
        <p className={`font-medium text-stone-800 truncate ${compact ? 'text-xs' : 'text-sm'}`}>
          {item.name}
        </p>
        <div className="flex flex-wrap gap-1 mt-1.5">
          <span className={`inline-block px-1.5 py-0.5 rounded-full text-xs font-medium ${CATEGORY_PILL[item.category] || 'bg-stone-100 text-stone-600'}`}>
            {item.category}
          </span>
          {item.color && (
            <span className="inline-block px-1.5 py-0.5 rounded-full text-xs bg-stone-100 text-stone-500">
              {item.color}
            </span>
          )}
          {!compact && item.season && (
            <span className="inline-block px-1.5 py-0.5 rounded-full text-xs bg-stone-100 text-stone-500">
              {item.season}
            </span>
          )}
          {!compact && item.occasion && (
            <span className="inline-block px-1.5 py-0.5 rounded-full text-xs bg-stone-100 text-stone-500">
              {item.occasion}
            </span>
          )}
        </div>
      </div>

      {/* Action buttons — visible on hover */}
      {(onDelete || onEdit) && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={e => { e.stopPropagation(); onEdit() }}
              className="w-7 h-7 bg-white text-stone-600 rounded-full shadow text-xs flex items-center justify-center hover:bg-stone-100 border border-stone-100"
              title="Edit"
            >
              ✎
            </button>
          )}
          {onDelete && (
            <button
              onClick={e => { e.stopPropagation(); onDelete() }}
              className="w-7 h-7 bg-red-500 text-white rounded-full shadow text-xs flex items-center justify-center hover:bg-red-600"
              title="Delete"
            >
              ×
            </button>
          )}
        </div>
      )}

      {/* Selected checkmark */}
      {selected && (
        <div className="absolute top-2 left-2 w-5 h-5 bg-sage-600 text-white rounded-full text-xs flex items-center justify-center shadow">
          ✓
        </div>
      )}
    </div>
  )
}
