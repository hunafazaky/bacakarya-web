// Seconds since the component mounted (client only).
export function useElapsedSeconds() {
  const seconds = ref(0)
  let timer: ReturnType<typeof setInterval> | undefined

  onMounted(() => {
    timer = setInterval(() => {
      seconds.value += 1
    }, 1000)
  })
  onBeforeUnmount(() => clearInterval(timer))

  return seconds
}
