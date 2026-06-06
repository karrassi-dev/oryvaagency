'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  currentPage: number
  totalPages: number
  totalPosts: number
  postsPerPage: number
  prevLabel: string
  nextLabel: string
}

export function BlogPagination({ currentPage, totalPages, totalPosts, postsPerPage, prevLabel, nextLabel }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const goTo = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page <= 1) {
      params.delete('page')
    } else {
      params.set('page', String(page))
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: true })
  }

  if (totalPages <= 1) return null

  const from = (currentPage - 1) * postsPerPage + 1
  const to = Math.min(currentPage * postsPerPage, totalPosts)

  // Build page list with ellipsis for large page counts
  const pages: (number | 'ellipsis')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('ellipsis')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('ellipsis')
    pages.push(totalPages)
  }

  return (
    <div className="mt-14 flex flex-col items-center gap-4">
      <p className="text-sm text-zinc-500">
        {from}–{to} / {totalPosts}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label={prevLabel}
        >
          <ChevronLeft className="w-4 h-4" />
          {prevLabel}
        </button>

        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`e${i}`} className="w-9 text-center text-zinc-600 select-none">…</span>
          ) : (
            <button
              key={p}
              onClick={() => goTo(p)}
              aria-current={p === currentPage ? 'page' : undefined}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                p === currentPage
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label={nextLabel}
        >
          {nextLabel}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
