import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const maxDuration = 60

// ── Schema ────────────────────────────────────────────────────────────────────
const localeContent = z.object({
  title:       z.string().min(5).max(200),
  description: z.string().min(10).max(500),
  content:     z.string().min(100),
  keywords:    z.array(z.string()).default([]),
  readingTime: z.number().int().min(1).max(60).default(5),
  author:      z.string().default('Oryva Team'),
})

const schema = z.object({
  slug:       z.string().min(3).max(100).regex(/^[a-z0-9-]+$/),
  category:   z.enum(['Web Development', 'SEO', 'Digital Marketing', 'AI Automation']),
  coverImage: z.string().default(''),
  en:         localeContent,
  fr:         localeContent,
  ar:         localeContent,
})

const CATEGORY_MAP: Record<string, Record<string, string>> = {
  'Web Development':   { en: 'Web Development',  fr: 'Développement Web',  ar: 'تطوير الويب' },
  'SEO':               { en: 'SEO',              fr: 'SEO',                ar: 'SEO' },
  'Digital Marketing': { en: 'Digital Marketing', fr: 'Marketing Digital',  ar: 'التسويق الرقمي' },
  'AI Automation':     { en: 'AI Automation',     fr: 'Automatisation IA',  ar: 'أتمتة الذكاء الاصطناعي' },
}

// ── Content guard ─────────────────────────────────────────────────────────────
const BAD_PATTERNS = [
  'please provide the actual subject',
  'please provide the actual keyword',
  'it seems like you',
  "i'm sorry",
  '{{',
  'placeholder',
  'undefined',
]

function assertContent(content: string, field: string) {
  if (!content || content.trim().length < 100)
    throw new Error(`${field}: content is empty or too short`)
  // Only scan the opening 500 chars — model refusals appear at the start,
  // not buried in article body (e.g. chatbot dialogue examples say "I'm sorry")
  const intro = content.slice(0, 500).toLowerCase()
  for (const p of BAD_PATTERNS)
    if (intro.includes(p.toLowerCase()))
      throw new Error(`${field}: content contains invalid text "${p}"`)
}

// ── Image download → GitHub ───────────────────────────────────────────────────
async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 25_000)
    const res = await fetch(url, { signal: ctrl.signal })
    clearTimeout(timer)
    if (!res.ok) return null
    const buf = await res.arrayBuffer()
    return Buffer.from(buf)
  } catch {
    return null
  }
}

async function uploadImageToGitHub(
  slug: string,
  imgBuffer: Buffer,
  token: string,
  repo: string,
): Promise<string> {
  const path   = `public/images/blog/${slug}.jpg`
  const url    = `https://api.github.com/repos/${repo}/contents/${path}`
  const hdrs   = {
    Authorization: `Bearer ${token}`,
    Accept:        'application/vnd.github+json',
    'Content-Type':'application/json',
  }

  let sha: string | undefined
  const existing = await fetch(url, { headers: hdrs })
  if (existing.ok) sha = (await existing.json()).sha

  const body: Record<string, unknown> = {
    message: `blog: cover image for ${slug}`,
    content: imgBuffer.toString('base64'),
    branch:  'main',
  }
  if (sha) body.sha = sha

  const res = await fetch(url, { method: 'PUT', headers: hdrs, body: JSON.stringify(body) })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(`GitHub image upload failed: ${JSON.stringify(err)}`)
  }
  return `/images/blog/${slug}.jpg`
}

// ── Markdown builder ──────────────────────────────────────────────────────────
function buildMarkdown(
  slug: string,
  locale: 'en' | 'fr' | 'ar',
  data: z.infer<typeof localeContent>,
  category: string,
  coverImage: string,
): string {
  const date     = new Date().toISOString().split('T')[0]
  const catLocal = CATEGORY_MAP[category]?.[locale] ?? category
  const kws      = JSON.stringify(data.keywords)

  return `---
title: "${data.title.replace(/"/g, '\\"')}"
slug: "${slug}"
description: "${data.description.replace(/"/g, '\\"')}"
date: "${date}"
author: "${data.author}"
category: "${catLocal}"
coverImage: "${coverImage}"
keywords: ${kws}
readingTime: ${data.readingTime}
---

${data.content}
`
}

