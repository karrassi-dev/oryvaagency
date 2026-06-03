'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Building2, HeartPulse, Scale, Calculator } from 'lucide-react'
import { SectionHeader } from '@/components/shared/SectionHeader'

const industryData = [
  { icon: Building2, nameKey: 'realEstateName', descKey: 'realEstateDesc', tagKey: 'realEstateTag' },
  { icon: HeartPulse, nameKey: 'healthcareName', descKey: 'healthcareDesc', tagKey: 'healthcareTag' },
  { icon: Scale,      nameKey: 'legalName',      descKey: 'legalDesc',      tagKey: 'legalTag'      },
  { icon: Calculator, nameKey: 'accountingName', descKey: 'accountingDesc', tagKey: 'accountingTag' },
] as const

export function Industries() {
  const t = useTranslations('Industries')

  return (
    <section className="py-24 md:py-32 bg-zinc-950" aria-labelledby="industries-heading">
      <div className="max-w-6xl mx-auto px-6">
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

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {industryData.map((industry, i) => (
            <motion.div
              key={industry.nameKey}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
              className="group p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900 hover:border-indigo-500/30 transition-all duration-200 flex flex-col gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-zinc-800 group-hover:bg-indigo-500/10 border border-zinc-700 group-hover:border-indigo-500/20 flex items-center justify-center transition-all duration-200">
                <industry.icon className="w-5 h-5 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
              </div>
              <div>
                <h3 className="text-zinc-50 font-semibold mb-2">{t(industry.nameKey)}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{t(industry.descKey)}</p>
              </div>
              <span className="mt-auto inline-flex text-xs font-medium text-zinc-500 group-hover:text-indigo-400 transition-colors">
                {t(industry.tagKey)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
