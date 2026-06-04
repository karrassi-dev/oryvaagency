import { Link } from '@/i18n/navigation'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/shared/Badge'
import type { BlogPostMeta } from '@/lib/blog'

const categoryColors: Record<string, string> = {
  'Web Development': 'from-blue-500/20 to-indigo-500/20',
  'SEO': 'from-emerald-500/20 to-teal-500/20',
  'Digital Marketing': 'from-orange-500/20 to-amber-500/20',
  'AI Automation': 'from-purple-500/20 to-pink-500/20',
  'Développement Web': 'from-blue-500/20 to-indigo-500/20',
  'Marketing Digital': 'from-orange-500/20 to-amber-500/20',
  'Automatisation IA': 'from-purple-500/20 to-pink-500/20',
  'تطوير الويب': 'from-blue-500/20 to-indigo-500/20',
  'التسويق الرقمي': 'from-orange-500/20 to-amber-500/20',
  'أتمتة الذكاء الاصطناعي': 'from-purple-500/20 to-pink-500/20',
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

type Props = {
  post: BlogPostMeta
  readMoreLabel: string
  minReadLabel: string
}

export function BlogCard({ post, readMoreLabel, minReadLabel }: Props) {
  const gradient = categoryColors[post.category] ?? 'from-zinc-700/20 to-zinc-600/20'

  return (
    <article className="gradient-border-card rounded-2xl overflow-hidden bg-zinc-900/50 flex flex-col h-full group">
      {/* Cover */}
      <div className={`aspect-video bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 overflow-hidden`}>
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl font-bold text-white/10 select-none uppercase tracking-widest">
            {post.category.slice(0, 2)}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="accent">{post.category}</Badge>
        </div>

        <h2 className="text-zinc-50 font-bold text-lg leading-snug mb-3 line-clamp-2 group-hover:text-indigo-300 transition-colors">
          {post.title}
        </h2>

        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-5 flex-1">
          {post.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 text-zinc-500 text-xs">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.date, post.locale)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime} {minReadLabel}
            </span>
          </div>
          <Link
            href={`/blog/${post.slug}` as '/blog/[slug]'}
            className="inline-flex items-center gap-1 text-indigo-400 text-xs font-medium hover:text-indigo-300 transition-colors group/link"
          >
            {readMoreLabel}
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  )
}
