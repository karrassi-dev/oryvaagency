'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useCallback } from 'react'

type Props = {
  categories: string[]
  searchPlaceholder: string
  allLabel: string
}

export function BlogFilters({ categories, searchPlaceholder, allLabel }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const q = searchParams.get('q') ?? ''
  const category = searchParams.get('category') ?? ''

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const displayCategories = categories[0] === 'All' ? categories : [allLabel, ...categories]

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
        <input
          type="search"
          value={q}
          onChange={(e) => update('q', e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-11 pr-10 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all"
        />
        {q && (
          <button
            onClick={() => update('q', '')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {displayCategories.map((cat) => {
          const value = cat === allLabel || cat === 'All' ? '' : cat
          const active = category === value
          return (
            <button
              key={cat}
              onClick={() => update('category', value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-700'
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>
    </div>
  )
}
