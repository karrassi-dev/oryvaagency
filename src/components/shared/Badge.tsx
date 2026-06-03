interface BadgeProps {
  children: React.ReactNode
  variant?: 'accent' | 'zinc' | 'outline'
  className?: string
}

const variants = {
  accent: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  zinc: 'bg-zinc-800 text-zinc-400 border border-zinc-700',
  outline: 'border border-zinc-700 text-zinc-400',
}

export function Badge({ children, variant = 'accent', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
