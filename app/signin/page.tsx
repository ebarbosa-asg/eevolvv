import { signIn } from '@/lib/auth'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign in — eevolvv OS',
  robots: { index: false, follow: false },
}

export default function SignInPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string }
}) {
  const callbackUrl = searchParams.callbackUrl ?? '/os'

  return (
    <div style={{
      background: 'var(--ink)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Space Grotesk, sans-serif',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        padding: '48px',
        width: '100%',
        maxWidth: '360px',
      }}>
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div className="brand-wordmark" style={{ fontSize: '22px', color: 'var(--paper)', marginBottom: '8px' }}>eevolvv</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent)' }}>§ OS · ACCESS</div>
        </div>

        {searchParams.error && (
          <div style={{
            background: 'rgba(140,43,26,0.15)',
            border: '1px solid var(--accent)',
            padding: '12px 16px',
            marginBottom: '24px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
            color: 'var(--accent)',
          }}>
            {searchParams.error === 'AccessDenied'
              ? '→ Access restricted to authorized accounts only.'
              : `→ Sign-in error: ${searchParams.error}`}
          </div>
        )}

        <form
          action={async () => {
            'use server'
            await signIn('google', { redirectTo: callbackUrl })
          }}
        >
          <button
            type="submit"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'var(--paper)',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              padding: '14px 20px',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </form>

        <p style={{
          marginTop: '24px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          color: 'rgba(250,247,240,0.3)',
          textAlign: 'center',
          lineHeight: 1.6,
        }}>
          Restricted to hello@eevolvv.com
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}
