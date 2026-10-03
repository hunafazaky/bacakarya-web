import { defineStore } from 'pinia'

// Tracks whether the backend seems to be asleep: true while any request has
// been waiting longer than SLOW_AFTER_MS. Drives the startup overlay.
export const useBackendStore = defineStore('backend', () => {
  const slowRequests = ref(0)
  const waking = computed(() => slowRequests.value > 0)

  function slowStarted() {
    slowRequests.value += 1
  }
  function slowFinished() {
    slowRequests.value = Math.max(0, slowRequests.value - 1)
  }

  return { slowRequests, waking, slowStarted, slowFinished }
})
