import type { ApiEnvelope, LoginResponse, User } from '~~/shared/types'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // Deliberately memory-only (not persisted to a cookie/localStorage) -
  // matches the old app's decision: a refresh-token/cookie flow is planned
  // on the backend later, so a page refresh logging you out is expected
  // for now, not a bug.
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isLoggedIn = computed(() => !!user.value)

  async function login (credentials: { username: string, password: string }) {
    const api = useApi()
    const res = await api<ApiEnvelope<LoginResponse>>('/users/login', {
      method: 'POST',
      body: credentials,
    })
    user.value = res.data.user ?? null
    token.value = res.data.token ?? null
  }

  async function register (payload: { username: string, pen_name: string, password: string }) {
    const api = useApi()
    const res = await api<ApiEnvelope<User>>('/users', {
      method: 'POST',
      body: payload,
    })
    return res.data
  }

  function logout () {
    user.value = null
    token.value = null
  }

  return { user, token, isLoggedIn, login, register, logout }
})
