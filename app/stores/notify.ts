import { defineStore } from 'pinia'

// One app-wide snackbar (rendered in layouts/default.vue). Lets any store,
// plugin or page surface a short message - e.g. a failed request that used
// to fail silently - without each page building its own alert.
export const useNotifyStore = defineStore('notify', () => {
  const show = ref(false)
  const message = ref('')
  const color = ref<'error' | 'info' | 'success'>('info')

  function notify(text: string, kind: 'error' | 'info' | 'success') {
    // Re-open cleanly if a previous message is still showing.
    show.value = false
    message.value = text
    color.value = kind
    show.value = true
  }

  // Report a failed request with a friendly fallback message. A 401 is
  // skipped on purpose: the API plugin already logged the user out and
  // showed "session expired", and this message would replace it.
  function fail(error_: unknown, fallback: string) {
    if ((error_ as { statusCode?: number } | null)?.statusCode === 401) {
      return
    }
    notify(fallback, 'error')
  }

  return {
    show,
    fail,
    message,
    color,
    error: (text: string) => notify(text, 'error'),
    info: (text: string) => notify(text, 'info'),
    success: (text: string) => notify(text, 'success'),
  }
})
