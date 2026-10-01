import type { PopulatedWork } from '~~/shared/types'

export function useWorkList(getCategory?: () => string | undefined) {
  const works = ref<PopulatedWork[]>([])
  // Number of pages loaded so far (0 = nothing loaded yet). Only advanced
  // after a page actually arrives, so a failed request is retried as-is
  // instead of silently skipping that page.
  const page = ref(0)
  const limit = 12
  const total = ref(0)
  const loading = ref(true)
  // True after a failed request. Auto-loading pauses until `retry()` or
  // `reset()` so a dead network doesn't fire a request on every scroll.
  const error = ref(false)
  const worksStore = useWorksStore()

  // Bumped by reset()/unmount. A response that belongs to an older
  // generation is discarded, so switching category quickly can't mix the
  // previous category's results into the new list.
  let generation = 0
  let filling = false

  const hasMore = computed(() => page.value * limit < total.value)

  // Fetches the next page. Never throws: failures set `error` instead.
  async function fetchNext(): Promise<boolean> {
    const gen = generation
    const nextPage = page.value + 1
    loading.value = true
    error.value = false
    try {
      const { works: fetched, total: fetchedTotal } =
        await worksStore.fetchList({
          page: nextPage,
          limit,
          category: getCategory?.(),
        })
      if (gen !== generation) {
        return false
      }
      // Items added/removed while paging can shift page boundaries and
      // repeat an item; skip ones we already have (duplicate v-for keys).
      const seen = new Set(works.value.map((w) => w.id))
      works.value.push(...fetched.filter((w) => !seen.has(w.id)))
      total.value = fetchedTotal
      page.value = nextPage
      return true
    } catch {
      if (gen === generation) {
        error.value = true
      }
      return false
    } finally {
      if (gen === generation) {
        loading.value = false
      }
    }
  }

  function nearBottom() {
    return (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 200
    )
  }

  // Waits for freshly added cards to render, so height checks are accurate.
  async function settle() {
    await nextTick()
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve())
    })
  }

  // Loads pages while the user is near the bottom. Because it re-checks
  // after every page, it also keeps going when the first pages don't fill
  // the screen (tall monitors) - a scroll listener alone would never fire
  // there, since there is nothing to scroll.
  async function loadMoreIfNeeded() {
    if (filling) {
      return
    }
    filling = true
    const gen = generation
    try {
      while (true) {
        await settle()
        if (
          gen !== generation ||
          !hasMore.value ||
          loading.value ||
          error.value ||
          !nearBottom()
        ) {
          break
        }
        if (!(await fetchNext())) {
          break
        }
      }
    } finally {
      // A newer generation (after reset) owns the flag now.
      if (gen === generation) {
        filling = false
      }
    }
  }

  async function start() {
    await fetchNext()
    await loadMoreIfNeeded()
  }

  function reset() {
    generation += 1
    page.value = 0
    total.value = 0
    works.value = []
    error.value = false
    loading.value = true
    filling = false
    start()
  }

  // Retry after a failure (first page or a later one).
  async function retry() {
    if (page.value === 0) {
      await start()
    } else {
      error.value = false
      await loadMoreIfNeeded()
    }
  }

  async function deleteWork(id: string) {
    await worksStore.remove(id)
    works.value = works.value.filter((w) => w.id !== id)
    total.value = Math.max(0, total.value - 1)
  }

  function onViewportChange() {
    loadMoreIfNeeded()
  }

  onMounted(() => {
    start()
    window.addEventListener('scroll', onViewportChange, { passive: true })
    window.addEventListener('resize', onViewportChange, { passive: true })
  })
  onBeforeUnmount(() => {
    generation += 1
    window.removeEventListener('scroll', onViewportChange)
    window.removeEventListener('resize', onViewportChange)
  })

  return { works, total, loading, error, reset, retry, deleteWork }
}
