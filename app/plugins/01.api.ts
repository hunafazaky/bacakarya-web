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
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  // For these, a 401 means "wrong password", not "expired session":
  // - POST /users/login (bad credentials)
  // - DELETE /users/{id} (password re-confirmation for account deletion)
  function is401ExpectedFromUser(request: unknown, method?: string) {
    const url = String(
      typeof request === 'string' ? request : ((request as Request)?.url ?? '')
    )
    const path = url.split('?', 1)[0] ?? ''
    const verb = (method || 'GET').toUpperCase()
    if (path.endsWith('/users/login')) {
      return true
    }
    return verb === 'DELETE' && /\/users\/[^/]+$/.test(path)
  }

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      const auth = useAuthStore()
      if (auth.token) {
        const headers = new Headers(options.headers)
        headers.set('Authorization', `Bearer ${auth.token}`)
        options.headers = headers
      }
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

      const message =
        (response._data && response._data.message) ||
        response.statusText ||
        'Request failed'
      throw createError({
        statusCode: response.status,
        statusMessage: message,
        data: response._data,
      })
    },
  })

  return {
    provide: { api },
  }
})
