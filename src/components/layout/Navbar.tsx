'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Navbar() {
  const t = useTranslations('Navbar')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { label: t('services'), href: '/services' as const },
    { label: t('about'),    href: '/about'    as const },
    { label: t('blog'),     href: '/blog'     as const },
    { label: t('contact'),  href: '/contact'  as const },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header
      dir="ltr"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" aria-label="Oryva home">
          <img
            src="/images/website/logo-website.png"
            alt="Oryva"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="text-zinc-50 font-semibold text-lg tracking-tight">Oryva</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'text-zinc-50 bg-zinc-800'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop right: language switcher + CTA */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/contact"
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
          >
            {t('cta')}
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden overflow-hidden border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? 'text-zinc-50 bg-zinc-800'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05, duration: 0.2 }}
                className="mt-2 pt-2 border-t border-zinc-800 flex flex-col gap-3"
              >
                <LanguageSwitcher />
                <Link
                  href="/contact"
                  className="block w-full text-center px-5 py-3 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors"
                >
                  {t('cta')}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
