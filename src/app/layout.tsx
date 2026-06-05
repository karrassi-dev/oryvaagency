import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://oryvaagency.com'),
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://oryvaagency.com/#organization',
      name: 'Oryva',
      url: 'https://oryvaagency.com',
      logo: 'https://oryvaagency.com/logo.png',
      description:
        'Digital growth agency specializing in web development, SEO, digital marketing, and AI automation.',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'hello@oryva.agency',
      },
      sameAs: [
        'https://twitter.com/oryvaagency',
        'https://linkedin.com/company/oryvaagency',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://oryvaagency.com/#website',
      url: 'https://oryvaagency.com',
      name: 'Oryva',
      publisher: { '@id': 'https://oryvaagency.com/#organization' },
    },
  ],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  // X-NEXT-INTL-LOCALE is set by next-intl middleware on the forwarded request
  const locale = headersList.get('X-NEXT-INTL-LOCALE') ?? 'en'
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-5Z2FM1YHT8" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-5Z2FM1YHT8');
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  )
}
