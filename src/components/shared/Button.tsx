import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: React.ReactNode
  variant?: Variant
  size?: Size
  href?: string
  onClick?: () => void
  showArrow?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:opacity-50 disabled:pointer-events-none rounded-lg cursor-pointer'

const variants: Record<Variant, string> = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 shadow-lg shadow-indigo-500/20',
  secondary:
    'bg-zinc-800 text-zinc-100 border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600',
  ghost: 'text-zinc-300 hover:text-white hover:bg-zinc-800',
}

const sizes: Record<Size, string> = {
  sm: 'text-sm px-4 py-2',
  md: 'text-sm px-5 py-2.5',
  lg: 'text-base px-7 py-3.5',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  showArrow,
  className = '',
  type = 'button',
  disabled,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  const content = (
    <>
      {children}
      {showArrow && <ArrowRight className="w-4 h-4" />}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {content}
    </button>
  )
}
