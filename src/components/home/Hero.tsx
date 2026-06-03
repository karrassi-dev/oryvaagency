'use client'

import { motion, type Variants } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Sparkles } from 'lucide-react'

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

export function Hero() {
  const t = useTranslations('Hero')

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label') },
    { value: t('stat2Value'), label: t('stat2Label') },
    { value: t('stat3Value'), label: t('stat3Label') },
    { value: t('stat4Value'), label: t('stat4Label') },
  ]

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden dot-grid"
      aria-label="Hero"
    >
      {/* Background orbs */}
      <div
        aria-hidden
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #6366f1 0%, #4f46e5 30%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="absolute bottom-[5%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #a78bfa 0%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="absolute bottom-[10%] left-[-5%] w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #818cf8 0%, transparent 70%)' }}
      />

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24 text-center"
      >
        {/* Badge */}
        <motion.div variants={item} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/8 text-indigo-300 text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            {t('badge')}
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={item}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-zinc-50 leading-[0.95] mb-6"
        >
          {t('line1')}
          <br />
          <span className="gradient-text">{t('line2')}</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={item}
          className="max-w-xl mx-auto text-lg md:text-xl text-zinc-400 leading-relaxed mb-10"
        >
          {t('sub')}
        </motion.p>

        {/* CTAs */}
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-indigo-600 text-white font-semibold text-base hover:bg-indigo-500 active:bg-indigo-700 transition-all duration-200 shadow-xl shadow-indigo-500/25 group"
          >
            {t('cta1')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border border-zinc-700 text-zinc-300 font-semibold text-base hover:border-zinc-500 hover:text-zinc-100 hover:bg-zinc-800/50 transition-all duration-200"
          >
            {t('cta2')}
          </Link>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          variants={item}
          className="mt-16 pt-12 border-t border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-8"
        >
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-3xl font-bold text-zinc-50 tracking-tight">{value}</span>
              <span className="text-sm text-zinc-500">{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
