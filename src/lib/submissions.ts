import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const FILE_PATH = path.join(DATA_DIR, 'submissions.json')

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string
  company: string
  message: string
  createdAt: string
}

export async function saveSubmission(
  data: Omit<ContactSubmission, 'id' | 'createdAt'>,
): Promise<ContactSubmission> {
  await fs.mkdir(DATA_DIR, { recursive: true })

  let submissions: ContactSubmission[] = []
  try {
    const raw = await fs.readFile(FILE_PATH, 'utf-8')
    submissions = JSON.parse(raw)
  } catch {
    // File doesn't exist yet — start fresh
  }

  const submission: ContactSubmission = {
    id: crypto.randomUUID(),
    ...data,
    createdAt: new Date().toISOString(),
  }

  submissions.push(submission)
  await fs.writeFile(FILE_PATH, JSON.stringify(submissions, null, 2), 'utf-8')

  return submission
}

export async function getSubmissions(): Promise<ContactSubmission[]> {
  try {
    const raw = await fs.readFile(FILE_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}
