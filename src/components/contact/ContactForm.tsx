'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

interface FormState {
  name: string
  email: string
  phone: string
  company: string
  message: string
}

const initialState: FormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  message: '',
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export function ContactForm() {
  const t = useTranslations('ContactForm')
  const [form, setForm] = useState<FormState>(initialState)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Something went wrong')
      }

      setStatus('success')
      setForm(initialState)
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : t('errorFallback'))
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-4 py-16 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-50">{t('successTitle')}</h3>
        <p className="text-zinc-400 max-w-sm">{t('successDesc')}</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
        >
          {t('successReset')}
        </button>
      </motion.div>
    )
  }

  const inputClass =
    'w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all'

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
            {t('nameLabel')} <span className="text-indigo-400">*</span>
          </label>
          <input
            id="name" name="name" type="text" required
            value={form.name} onChange={handleChange}
            placeholder={t('namePlaceholder')} className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
            {t('emailLabel')} <span className="text-indigo-400">*</span>
          </label>
          <input
            id="email" name="email" type="email" required
            value={form.email} onChange={handleChange}
            placeholder={t('emailPlaceholder')} className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-2">
            {t('phoneLabel')}
          </label>
          <input
            id="phone" name="phone" type="tel"
            value={form.phone} onChange={handleChange}
            placeholder={t('phonePlaceholder')} className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-zinc-300 mb-2">
            {t('companyLabel')}
          </label>
          <input
            id="company" name="company" type="text"
            value={form.company} onChange={handleChange}
            placeholder={t('companyPlaceholder')} className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">
          {t('messageLabel')} <span className="text-indigo-400">*</span>
        </label>
        <textarea
          id="message" name="message" required rows={5}
          value={form.message} onChange={handleChange}
          placeholder={t('messagePlaceholder')} className={`${inputClass} resize-none`}
        />
      </div>

      <AnimatePresence>
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-60 disabled:pointer-events-none transition-all duration-200 shadow-lg shadow-indigo-500/20"
      >
        {status === 'loading' ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t('submitting')}
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            {t('submit')}
          </>
        )}
      </button>

      <p className="text-zinc-600 text-xs text-center">{t('footer')}</p>
    </form>
  )
}
