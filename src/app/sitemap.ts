import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/metadata'
import { routing } from '@/i18n/routing'
import { getAllSlugs, getBlogPosts } from '@/lib/blog'

const staticPaths = ['', '/services', '/about', '/contact', '/blog']

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url
  const entries: MetadataRoute.Sitemap = []

  // Static pages
  for (const path of staticPaths) {
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

  // Blog posts
  const slugs = getAllSlugs()
  for (const slug of slugs) {
    for (const locale of routing.locales) {
      const prefix = locale === routing.defaultLocale ? '' : `/${locale}`
      const posts = getBlogPosts(locale)
      const post = posts.find((p) => p.slug === slug)
      entries.push({
        url: `${base}${prefix}/blog/${slug}`,
        lastModified: post ? new Date(post.date) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  return entries
}
