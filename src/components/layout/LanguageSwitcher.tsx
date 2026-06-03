'use client'

import { useLocale } from 'next-intl'
import { usePathname, Link } from '@/i18n/navigation'

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'ar', label: 'ع' },
] as const

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-0.5" aria-label="Select language">
      {locales.map(({ code, label }, i) => (
        <span key={code} className="flex items-center">
          <Link
            href={pathname}
            locale={code}
            className={`px-2 py-1 rounded text-xs font-semibold tracking-wide transition-colors ${
              locale === code
                ? 'text-zinc-50 bg-zinc-700'
                : 'text-zinc-500 hover:text-zinc-200'
            }`}
            aria-current={locale === code ? 'true' : undefined}
          >
            {label}
          </Link>
          {i < locales.length - 1 && (
            <span className="text-zinc-700 text-xs select-none">·</span>
          )}
        </span>
      ))}
    </div>
  )
}
