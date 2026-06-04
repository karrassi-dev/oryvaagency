'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  const t = useTranslations('NotFound')

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden dot-grid">
      {/* Background glow */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #6366f1 0%, transparent 70%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 text-center px-6 max-w-lg mx-auto"
      >
        {/* 404 number */}
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-[9rem] md:text-[12rem] font-bold leading-none gradient-text select-none"
        >
          {t('code')}
        </motion.p>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-50 mt-2 mb-4 tracking-tight">
          {t('title')}
        </h1>

        {/* Description */}
        <p className="text-zinc-400 text-lg leading-relaxed mb-10">
          {t('description')}
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-indigo-600 text-white font-semibold text-base hover:bg-indigo-500 active:bg-indigo-700 transition-all duration-200 shadow-xl shadow-indigo-500/25 group"
        >
          <Home className="w-4 h-4" />
          {t('cta')}
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        </Link>
      </motion.div>
    </section>
  )
}
