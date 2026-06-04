'use client'

import { useState } from 'react'
import { Share2, Link2, Check } from 'lucide-react'

type Props = {
  url: string
  title: string
  shareLabel: string
  copiedLabel: string
}

export function ShareButtons({ url, title, shareLabel, copiedLabel }: Props) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: do nothing
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-zinc-500 text-sm font-medium">{shareLabel}</span>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X (Twitter)"
        className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 transition-colors"
      >
        <span className="text-sm font-bold leading-none px-0.5">𝕏</span>
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 transition-colors"
      >
        <Share2 className="w-4 h-4" />
      </a>
      <button
        onClick={handleCopy}
        aria-label="Copy link"
        className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 transition-colors"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Link2 className="w-4 h-4" />}
        {copied && <span className="sr-only">{copiedLabel}</span>}
      </button>
    </div>
  )
}
