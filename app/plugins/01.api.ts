// A single configured `$fetch` instance for every call to bacakarya-api.
// - baseURL comes from runtimeConfig.public.apiBase (NUXT_PUBLIC_API_BASE)
// - attaches `Authorization: Bearer <token>` from the auth store when present
// - every bacakarya-api error response is { data: null, message } - this
//   surfaces `message` directly on thrown errors instead of a generic
//   "Request failed" string
// - a 401 on an authenticated request means the 7-day token expired (the
//   session-restore call is public, so it can't catch that) - log the user
//   out and send them to the login screen instead of leaving a half-working
//   "logged in" UI where every action fails.
// - the backend sits on a free plan that sleeps when idle, so the first
//   request can take up to a minute. In the browser, a request pending for
//   more than SLOW_AFTER_MS raises the startup overlay. During server-side
//   rendering, requests give up after SLOW_AFTER_MS instead (a blank page for
//   a minute is worse) and fail with a `waking` error, which error.vue turns
//   into the startup page.
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  function pathOf(request: unknown): string {
    const url = String(
      typeof request === 'string' ? request : ((request as Request)?.url ?? '')
    )
    return url.split('?', 1)[0] ?? ''
  }

  // For these, a 401 means "wrong password", not "expired session":
  // - POST /users/login (bad credentials)
  // - DELETE /users/{id} (password re-confirmation for account deletion)
  function is401ExpectedFromUser(request: unknown, method?: string) {
    const path = pathOf(request)
    const verb = (method || 'GET').toUpperCase()
    if (path.endsWith('/users/login')) {
      return true
    }
    return verb === 'DELETE' && /\/users\/[^/]+$/.test(path)
  }

  // Slow-request tracking (browser only). Keyed by the request's options
  // object, which ofetch passes unchanged to every hook of one request.
  const slowTimers = new WeakMap<
    object,
    { timer: ReturnType<typeof setTimeout>; counted: boolean }
  >()
  const backend = import.meta.client ? useBackendStore() : null

  function startSlowTimer(options: object) {
    if (!backend) {
      return
    }
    const entry = {
      counted: false,
      timer: setTimeout(() => {
        entry.counted = true
        backend.slowStarted()
      }, SLOW_AFTER_MS),
    }
    slowTimers.set(options, entry)
  }

  function settle(options: object) {
    const entry = slowTimers.get(options)
    if (!entry) {
      return
    }
    clearTimeout(entry.timer)
    if (entry.counted) {
      backend?.slowFinished()
    }
    slowTimers.delete(options)
  }

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    // Server-side rendering only: don't hold the whole page hostage to a
    // sleeping backend. (Not set in the browser - uploads can legitimately
    // take longer.)
    timeout: import.meta.server ? SLOW_AFTER_MS : undefined,
    onRequest({ request, options }) {
      const auth = useAuthStore()
      if (auth.token) {
        const headers = new Headers(options.headers)
        headers.set('Authorization', `Bearer ${auth.token}`)
        options.headers = headers
      }

      // File uploads are slow because of their size, not a sleeping server.
      if (
        import.meta.client &&
        !(options.body instanceof FormData) &&
        !isBackgroundRequest(pathOf(request), options.method)
      ) {
        startSlowTimer(options)
      }
    },
    onResponse({ options }) {
      settle(options)
    },
    // No response at all: timed out (server-side), connection refused, or the
    // network dropped. To the user all of these mean "can't reach the server".
    onRequestError({ options }) {
      settle(options)
      throw createError({
        statusCode: 503,
        statusMessage: WAKING_MESSAGE,
        data: { waking: true },
      })
    },
    onResponseError({ request, options, response }) {
      if (
        response.status === 401 &&
        !is401ExpectedFromUser(request, options.method)
      ) {
        const auth = useAuthStore()
        // Only act if we were actually sending a token. Several requests can
        // fail at once; after the first one logs out, the rest find no token
        // and skip this, so the user is redirected and notified only once.
        if (auth.token) {
          auth.logout()
          useNotifyStore().info('Your session expired. Please log in again.')
          if (import.meta.client) {
            nuxtApp.runWithContext(() => navigateTo('/'))
          }
        }
      }

      const waking = isWakingStatus(response.status)
      const message = waking
        ? WAKING_MESSAGE
        : (response._data && response._data.message) ||
          response.statusText ||
          'Request failed'
      throw createError({
        statusCode: response.status,
        statusMessage: message,
        data: waking ? { waking: true } : response._data,
      })
    },
  })

  return {
    provide: { api },
  }
})
