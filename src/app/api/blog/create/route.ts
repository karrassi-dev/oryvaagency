import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  title:       z.string().min(5).max(200),
  slug:        z.string().min(3).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10).max(500),
  content:     z.string().min(100),
  category:    z.enum(['Web Development', 'SEO', 'Digital Marketing', 'AI Automation']),
  author:      z.string().default('Oryva Team'),
  locale:      z.enum(['en', 'fr', 'ar']).default('en'),
  keywords:    z.array(z.string()).default([]),
  readingTime: z.number().int().min(1).max(60).default(5),
  coverImage:  z.string().default(''),
})

function buildMarkdown(data: z.infer<typeof schema>): string {
  const date = new Date().toISOString().split('T')[0]
  const keywords = JSON.stringify(data.keywords)

  return `---
title: "${data.title.replace(/"/g, '\\"')}"
slug: "${data.slug}"
description: "${data.description.replace(/"/g, '\\"')}"
date: "${date}"
author: "${data.author}"
category: "${data.category}"
coverImage: "${data.coverImage}"
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

  // Check if file already exists (need its SHA to update)
  let sha: string | undefined
  const existing = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
  })
  if (existing.ok) {
    const data = await existing.json()
    sha = data.sha
  }

  const body: Record<string, unknown> = {
    message: `blog: add "${slug}" (${locale})`,
    content: Buffer.from(content, 'utf-8').toString('base64'),
    branch: 'main',
  }
  if (sha) body.sha = sha

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`GitHub API error: ${JSON.stringify(err)}`)
  }
}

async function triggerDeploy(): Promise<void> {
  const hook = process.env.VERCEL_DEPLOY_HOOK
  if (!hook) return
  await fetch(hook, { method: 'POST' })
}

export async function POST(req: NextRequest) {
  // Auth check
  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.replace('Bearer ', '').trim()
  if (!token || token !== process.env.BLOG_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const markdown = buildMarkdown(parsed.data)
    await pushToGitHub(parsed.data.slug, parsed.data.locale, markdown)
    await triggerDeploy()

    return NextResponse.json({
      success: true,
      slug:    parsed.data.slug,
      locale:  parsed.data.locale,
      url:     `https://oryvaagency.com/blog/${parsed.data.slug}`,
    }, { status: 201 })

  } catch (err) {
    console.error('[blog/create]', err)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
