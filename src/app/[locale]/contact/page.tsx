import type { Metadata } from 'next'
import { Mail, Clock, MessageCircle } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ContactForm } from '@/components/contact/ContactForm'
import { buildMetadata, siteConfig } from '@/lib/metadata'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Metadata' })
  const base = siteConfig.url
  const path = '/contact'

  return buildMetadata({
    title: t('contactTitle'),
    description: t('contactDescription'),
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

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ContactPage' })

  const whyPoints = [
    t('whyP1'), t('whyP2'), t('whyP3'), t('whyP4'), t('whyP5'),
  ]

  const contactDetails = [
    { icon: Mail,          label: t('detailEmailLabel'),    value: 'hello@oryva.agency', href: 'mailto:hello@oryva.agency' as string | undefined },
    { icon: Clock,         label: t('detailResponseLabel'), value: t('detailResponseValue'), href: undefined as string | undefined },
    { icon: MessageCircle, label: t('detailConsultLabel'),  value: t('detailConsultValue'),  href: undefined as string | undefined },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden dot-grid" aria-label="Contact hero">
        <div
          aria-hidden
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[250px] opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #6366f1 0%, transparent 70%)' }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <p className="inline-flex items-center gap-2 text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-5">
            <span className="w-5 h-px bg-indigo-500" />
            {t('heroLabel')}
            <span className="w-5 h-px bg-indigo-500" />
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-50 mb-5">
            {t('heroTitle')}
          </h1>
          <p className="max-w-xl mx-auto text-zinc-400 text-lg leading-relaxed">
            {t('heroDesc')}
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-12 md:py-16 pb-24" aria-label="Contact form">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Sidebar info */}
            <aside className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-zinc-50 mb-6">{t('whyTitle')}</h2>
                <div className="space-y-4">
                  {whyPoints.map((point) => (
                    <div key={point} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                      <span className="text-zinc-400 text-sm">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-zinc-800">
                {contactDetails.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-zinc-500 text-xs">{label}</p>
                      {href ? (
                        <a href={href} className="text-zinc-200 text-sm hover:text-indigo-400 transition-colors">
                          {value}
                        </a>
                      ) : (
                        <p className="text-zinc-200 text-sm">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-indigo-500/8 border border-indigo-500/20">
                <p className="text-indigo-300 text-sm font-medium mb-1">{t('notReadyTitle')}</p>
                <p className="text-indigo-400/70 text-xs leading-relaxed">{t('notReadyDesc')}</p>
              </div>
            </aside>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50">
                <h2 className="text-xl font-semibold text-zinc-50 mb-2">{t('formTitle')}</h2>
                <p className="text-zinc-500 text-sm mb-8">{t('formDesc')}</p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
