'use client'

import { motion, type Variants } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Globe, Search, TrendingUp, Bot, ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/shared/SectionHeader'

const serviceData = [
  { icon: Globe,      href: '/services#web-development', color: 'from-blue-500/20 to-indigo-500/20',  iconColor: 'text-blue-400',   titleKey: 'webDevTitle', descKey: 'webDevDesc' },
  { icon: Search,     href: '/services#seo',             color: 'from-emerald-500/20 to-teal-500/20', iconColor: 'text-emerald-400', titleKey: 'seoTitle',    descKey: 'seoDesc'    },
  { icon: TrendingUp, href: '/services#marketing',       color: 'from-orange-500/20 to-amber-500/20', iconColor: 'text-orange-400',  titleKey: 'marketingTitle', descKey: 'marketingDesc' },
  { icon: Bot,        href: '/services#ai-automation',   color: 'from-purple-500/20 to-pink-500/20',  iconColor: 'text-purple-400',  titleKey: 'aiTitle',     descKey: 'aiDesc'     },
] as const

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const, delay: i * 0.08 },
  }),
}

export function ServicesOverview() {
  const t = useTranslations('ServicesOverview')

  return (
    <section className="py-24 md:py-32 bg-zinc-950" aria-labelledby="services-heading">
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

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {serviceData.map((service, i) => (
            <motion.article
              key={service.titleKey}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <Link
                href={service.href}
                className="group block h-full p-8 rounded-2xl bg-zinc-900 gradient-border-card"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6`}>
                  <service.icon className={`w-5 h-5 ${service.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-zinc-50 mb-3">{t(service.titleKey)}</h3>
                <p className="text-zinc-400 leading-relaxed mb-6">{t(service.descKey)}</p>
                <span className="inline-flex items-center gap-1.5 text-indigo-400 text-sm font-medium group-hover:gap-2.5 transition-all">
                  {t('learnMore')} <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
