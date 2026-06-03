import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getTranslations, getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://oryva.agency'

  return {
    title: {
      default: t('siteTitle'),
      template: `%s | Oryva`,
    },
    description: t('siteDescription'),
    alternates: {
      canonical: baseUrl,
      languages: {
        en: baseUrl,
        fr: `${baseUrl}/fr`,
        ar: `${baseUrl}/ar`,
        'x-default': baseUrl,
      },
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  )
}
