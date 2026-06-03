import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/metadata'
import { routing } from '@/i18n/routing'

const paths = ['', '/services', '/about', '/contact']

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url
  const entries: MetadataRoute.Sitemap = []

  for (const path of paths) {
    for (const locale of routing.locales) {
      const prefix = locale === routing.defaultLocale ? '' : `/${locale}`
      entries.push({
        url: `${base}${prefix}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' && locale === routing.defaultLocale ? 1 : 0.8,
      })
    }
  }

  return entries
}
