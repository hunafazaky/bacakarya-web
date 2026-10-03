import type { ApiEnvelope, LoginResponse, User } from '~~/shared/types'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // The backend's JWT has a 7-day expiry and no refresh-token flow yet, so
  // this is the best available option in the meantime: a plain (not
  // httpOnly - can't be, since bacakarya-api is a separate origin that
  // returns the token as JSON rather than a Set-Cookie header, so only
  // client JS can store it at all) cookie, matching the token's own
  // lifetime. Readable by JS same as localStorage would be, but works
  // during SSR too and carries an explicit expiry.
  // Previously this was memory-only by deliberate choice (see project
  // history); that traded away "stay logged in on refresh" for simplicity
  // while a real refresh-token/cookie flow was pending on the backend -
  // superseded now that staying logged in matters more than that trade.
  // `secure` only when the page itself is served over HTTPS: browsers drop a
  // Secure cookie on plain http, which would silently break staying logged
  // in on an http deployment. (On localhost browsers allow Secure either
  // way, but there is nothing to protect there.)
  const isHttps = import.meta.client
    ? window.location.protocol === 'https:'
    : useRequestURL().protocol === 'https:'
  const token = useCookie<string | null>('bacakarya_token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: isHttps,
    default: () => null,
  })
  const user = ref<User | null>(null)

  const isLoggedIn = computed(() => !!user.value)

  async function login(credentials: { username: string; password: string }) {
    const api = useApi()
    const res = await api<ApiEnvelope<LoginResponse>>('/users/login', {
      method: 'POST',
      body: credentials,
    })
    user.value = res.data.user ?? null
    token.value = res.data.token ?? null
  }

  async function register(payload: {
    username: string
    pen_name: string
    password: string
  }) {
    const api = useApi()
    const res = await api<ApiEnvelope<User>>('/users', {
      method: 'POST',
      body: payload,
    })
    return res.data
  }

  function logout() {
    user.value = null
    token.value = null
    // Don't keep the last-read work around for whoever uses this browser
    // next (it also carries the like/read state of the old session).
    useWorksStore().current = null
  }

  // DELETE /users/{id} requires the current password as a second
  // confirmation factor for this irreversible action (bearer auth alone
  // isn't enough). Throws (with statusCode 401) on a wrong
  // password; the caller is expected to show that inline.
  async function deleteAccount(password: string) {
    const currentUser = user.value
    if (!currentUser) {
      return
    }
    const api = useApi()
    await api(`/users/${currentUser.id}`, {
      method: 'DELETE',
      body: { password },
    })
    logout()
  }

  // PUT /users/{id}: only pen_name and photo can be changed, and `photo` is
  // a link - the API has no profile-photo upload. Only the fields passed are
  // sent. The response carries every list populated, which we don't need
  // here, so just the two editable fields are merged into the user we have.
  async function updateProfile(changes: { pen_name?: string; photo?: string }) {
    const currentUser = user.value
    if (!currentUser) {
      return
    }
    const api = useApi()
    const res = await api<ApiEnvelope<User>>(`/users/${currentUser.id}`, {
      method: 'PUT',
      body: changes,
    })
    user.value = {
      ...currentUser,
      pen_name: res.data?.pen_name ?? changes.pen_name ?? currentUser.pen_name,
      photo: res.data?.photo ?? changes.photo ?? currentUser.photo,
    }
  }

  // Called once on app boot (see plugins/02.restore-session.ts). If a token
  // cookie survived a refresh but we don't have the user in memory yet,
  // decode the token just far enough to get the user id (no signature
  // verification needed client-side - the server verifies it on every
  // real request regardless) and refetch the full user.
  async function restoreSession() {
    if (user.value || !token.value) {
      return
    }
    const payload = decodeJwtPayload(token.value)
    if (!payload?.id) {
      logout()
      return
    }
    try {
      const api = useApi()
      const res = await api<ApiEnvelope<User>>(`/users/${payload.id}`)
      user.value = res.data
    } catch (error_: any) {
      // Server asleep or unreachable: we can't tell whether the user is
      // logged in, and showing the login page would be misleading. Rethrow so
      // the app shows the startup page (error.vue), which reloads once the
      // server is back.
      if (isBackendWaking(error_)) {
        throw error_
      }
      // Only log out when the server says the token/account is really bad.
      // Other failures say nothing about the token - clearing the cookie
      // then would sign users out over a blip. They stay on the login screen
      // for this load, and the next load retries.
      if ([401, 403, 404].includes(error_?.statusCode)) {
        logout()
      }
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    login,
    register,
    logout,
    restoreSession,
    deleteAccount,
    updateProfile,
  }
})
