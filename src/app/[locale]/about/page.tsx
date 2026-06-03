import type { Metadata } from 'next'
import { Target, Eye, Heart, Zap } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { buildMetadata, siteConfig } from '@/lib/metadata'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Metadata' })
  const base = siteConfig.url
  const path = '/about'

  return buildMetadata({
    title: t('aboutTitle'),
    description: t('aboutDescription'),
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

const valueIcons = [Target, Eye, Heart, Zap]
const valueTitleKeys = ['resultsTitle', 'transparencyTitle', 'partnershipTitle', 'speedTitle'] as const
const valueDescKeys = ['resultsDesc', 'transparencyDesc', 'partnershipDesc', 'speedDesc'] as const

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'AboutPage' })

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label') },
    { value: t('stat2Value'), label: t('stat2Label') },
    { value: t('stat3Value'), label: t('stat3Label') },
    { value: t('stat4Value'), label: t('stat4Label') },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden dot-grid" aria-label="About hero">
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
            {t('heroTitle1')}
            <br />
            <span className="gradient-text">{t('heroTitle2')}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-400 text-lg leading-relaxed">
            {t('heroDesc')}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-20" aria-labelledby="story-heading">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 id="story-heading" className="text-2xl md:text-3xl font-bold text-zinc-50 mb-6">
                {t('storyTitle')}
              </h2>
              <div className="space-y-4 text-zinc-400 leading-relaxed">
                <p>{t('storyP1')}</p>
                <p>{t('storyP2')}</p>
                <p>{t('storyP3')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map(({ value, label }) => (
                <div key={label} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 text-center">
                  <div className="text-4xl font-bold text-zinc-50 mb-2 gradient-text">{value}</div>
                  <div className="text-zinc-400 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-20 section-glow relative overflow-hidden" aria-labelledby="mission-heading">
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto p-10 rounded-3xl border border-zinc-800 bg-zinc-900/50">
            <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4">
              {t('missionLabel')}
            </p>
            <h2 id="mission-heading" className="text-2xl md:text-4xl font-bold text-zinc-50 leading-tight">
              {t('missionQuote')}
            </h2>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20" aria-labelledby="values-heading">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="inline-flex items-center gap-2 text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4">
              <span className="w-5 h-px bg-indigo-500" />
              {t('valuesLabel')}
              <span className="w-5 h-px bg-indigo-500" />
            </p>
            <h2 id="values-heading" className="text-3xl md:text-4xl font-bold text-zinc-50">
              {t('valuesTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {valueIcons.map((Icon, i) => (
              <div
                key={valueTitleKeys[i]}
                className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-zinc-50 font-semibold text-lg mb-3">{t(valueTitleKeys[i])}</h3>
                <p className="text-zinc-400 leading-relaxed">{t(valueDescKeys[i])}</p>
              </div>
            ))}
          </div>
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
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-5">{t('ctaTitle')}</h2>
          <p className="text-zinc-400 text-lg mb-8">{t('ctaDesc')}</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors shadow-xl shadow-indigo-500/25"
          >
            {t('ctaButton')}
          </Link>
        </div>
      </section>
    </>
  )
}
