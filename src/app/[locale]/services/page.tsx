import type { Metadata } from 'next'
import { Globe, Search, TrendingUp, Bot, CheckCircle } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { buildMetadata, siteConfig } from '@/lib/metadata'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Metadata' })
  const base = siteConfig.url
  const path = '/services'

  return buildMetadata({
    title: t('servicesTitle'),
    description: t('servicesDescription'),
    alternates: {
      canonical: `${base}${path}`,
      languages: {
        'en': `${base}${path}`,
        'fr': `${base}/fr${path}`,
        'ar': `${base}/ar${path}`,
        'x-default': `${base}${path}`,
      },
    },
  })
}

type ServiceDef = {
  id: string
  icon: React.ElementType
  color: string
  borderColor: string
  iconBg: string
  iconColor: string
  titleKey: string
  taglineKey: string
  descKey: string
  featureKeys: string[]
}

const services: ServiceDef[] = [
  {
    id: 'web-development',
    icon: Globe,
    color: 'from-blue-500/15 to-indigo-500/15',
    borderColor: 'border-blue-500/20',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
    titleKey: 'webDevTitle',
    taglineKey: 'webDevTagline',
    descKey: 'webDevDesc',
    featureKeys: ['webDevF1','webDevF2','webDevF3','webDevF4','webDevF5','webDevF6','webDevF7','webDevF8'],
  },
  {
    id: 'seo',
    icon: Search,
    color: 'from-emerald-500/15 to-teal-500/15',
    borderColor: 'border-emerald-500/20',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    titleKey: 'seoTitle',
    taglineKey: 'seoTagline',
    descKey: 'seoDesc',
    featureKeys: ['seoF1','seoF2','seoF3','seoF4','seoF5','seoF6','seoF7','seoF8'],
  },
  {
    id: 'marketing',
    icon: TrendingUp,
    color: 'from-orange-500/15 to-amber-500/15',
    borderColor: 'border-orange-500/20',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-400',
    titleKey: 'marketingTitle',
    taglineKey: 'marketingTagline',
    descKey: 'marketingDesc',
    featureKeys: ['marketingF1','marketingF2','marketingF3','marketingF4','marketingF5','marketingF6','marketingF7','marketingF8'],
  },
  {
    id: 'ai-automation',
    icon: Bot,
    color: 'from-purple-500/15 to-pink-500/15',
    borderColor: 'border-purple-500/20',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
    titleKey: 'aiTitle',
    taglineKey: 'aiTagline',
    descKey: 'aiDesc',
    featureKeys: ['aiF1','aiF2','aiF3','aiF4','aiF5','aiF6','aiF7','aiF8'],
  },
]

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ServicesPage' })

  return (
    <>
      {/* Page Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden dot-grid" aria-label="Services hero">
        <div
          aria-hidden
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #6366f1 0%, transparent 70%)' }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <p className="inline-flex items-center gap-2 text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-5">
            <span className="w-5 h-px bg-indigo-500" />
            {t('heroLabel')}
            <span className="w-5 h-px bg-indigo-500" />
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-50 mb-6">
            {t('heroTitle')} <span className="gradient-text">{t('heroTitleHighlight')}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-400 text-lg leading-relaxed">
            {t('heroDesc')}
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24" aria-label="Service details">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          {services.map((service, i) => (
            <article
              key={service.id}
              id={service.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                i % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className={`w-12 h-12 rounded-xl ${service.iconBg} border ${service.borderColor} flex items-center justify-center mb-6`}>
                  <service.icon className={`w-6 h-6 ${service.iconColor}`} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-zinc-50 mb-2">{t(service.titleKey)}</h2>
                <p className="text-indigo-400 font-medium mb-4">{t(service.taglineKey)}</p>
                <p className="text-zinc-400 leading-relaxed mb-8">{t(service.descKey)}</p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
                >
                  {t('getStarted', { title: t(service.titleKey) })}
                </Link>
              </div>

              <div className={`p-8 rounded-2xl bg-gradient-to-br ${service.color} border ${service.borderColor} ${i % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <p className="text-zinc-300 font-semibold text-sm uppercase tracking-wider mb-6">{t('included')}</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.featureKeys.map((key) => (
                    <li key={key} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${service.iconColor}`} />
                      {t(key)}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 100%, rgba(99,102,241,0.12) 0%, transparent 100%)' }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-5">{t('notSureTitle')}</h2>
          <p className="text-zinc-400 text-lg mb-8">{t('notSureDesc')}</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors shadow-xl shadow-indigo-500/25"
          >
            {t('notSureCta')}
          </Link>
        </div>
      </section>
    </>
  )
}
