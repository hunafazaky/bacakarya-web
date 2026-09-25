import type { ApiEnvelope, ApiListEnvelope, PopulatedWork } from '~~/shared/types'
import { defineStore } from 'pinia'

export const useWorksStore = defineStore('works', () => {
  // Current single work being read, kept in store so a like/read/rating
  // action can update it in place without a second round-trip.
  const current = ref<PopulatedWork | null>(null)

  async function fetchList (params: { page?: number, limit?: number, category?: string, title?: string } = {}) {
    const api = useApi()
    const res = await api<ApiListEnvelope<PopulatedWork>>('/works', {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 12,
        category: params.category || undefined,
        title: params.title || undefined,
      },
    })
    return { works: res.data, total: res.meta?.total ?? 0 }
  }

  async function fetchRecommendations (userId: string) {
    const api = useApi()
    const res = await api<ApiListEnvelope<PopulatedWork>>(`/recommendations/${userId}`)
    return res.data
  }

  async function fetchById (id: string) {
    const api = useApi()
    const res = await api<ApiEnvelope<PopulatedWork>>(`/works/${id}`)
    current.value = res.data
    return res.data
  }

  async function markRead (id: string) {
    const api = useApi()
    const res = await api<ApiEnvelope<PopulatedWork>>(`/works/${id}/read`, { method: 'POST' })
    if (current.value?.id === id) {
      current.value = res.data
    }
    return res.data
  }

  async function like (id: string) {
    const api = useApi()
    const res = await api<ApiEnvelope<PopulatedWork>>(`/works/${id}/like`, { method: 'POST' })
    if (current.value?.id === id) {
      current.value = res.data
    }
    return res.data
  }

  async function unlike (id: string) {
    const api = useApi()
    const res = await api<ApiEnvelope<PopulatedWork>>(`/works/${id}/like`, { method: 'DELETE' })
    if (current.value?.id === id) {
      current.value = res.data
    }
    return res.data
  }

  async function rate (workId: string, userId: string, rating: number) {
    const api = useApi()
    await api('/recommendations', {
      method: 'PUT',
      body: { work_id: workId, user_id: userId, rating },
    })
  }

  async function remove (id: string) {
    const api = useApi()
    await api(`/works/${id}`, { method: 'DELETE' })
  }

  return {
    current,
    fetchList,
    fetchRecommendations,
    fetchById,
    markRead,
    like,
    unlike,
    rate,
    remove,
  }
})
