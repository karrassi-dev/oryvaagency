import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { getBlogPost, getBlogPosts, getRelatedPosts, getAllSlugs } from '@/lib/blog'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { ShareButtons } from '@/components/blog/ShareButtons'
import { BlogCard } from '@/components/blog/BlogCard'
import { Badge } from '@/components/shared/Badge'
import { Link } from '@/i18n/navigation'
import { siteConfig } from '@/lib/metadata'
import { routing } from '@/i18n/routing'
import { Calendar, Clock, User, ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const slugs = getAllSlugs()
  const params: { locale: string; slug: string }[] = []
  for (const locale of routing.locales) {
    for (const slug of slugs) {
      params.push({ locale, slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getBlogPost(locale, slug)
  if (!post) return {}

  const base = siteConfig.url
  const localePath = locale === routing.defaultLocale ? '' : `/${locale}`
  const url = `${base}${localePath}/blog/${slug}`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'Oryva',
      url: base,
    },
    datePublished: post.date,
    url,
    keywords: post.keywords.join(', '),
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: url,
      languages: {
        en: `${base}/blog/${slug}`,
        fr: `${base}/fr/blog/${slug}`,
        ar: `${base}/ar/blog/${slug}`,
        'x-default': `${base}/blog/${slug}`,
      },
    },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.keywords,
      images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    other: {
      'application/ld+json': JSON.stringify(articleSchema),
    },
  }
}

function formatDate(dateStr: string, locale: string) {
  try {
    return new Date(dateStr).toLocaleDateString(
      locale === 'ar' ? 'ar-MA' : locale === 'fr' ? 'fr-FR' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    )
  } catch {
    return dateStr
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const post = getBlogPost(locale, slug)
  if (!post) notFound()

  const t = await getTranslations({ locale, namespace: 'Blog' })
  const allPosts = getBlogPosts(locale)
  const currentIndex = allPosts.findIndex((p) => p.slug === slug)
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const related = getRelatedPosts(locale, slug, post.category)

  const base = siteConfig.url
  const localePath = locale === routing.defaultLocale ? '' : `/${locale}`
  const postUrl = `${base}${localePath}/blog/${slug}`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: 'Oryva', url: base },
    datePublished: post.date,
    url: postUrl,
    keywords: post.keywords.join(', '),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Hero */}
      <section className="relative pt-28 pb-10 overflow-hidden dot-grid">
        <div
          aria-hidden
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #6366f1 0%, transparent 70%)' }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-zinc-500 mb-8">
            <Link href="/" className="hover:text-zinc-300 transition-colors">Oryva</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/blog" className="hover:text-zinc-300 transition-colors">{t('label')}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-zinc-400 line-clamp-1">{post.title}</span>
          </nav>

          <Badge variant="accent" className="mb-5">{post.category}</Badge>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-50 leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-zinc-400 text-lg leading-relaxed mb-8 max-w-3xl">
            {post.description}
          </p>

          {post.coverImage && (
            <div className="rounded-2xl overflow-hidden mb-8 aspect-video">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-5 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.date, locale)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readingTime} {t('minRead')}
            </span>
          </div>
        </div>
      </section>

      {/* Content + TOC */}
      <section className="py-10 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
            {/* Article body */}
            <article
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <TableOfContents headings={post.headings} title={t('tableOfContents')} />
            </aside>
          </div>

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-zinc-800">
            <ShareButtons
              url={postUrl}
              title={post.title}
              shareLabel={t('share')}
              copiedLabel={t('copied')}
            />
          </div>
        </div>
      </section>

      {/* Prev / Next */}
      {(prevPost || nextPost) && (
        <section className="py-10 border-t border-zinc-800">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.slug}` as '/blog/[slug]'}
                className="group flex items-center gap-4 p-5 rounded-xl border border-zinc-800 hover:border-indigo-500/40 hover:bg-zinc-800/30 transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-zinc-500 group-hover:text-indigo-400 shrink-0 transition-colors" />
                <div>
                  <p className="text-xs text-zinc-500 mb-1">{t('previousPost')}</p>
                  <p className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100 line-clamp-2 transition-colors">{prevPost.title}</p>
                </div>
              </Link>
            ) : <div />}
            {nextPost && (
              <Link
                href={`/blog/${nextPost.slug}` as '/blog/[slug]'}
                className="group flex items-center gap-4 p-5 rounded-xl border border-zinc-800 hover:border-indigo-500/40 hover:bg-zinc-800/30 transition-all sm:flex-row-reverse sm:text-right"
              >
                <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-indigo-400 shrink-0 transition-colors" />
                <div>
                  <p className="text-xs text-zinc-500 mb-1">{t('nextPost')}</p>
                  <p className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100 line-clamp-2 transition-colors">{nextPost.title}</p>
                </div>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Related posts */}
      {related.length > 0 && (
        <section className="py-16 border-t border-zinc-800">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-zinc-50 mb-8">{t('relatedPosts')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} readMoreLabel={t('readMore')} minReadLabel={t('minRead')} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
