interface SectionHeaderProps {
  label?: string
  title: string
  description?: string
  centered?: boolean
  className?: string
}

export function SectionHeader({ label, title, description, centered = true, className = '' }: SectionHeaderProps) {
  return (
    <div className={`${centered ? 'text-center mx-auto max-w-2xl' : ''} ${className}`}>
      {label && (
        <p className="inline-flex items-center gap-2 text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4">
          <span className="w-5 h-px bg-indigo-500" />
          {label}
          <span className="w-5 h-px bg-indigo-500" />
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-50 mb-4">{title}</h2>
      {description && (
        <p className="text-zinc-400 text-lg leading-relaxed">{description}</p>
      )}
    </div>
  )
}
