import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const localeContent = z.object({
  title:       z.string().min(5).max(200),
  description: z.string().min(10).max(500),
  content:     z.string().min(100),
  keywords:    z.array(z.string()).default([]),
  readingTime: z.number().int().min(1).max(60).default(5),
  author:      z.string().default('Oryva Team'),
})

const schema = z.object({
  slug:        z.string().min(3).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers and hyphens only'),
  category:    z.enum(['Web Development', 'SEO', 'Digital Marketing', 'AI Automation']),
  coverImage:  z.string().default(''),
  en:          localeContent,
  fr:          localeContent,
  ar:          localeContent,
})

const CATEGORY_MAP: Record<string, Record<string, string>> = {
  'Web Development':  { en: 'Web Development',  fr: 'Développement Web',    ar: 'تطوير الويب' },
  'SEO':              { en: 'SEO',               fr: 'SEO',                  ar: 'SEO' },
  'Digital Marketing':{ en: 'Digital Marketing', fr: 'Marketing Digital',    ar: 'التسويق الرقمي' },
  'AI Automation':    { en: 'AI Automation',     fr: 'Automatisation IA',    ar: 'أتمتة الذكاء الاصطناعي' },
}

function buildMarkdown(
  slug: string,
  locale: 'en' | 'fr' | 'ar',
  data: z.infer<typeof localeContent>,
  category: string,
  coverImage: string,
): string {
  const date            = new Date().toISOString().split('T')[0]
  const localCategory   = CATEGORY_MAP[category]?.[locale] ?? category
  const keywords        = JSON.stringify(data.keywords)

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
  const repo  = process.env.GITHUB_REPO ?? 'karrassi-dev/oryvaagency'
  const path  = `content/blog/${locale}/${slug}.md`
  const url   = `https://api.github.com/repos/${repo}/contents/${path}`

  let sha: string | undefined
  const existing = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
  })
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

  const res = await fetch(url, {
    method:  'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept:        'application/vnd.github+json',
      'Content-Type':'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`GitHub error (${locale}): ${JSON.stringify(err)}`)
  }
}

async function triggerDeploy(): Promise<void> {
  const hook = process.env.VERCEL_DEPLOY_HOOK
  if (!hook) return
  await fetch(hook, { method: 'POST' })
}

export async function POST(req: NextRequest) {
  // Auth
  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.replace('Bearer ', '').trim()
  if (!token || token !== process.env.BLOG_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body   = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { slug, category, coverImage, en, fr, ar } = parsed.data

    // Push all 3 locales in parallel
    await Promise.all([
      pushToGitHub(slug, 'en', buildMarkdown(slug, 'en', en, category, coverImage)),
      pushToGitHub(slug, 'fr', buildMarkdown(slug, 'fr', fr, category, coverImage)),
      pushToGitHub(slug, 'ar', buildMarkdown(slug, 'ar', ar, category, coverImage)),
    ])

    // One deploy for all 3
    await triggerDeploy()

    return NextResponse.json({
      success: true,
      slug,
      urls: {
        en: `https://oryvaagency.com/blog/${slug}`,
        fr: `https://oryvaagency.com/fr/blog/${slug}`,
        ar: `https://oryvaagency.com/ar/blog/${slug}`,
      },
    }, { status: 201 })

  } catch (err) {
    console.error('[blog/create]', err)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
