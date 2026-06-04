import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '1.5rem',
    }}>
      <p style={{ fontSize: '8rem', fontWeight: 700, lineHeight: 1, background: 'linear-gradient(135deg, #818cf8, #6366f1, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
        404
      </p>
      <h1 style={{ color: '#fafafa', fontSize: '1.75rem', fontWeight: 700, margin: '0.5rem 0 1rem' }}>
        Page not found
      </h1>
      <p style={{ color: '#a1a1aa', fontSize: '1.125rem', marginBottom: '2.5rem' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.875rem 1.75rem',
        borderRadius: '0.5rem',
        backgroundColor: '#6366f1',
        color: 'white',
        fontWeight: 600,
        textDecoration: 'none',
        fontSize: '1rem',
      }}>
        ← Back to Home
      </Link>
    </div>
  )
}
