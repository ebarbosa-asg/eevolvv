'use client'

import { useState, useEffect } from 'react'

type PermissionState = 'unsupported' | 'default' | 'granted' | 'denied' | 'loading'

type Props = {
  slug: string
}

function BellIcon({ active, size = 16 }: { active?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6V10L2 11.5V12.5H14V11.5L12.5 10V6C12.5 3.5 10.5 1.5 8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill={active ? 'currentColor' : 'none'}
        fillOpacity={active ? 0.15 : 0}
      />
      <path d="M6.5 12.5C6.5 13.3 7.2 14 8 14C8.8 14 9.5 13.3 9.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {active && <circle cx="12" cy="4" r="2.5" fill="#22c55e" />}
    </svg>
  )
}

function urlBase64ToUint8Array(base64: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(b64)
  const buf = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i)
  return buf.buffer
}

export function NotifyButton({ slug }: Props) {
  const [state, setState] = useState<PermissionState>('loading')
  const [subEndpoint, setSubEndpoint] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setState('unsupported')
      return
    }
    const p = Notification.permission
    setState(p === 'granted' ? 'granted' : p === 'denied' ? 'denied' : 'default')

    if (p === 'granted') {
      navigator.serviceWorker.ready.then(reg =>
        reg.pushManager.getSubscription().then(sub => {
          if (sub) setSubEndpoint(sub.endpoint)
        })
      )
    }
  }, [])

  async function register() {
    if (!('serviceWorker' in navigator)) return
    setState('loading')
    try {
      await navigator.serviceWorker.register('/sw.js')
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setState(permission === 'denied' ? 'denied' : 'default')
        return
      }
      const reg = await navigator.serviceWorker.ready
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidKey) { setState('granted'); return }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      })

      const json = sub.toJSON()
      await fetch(`/api/os/client-agent/${slug}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json),
      })

      setSubEndpoint(sub.endpoint)
      setState('granted')
    } catch {
      setState('default')
    }
  }

  async function unregister() {
    setState('loading')
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await sub.unsubscribe()
        await fetch(`/api/os/client-agent/${slug}/subscribe`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
      }
      setSubEndpoint(null)
      setState('default')
    } catch {
      setState('granted')
    }
  }

  if (state === 'unsupported') return null

  if (state === 'denied') {
    return (
      <div
        style={{ position: 'relative', display: 'inline-flex' }}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
      >
        <button
          disabled
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'not-allowed',
            color: 'rgba(20,20,19,0.3)',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <BellIcon />
        </button>
        {tooltip && (
          <div
            className="mono"
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 6,
              background: 'var(--ink)',
              color: 'var(--paper)',
              fontSize: 10,
              letterSpacing: '0.04em',
              padding: '6px 10px',
              whiteSpace: 'nowrap',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            Blocked in browser settings
          </div>
        )}
      </div>
    )
  }

  if (state === 'granted') {
    return (
      <button
        onClick={unregister}
        title="Disable notifications"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#22c55e',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <BellIcon active />
      </button>
    )
  }

  return (
    <button
      onClick={register}
      disabled={state === 'loading'}
      title="Enable notifications"
      style={{
        background: 'transparent',
        border: '1px solid var(--rule)',
        cursor: state === 'loading' ? 'wait' : 'pointer',
        color: 'rgba(20,20,19,0.45)',
        padding: '4px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        opacity: state === 'loading' ? 0.5 : 1,
        transition: 'color 0.12s, border-color 0.12s',
      }}
    >
      <BellIcon />
      <span className="mono" style={{ fontSize: 9, letterSpacing: '0.12em' }}>
        {state === 'loading' ? '···' : 'NOTIFY'}
      </span>
    </button>
  )
}
