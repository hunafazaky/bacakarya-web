// Usage: const api = useApi(); const res = await api<ApiEnvelope<User>>('/users/' + id)
export function useApi () {
  const { $api } = useNuxtApp()
  return $api
}
