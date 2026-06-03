'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Lightbulb, Map, Rocket, LineChart } from 'lucide-react'
import { SectionHeader } from '@/components/shared/SectionHeader'

const stepData = [
  { number: '01', icon: Lightbulb, titleKey: 'discoveryTitle', descKey: 'discoveryDesc' },
  { number: '02', icon: Map,       titleKey: 'strategyTitle',  descKey: 'strategyDesc'  },
  { number: '03', icon: Rocket,    titleKey: 'executionTitle', descKey: 'executionDesc' },
  { number: '04', icon: LineChart, titleKey: 'growthTitle',    descKey: 'growthDesc'    },
] as const

export function Process() {
  const t = useTranslations('Process')

  return (
    <section className="py-24 md:py-32 relative overflow-hidden" aria-labelledby="process-heading">
      <div aria-hidden className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent hidden lg:block" />

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

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {stepData.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
              className="relative flex flex-col gap-4"
            >
              {i < stepData.length - 1 && (
                <div aria-hidden className="hidden lg:block absolute top-5 left-[calc(50%+28px)] right-[-50%] h-px border-t border-dashed border-zinc-700 z-0" />
              )}

              <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                  <step.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-zinc-600 text-sm font-mono font-bold">{step.number}</span>
              </div>
              <div>
                <h3 className="text-zinc-50 font-semibold text-lg mb-2">{t(step.titleKey)}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{t(step.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
