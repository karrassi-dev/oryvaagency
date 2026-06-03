'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Calendar } from 'lucide-react'

export function CTA() {
  const t = useTranslations('CTA')

  return (
    <section className="py-24 md:py-32 relative overflow-hidden" aria-label="Call to action">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(99,102,241,0.15) 0%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="inline-flex items-center gap-2 text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-6">
            <span className="w-5 h-px bg-indigo-500" />
            {t('label')}
            <span className="w-5 h-px bg-indigo-500" />
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-50 mb-6 leading-tight">
            {t('title')}
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-10">
            {t('description')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-indigo-600 text-white font-semibold text-base hover:bg-indigo-500 transition-all duration-200 shadow-2xl shadow-indigo-500/30 group"
            >
              <Calendar className="w-4 h-4" />
              {t('cta1')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-zinc-700 text-zinc-300 font-semibold text-base hover:border-zinc-500 hover:text-zinc-100 transition-all duration-200"
            >
              {t('cta2')}
            </Link>
          </div>

          <p className="mt-8 text-zinc-600 text-sm">{t('note')}</p>
        </motion.div>
      </div>
    </section>
  )
}
