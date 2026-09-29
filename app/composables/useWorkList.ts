import type { PopulatedWork } from '~~/shared/types'

export function useWorkList(getCategory?: () => string | undefined) {
  const works = ref<PopulatedWork[]>([])
  const page = ref(1)
  const limit = 12
  const total = ref(0)
  const loading = ref(true)
  const worksStore = useWorksStore()

  async function fetchWorks() {
    loading.value = true
    try {
      const { works: fetched, total: fetchedTotal } =
        await worksStore.fetchList({
          page: page.value,
          limit,
          category: getCategory?.(),
        })
      works.value.push(...fetched)
      total.value = fetchedTotal
    } finally {
      loading.value = false
    }
  }

  async function loadMore() {
    if (works.value.length >= total.value) {
      return
    }
    page.value += 1
    await fetchWorks()
  }

  function reset() {
    page.value = 1
    works.value = []
    fetchWorks()
  }

  function handleScroll() {
    const nearBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.offsetHeight - 200
    if (nearBottom && !loading.value) {
      loadMore()
    }
  }

  async function deleteWork(id: string) {
    await worksStore.remove(id)
    works.value = works.value.filter((w) => w.id !== id)
    total.value = Math.max(0, total.value - 1)
  }

  onMounted(() => {
    fetchWorks()
    window.addEventListener('scroll', handleScroll)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return { works, total, loading, reset, deleteWork }
}
