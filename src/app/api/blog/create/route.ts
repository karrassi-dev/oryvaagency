import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const maxDuration = 60

const localeContent = z.object({
  title:       z.string().min(5).max(200),
  description: z.string().min(10).max(500),
  content:     z.string().min(100),
  keywords:    z.array(z.string()).default([]),
  readingTime: z.number().int().min(1).max(60).default(5),
  author:      z.string().default('Oryva Team'),
})

const schema = z.object({
  slug:       z.string().min(3).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers and hyphens only'),
  category:   z.enum(['Web Development', 'SEO', 'Digital Marketing', 'AI Automation']),
  coverImage: z.string().default(''),
  en:         localeContent,
  fr:         localeContent,
  ar:         localeContent,
})

const CATEGORY_MAP: Record<string, Record<string, string>> = {
  'Web Development':   { en: 'Web Development',  fr: 'Développement Web',   ar: 'تطوير الويب' },
  'SEO':               { en: 'SEO',              fr: 'SEO',                  ar: 'SEO' },
  'Digital Marketing': { en: 'Digital Marketing', fr: 'Marketing Digital',   ar: 'التسويق الرقمي' },
  'AI Automation':     { en: 'AI Automation',     fr: 'Automatisation IA',   ar: 'أتمتة الذكاء الاصطناعي' },
}

function buildMarkdown(
  slug: string,
  locale: 'en' | 'fr' | 'ar',
  data: z.infer<typeof localeContent>,
  category: string,
  coverImage: string,
): string {
  const date          = new Date().toISOString().split('T')[0]
  const localCategory = CATEGORY_MAP[category]?.[locale] ?? category
  const keywords      = JSON.stringify(data.keywords)

  return `---
title: "${data.title.replace(/"/g, '\\"')}"
slug: "${slug}"
description: "${data.description.replace(/"/g, '\\"')}"
date: "${date}"
author: "${data.author}"
category: "${localCategory}"
coverImage: "${coverImage}"
keywords: ${keywords}
readingTime: ${data.readingTime}
---

${data.content}
`
}

async function pushToGitHub(slug: string, locale: string, content: string): Promise<void> {
  const token = process.env.GITHUB_TOKEN
  if (!token) throw new Error('GITHUB_TOKEN is not set in environment variables')

  const repo = process.env.GITHUB_REPO ?? 'karrassi-dev/oryvaagency'
  const path = `content/blog/${locale}/${slug}.md`
  const url  = `https://api.github.com/repos/${repo}/contents/${path}`

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept:        'application/vnd.github+json',
    'Content-Type':'application/json',
  }

  // Check if file already exists (to get sha for update)
  let sha: string | undefined
  const existing = await fetch(url, { headers })
  if (existing.ok) {
    const d = await existing.json()
    sha = d.sha
  }

  const body: Record<string, unknown> = {
    message: `blog: add "${slug}" (${locale})`,
    content: Buffer.from(content, 'utf-8').toString('base64'),
    branch:  'main',
  }
  if (sha) body.sha = sha

  const res = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(body) })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`GitHub push failed (${locale}): ${JSON.stringify(err)}`)
  }
}

async function triggerDeploy(): Promise<void> {
  const hook = process.env.VERCEL_DEPLOY_HOOK
  if (!hook) return
  await fetch(hook, { method: 'POST' })
}

export async function POST(req: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────
  const authHeader = req.headers.get('authorization') ?? ''
  const token      = authHeader.replace('Bearer ', '').trim()

  if (!process.env.BLOG_API_KEY) {
    console.error('[blog/create] BLOG_API_KEY not set')
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }
  if (!token || token !== process.env.BLOG_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Parse body ──────────────────────────────────────────────────────────
  let rawBody: unknown
  try {
    rawBody = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // ── Validate ────────────────────────────────────────────────────────────
  const parsed = schema.safeParse(rawBody)
  if (!parsed.success) {
    const details = parsed.error.flatten()
    console.error('[blog/create] Validation failed:', JSON.stringify(details))
    return NextResponse.json(
      { error: 'Invalid input', details },
      { status: 400 },
    )
  }

  const { slug, category, coverImage, en, fr, ar } = parsed.data

  // ── Push to GitHub ──────────────────────────────────────────────────────
  try {
    await Promise.all([
      pushToGitHub(slug, 'en', buildMarkdown(slug, 'en', en, category, coverImage)),
      pushToGitHub(slug, 'fr', buildMarkdown(slug, 'fr', fr, category, coverImage)),
      pushToGitHub(slug, 'ar', buildMarkdown(slug, 'ar', ar, category, coverImage)),
    ])
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[blog/create] GitHub error:', message)
    return NextResponse.json(
      { error: 'Failed to push to GitHub', details: message },
      { status: 500 },
    )
  }

  // ── Trigger deploy ──────────────────────────────────────────────────────
  await triggerDeploy()

  return NextResponse.json({
    success: true,
    slug,
    message: 'Blog post created',
    urls: {
      en: `https://oryvaagency.com/blog/${slug}`,
      fr: `https://oryvaagency.com/fr/blog/${slug}`,
      ar: `https://oryvaagency.com/ar/blog/${slug}`,
    },
  }, { status: 201 })
}
