import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export type BlogPostMeta = {
  slug: string
  title: string
  description: string
  date: string
  author: string
  category: string
  coverImage: string
  keywords: string[]
  readingTime: number
  locale: string
}

export type BlogPost = BlogPostMeta & {
  contentHtml: string
  headings: { id: string; text: string; level: number }[]
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s؀-ۿ-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function extractHeadings(markdown: string) {
  const headings: { id: string; text: string; level: number }[] = []
  const regex = /^(#{2,3})\s+(.+)$/gm
  let match
  while ((match = regex.exec(markdown)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    headings.push({ id: slugifyHeading(text), text, level })
  }
  return headings
}

function addHeadingIds(markdown: string): string {
  return markdown.replace(/^(#{2,3})\s+(.+)$/gm, (_, hashes, text) => {
    const id = slugifyHeading(text.trim())
    return `${hashes} <span id="${id}">${text.trim()}</span>`
  })
}

export function getBlogPosts(locale: string): BlogPostMeta[] {
  const dir = path.join(BLOG_DIR, locale)
  if (!fs.existsSync(dir)) return []

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))

  return files
    .map((filename) => {
      const slug = filename.replace('.md', '')
      const filePath = path.join(dir, filename)
      const source = fs.readFileSync(filePath, 'utf-8')
      const { data } = matter(source)

      return {
        slug,
        title: data.title ?? '',
        description: data.description ?? '',
        date: data.date ?? '',
        author: data.author ?? 'Oryva Team',
        category: data.category ?? '',
        coverImage: data.coverImage ?? '',
        keywords: data.keywords ?? [],
        readingTime: data.readingTime ?? 5,
        locale,
      } as BlogPostMeta
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getBlogPost(locale: string, slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, locale, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const source = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(source)
  const headings = extractHeadings(content)
  const withIds = addHeadingIds(content)
  const contentHtml = marked.parse(withIds) as string

  return {
    slug,
    title: data.title ?? '',
    description: data.description ?? '',
    date: data.date ?? '',
    author: data.author ?? 'Oryva Team',
    category: data.category ?? '',
    coverImage: data.coverImage ?? '',
    keywords: data.keywords ?? [],
    readingTime: data.readingTime ?? 5,
    contentHtml,
    headings,
    locale,
  }
}

export function getCategories(locale: string): string[] {
  const posts = getBlogPosts(locale)
  return ['All', ...Array.from(new Set(posts.map((p) => p.category)))]
}

export function getRelatedPosts(locale: string, slug: string, category: string, limit = 3): BlogPostMeta[] {
  return getBlogPosts(locale)
    .filter((p) => p.slug !== slug && p.category === category)
    .slice(0, limit)
}

export function getAllSlugs(): string[] {
  const dir = path.join(BLOG_DIR, 'en')
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace('.md', ''))
}
