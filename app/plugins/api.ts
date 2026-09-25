// A single configured `$fetch` instance for every call to bacakarya-api.
// - baseURL comes from runtimeConfig.public.apiBase (NUXT_PUBLIC_API_BASE)
// - attaches `Authorization: Bearer <token>` from the auth store when present
// - every bacakarya-api error response is { data: null, message } - this
//   surfaces `message` directly on thrown errors instead of a generic
//   "Request failed" string
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest ({ options }) {
      const auth = useAuthStore()
      if (auth.token) {
        const headers = new Headers(options.headers)
        headers.set('Authorization', `Bearer ${auth.token}`)
        options.headers = headers
      }
    },
    onResponseError ({ response }) {
      const message
        = (response._data && response._data.message) || response.statusText || 'Request failed'
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
