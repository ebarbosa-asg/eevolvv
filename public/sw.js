// eevolvv client portal — push notification service worker

self.addEventListener('push', event => {
  let data = { title: 'eevolvv', body: 'Something happened.', url: '/os', tag: 'eevolvv' }
  try {
    data = { ...data, ...JSON.parse(event.data?.text() ?? '{}') }
  } catch {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/mascot.png',
      badge: '/mascot.png',
      tag: data.tag ?? 'eevolvv',
      data: { url: data.url ?? '/os' },
      requireInteraction: false,
    })
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  const url = event.notification.data?.url ?? '/os'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Focus existing tab if open
      for (const client of windowClients) {
        const clientUrl = new URL(client.url)
        const targetUrl = new URL(url, self.location.origin)
        if (clientUrl.pathname === targetUrl.pathname) {
          return client.focus()
        }
      }
      return clients.openWindow(url)
    })
  )
})

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', event => event.waitUntil(clients.claim()))
