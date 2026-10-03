// Asks the API whether it is awake yet, every few seconds, and calls
// `onReady` once it answers. Uses a plain $fetch (not useApi) so these pings
// don't feed the slow-request tracking themselves.
export function useWakeUpPoll(options: {
  onReady: () => void
  intervalMs?: number
}) {
  const config = useRuntimeConfig()
  let timer: ReturnType<typeof setInterval> | undefined
  let busy = false

  async function ping(): Promise<boolean> {
    try {
      await $fetch('/works', {
        baseURL: config.public.apiBase,
        params: { limit: 1 },
        timeout: 8000,
        retry: 0,
      })
      return true
    } catch {
      return false
    }
  }

  onMounted(() => {
    timer = setInterval(async () => {
      if (busy) {
        return
      }
      busy = true
      const ok = await ping()
      busy = false
      if (ok) {
        clearInterval(timer)
        options.onReady()
      }
    }, options.intervalMs ?? 3000)
  })
  onBeforeUnmount(() => clearInterval(timer))
}
