'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useLocale } from 'next-intl'
import { usePathname, Link } from '@/i18n/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronDown, Check } from 'lucide-react'

const locales = [
  { code: 'en', flag: '🇺🇸', label: 'English',  short: 'EN' },
  { code: 'fr', flag: '🇫🇷', label: 'Français', short: 'FR' },
  { code: 'ar', flag: '🇲🇦', label: 'العربية',  short: 'AR' },
] as const

export function LanguageSwitcher() {
  const locale    = useLocale()
  const pathname  = usePathname()
  const [open, setOpen]     = useState(false)
  const [mounted, setMounted] = useState(false)
  const [pos, setPos]       = useState({ top: 0, right: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)
  const dropRef = useRef<HTMLUListElement>(null)

  const current = locales.find((l) => l.code === locale) ?? locales[0]

  useEffect(() => { setMounted(true) }, [])

  const handleToggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 6, right: window.innerWidth - rect.right })
    }
    setOpen((v) => !v)
  }

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        btnRef.current && !btnRef.current.contains(target) &&
        dropRef.current && !dropRef.current.contains(target)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Close on Escape or scroll
  useEffect(() => {
    if (!open) return
    const onKey    = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const onScroll = () => setOpen(false)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
    }
  }, [open])

  const dropdown = (
    <AnimatePresence>
      {open && (
        <motion.ul
          ref={dropRef}
          role="listbox"
          aria-label="Language options"
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.97 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          style={{ position: 'fixed', top: pos.top, right: pos.right }}
          className="min-w-[160px] bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl shadow-black/30 py-1.5 z-[9999]"
        >
          {locales.map(({ code, flag, label }) => (
            <li key={code} role="option" aria-selected={locale === code}>
              <Link
                href={pathname}
                locale={code}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 mx-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  locale === code
                    ? 'text-zinc-50 bg-zinc-800'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                }`}
              >
                <span className="text-base leading-none">{flag}</span>
                <span className="flex-1">{label}</span>
                {locale === code && (
                  <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                )}
              </Link>
            </li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  )

  return (
    <div aria-label="Select language">
      <button
        ref={btnRef}
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-all duration-150 text-sm font-medium"
      >
        <Globe className="w-4 h-4 shrink-0" />
        <span className="hidden md:inline leading-none">{current.label}</span>
        <span className="md:hidden leading-none">{current.short}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${open ? '-rotate-180' : ''}`}
        />
      </button>

      {mounted && createPortal(dropdown, document.body)}
    </div>
  )
}
