'use client'

import { useEffect, useState } from 'react'

type Heading = { id: string; text: string; level: number }

type Props = {
  headings: Heading[]
  title: string
}

export function TableOfContents({ headings, title }: Props) {
  const [active, setActive] = useState('')

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        }
      },
      { rootMargin: '-20% 0% -70% 0%', threshold: 0 }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav aria-label="Table of contents" className="sticky top-24">
      <p className="text-zinc-300 font-semibold text-sm mb-4 uppercase tracking-wider">
        {title}
      </p>
      <ul className="space-y-1">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`block text-sm py-1 transition-colors leading-snug ${
                level === 3 ? 'pl-4' : ''
              } ${
                active === id
                  ? 'text-indigo-400 font-medium'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
