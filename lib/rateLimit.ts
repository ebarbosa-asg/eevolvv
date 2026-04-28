const store = new Map<string, number[]>()

const MAX = parseInt(process.env.RATE_LIMIT_MAX ?? '3', 10)
const WINDOW_MS = 60 * 60 * 1000 // 1 hour

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const windowStart = now - WINDOW_MS
  const hits = (store.get(ip) ?? []).filter((t) => t > windowStart)

  if (hits.length >= MAX) {
    return { allowed: false, remaining: 0 }
  }

  store.set(ip, [...hits, now])
  return { allowed: true, remaining: MAX - hits.length - 1 }
}
