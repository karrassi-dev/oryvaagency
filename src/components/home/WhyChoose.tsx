'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Target, BarChart3, Layers, MessageSquare, Zap, Shield } from 'lucide-react'
import { SectionHeader } from '@/components/shared/SectionHeader'

const reasonData = [
  { icon: Target,       titleKey: 'resultsTitle',     descKey: 'resultsDesc'     },
  { icon: BarChart3,    titleKey: 'dataTitle',        descKey: 'dataDesc'        },
  { icon: Layers,       titleKey: 'fullStackTitle',   descKey: 'fullStackDesc'   },
  { icon: MessageSquare,titleKey: 'transparentTitle', descKey: 'transparentDesc' },
  { icon: Zap,          titleKey: 'fastTitle',        descKey: 'fastDesc'        },
  { icon: Shield,       titleKey: 'partnershipTitle', descKey: 'partnershipDesc' },
] as const

export function WhyChoose() {
  const t = useTranslations('WhyChoose')

  return (
    <section className="py-24 md:py-32 section-glow relative overflow-hidden" aria-labelledby="why-heading">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            label={t('label')}
            title={t('title')}
            description={t('description')}
          />
        </motion.div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasonData.map((reason, i) => (
            <motion.div
              key={reason.titleKey}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: 'easeOut' }}
              className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                <reason.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-zinc-50 font-semibold mb-2">{t(reason.titleKey)}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{t(reason.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
