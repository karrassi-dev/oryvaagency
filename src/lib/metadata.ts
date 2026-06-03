import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://oryva.agency'

export const siteConfig = {
  name: 'Oryva',
  tagline: 'Digital Growth Agency',
  description:
    'Oryva helps businesses generate more customers through web development, SEO, digital marketing, and AI automation.',
  url: BASE_URL,
  ogImage: `${BASE_URL}/og-image.png`,
  links: {
    twitter: 'https://twitter.com/oryvaagency',
    linkedin: 'https://linkedin.com/company/oryvaagency',
    instagram: 'https://instagram.com/oryvaagency',
  },
}

export function buildMetadata(overrides?: Partial<Metadata>): Metadata {
  const title = overrides?.title ?? `${siteConfig.name} — ${siteConfig.tagline}`
  const description = (overrides?.description as string) ?? siteConfig.description

  return {
    metadataBase: new URL(siteConfig.url),
    title: overrides?.title
      ? { default: overrides.title as string, template: `%s | ${siteConfig.name}` }
      : { default: `${siteConfig.name} — ${siteConfig.tagline}`, template: `%s | ${siteConfig.name}` },
    description,
    keywords: [
      'digital agency',
      'web development',
      'SEO optimization',
      'digital marketing',
      'AI automation',
      'growth agency',
      'lead generation',
      ...(overrides?.keywords as string[] ?? []),
    ],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: title as string,
      description,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: `${siteConfig.name} — ${siteConfig.tagline}` }],
      ...overrides?.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title: title as string,
      description,
      images: [siteConfig.ogImage],
      ...overrides?.twitter,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    ...overrides,
  }
}
