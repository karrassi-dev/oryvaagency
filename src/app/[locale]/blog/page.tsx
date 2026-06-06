import type { Metadata } from 'next'
import { Suspense } from 'react'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { getBlogPosts, getCategories } from '@/lib/blog'
import { BlogCard } from '@/components/blog/BlogCard'
import { BlogFilters } from '@/components/blog/BlogFilters'
import { BlogPagination } from '@/components/blog/BlogPagination'
import { buildMetadata, siteConfig } from '@/lib/metadata'
import { routing } from '@/i18n/routing'

const POSTS_PER_PAGE = 9

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string; category?: string; page?: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Blog' })
  const base = siteConfig.url
  const path = '/blog'

  return buildMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `${base}${path}`,
      languages: {
        en: `${base}${path}`,
        fr: `${base}/fr${path}`,
        ar: `${base}/ar${path}`,
        'x-default': `${base}${path}`,
      },
    },
  })
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { q = '', category = '', page: pageParam = '1' } = await searchParams
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'Blog' })
  const allPosts = getBlogPosts(locale)
  const categories = getCategories(locale)

  const filtered = allPosts.filter((post) => {
    const matchQ = !q || post.title.toLowerCase().includes(q.toLowerCase()) || post.description.toLowerCase().includes(q.toLowerCase())
    const matchCat = !category || post.category === category
    return matchQ && matchCat
  })

  const totalPosts = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE))
  const currentPage = Math.min(Math.max(1, parseInt(pageParam, 10) || 1), totalPages)
  const paginated = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden dot-grid" aria-label="Blog hero">
        <div
          aria-hidden
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #6366f1 0%, transparent 70%)' }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <p className="inline-flex items-center gap-2 text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-5">
            <span className="w-5 h-px bg-indigo-500" />
            {t('label')}
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

      {/* Filters + Grid */}
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <Suspense>
            <BlogFilters
              categories={categories}
              searchPlaceholder={t('searchPlaceholder')}
              allLabel={t('allCategories')}
            />
          </Suspense>

          {totalPosts === 0 ? (
            <div className="text-center py-24">
              <p className="text-zinc-500 text-lg">{t('noResults')}</p>
            </div>
          ) : (
            <>
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map((post) => (
                  <BlogCard
                    key={post.slug}
                    post={post}
                    readMoreLabel={t('readMore')}
                    minReadLabel={t('minRead')}
                  />
                ))}
              </div>

              <Suspense>
                <BlogPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalPosts={totalPosts}
                  postsPerPage={POSTS_PER_PAGE}
                  prevLabel={t('paginationPrev')}
                  nextLabel={t('paginationNext')}
                />
              </Suspense>
            </>
          )}
        </div>
      </section>
    </>
  )
}