// ── GitHub push ───────────────────────────────────────────────────────────────
async function pushToGitHub(slug: string, locale: string, content: string, token: string, repo: string) {
  const path = `content/blog/${locale}/${slug}.md`
  const url  = `https://api.github.com/repos/${repo}/contents/${path}`
  const hdrs = {
    Authorization: `Bearer ${token}`,
    Accept:        'application/vnd.github+json',
    'Content-Type':'application/json',
  }

  let sha: string | undefined
  const existing = await fetch(url, { headers: hdrs })
  if (existing.ok) sha = (await existing.json()).sha

  const body: Record<string, unknown> = {
    message: `blog: ${sha ? 'update' : 'add'} "${slug}" (${locale})`,
    content: Buffer.from(content, 'utf-8').toString('base64'),
    branch:  'main',
  }
  if (sha) body.sha = sha

  const res = await fetch(url, { method: 'PUT', headers: hdrs, body: JSON.stringify(body) })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(`GitHub push failed (${locale}): ${JSON.stringify(err)}`)
  }
}

// ── Route ─────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Auth
  if (!process.env.BLOG_API_KEY) {
    console.error('[blog/create] BLOG_API_KEY not set')
    return NextResponse.json({ success: false, error: 'Server misconfiguration' }, { status: 500 })
  }
  const auth = (req.headers.get('authorization') ?? '').replace('Bearer ', '').trim()
  if (!auth || auth !== process.env.BLOG_API_KEY)
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  // Parse
  let raw: unknown
  try { raw = await req.json() }
  catch { return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 }) }

  // Validate schema
  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    const details = parsed.error.flatten()
    console.error('[blog/create] Schema validation failed:', JSON.stringify(details))
    return NextResponse.json({ success: false, error: 'Invalid input', details }, { status: 400 })
  }

  const { slug, category, en, fr, ar } = parsed.data
  let { coverImage } = parsed.data

  // Validate content quality
  try {
    assertContent(en.content, 'en.content')
    assertContent(fr.content, 'fr.content')
    assertContent(ar.content, 'ar.content')
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[blog/create] Content validation failed:', msg)
    return NextResponse.json({ success: false, error: 'Content validation failed', details: msg }, { status: 400 })
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    console.error('[blog/create] GITHUB_TOKEN not set')
    return NextResponse.json({ success: false, error: 'GITHUB_TOKEN not configured' }, { status: 500 })
  }
  const repo = process.env.GITHUB_REPO ?? 'karrassi-dev/oryvaagency'

  // Download cover image → save locally
  if (coverImage && coverImage.startsWith('http')) {
    const imgBuffer = await downloadImage(coverImage)
    if (imgBuffer && imgBuffer.length > 1000) {
      try {
        coverImage = await uploadImageToGitHub(slug, imgBuffer, token, repo)
        console.log(`[blog/create] Image saved: ${coverImage}`)
      } catch (err) {
        console.warn('[blog/create] Image upload failed, keeping external URL:', err)
      }
    } else {
      console.warn('[blog/create] Image download failed or too small, keeping external URL')
    }
  }

  // Push markdown files
  try {
    await Promise.all([
      pushToGitHub(slug, 'en', buildMarkdown(slug, 'en', en, category, coverImage), token, repo),
      pushToGitHub(slug, 'fr', buildMarkdown(slug, 'fr', fr, category, coverImage), token, repo),
      pushToGitHub(slug, 'ar', buildMarkdown(slug, 'ar', ar, category, coverImage), token, repo),
    ])
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[blog/create] GitHub error:', msg)
    return NextResponse.json({ success: false, error: 'GitHub push failed', details: msg }, { status: 500 })
  }

  // Trigger deploy
  const hook = process.env.VERCEL_DEPLOY_HOOK
  if (hook) {
    const dr = await fetch(hook, { method: 'POST' })
    if (!dr.ok) console.warn('[blog/create] Deploy hook failed:', dr.status)
  }

  return NextResponse.json({
    success: true,
    slug,
    message: 'Blog post created or updated',
    coverImage,
    urls: {
      en: `https://oryvaagency.com/blog/${slug}`,
      fr: `https://oryvaagency.com/fr/blog/${slug}`,
      ar: `https://oryvaagency.com/ar/blog/${slug}`,
    },
  }, { status: 201 })
}
