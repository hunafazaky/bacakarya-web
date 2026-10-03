// The backend runs on a free hosting plan that goes to sleep when idle, and
// the first request after that can take up to a minute. After this long
// without an answer we stop showing a blank/frozen page and explain what is
// happening instead (client: overlay, see ServerWakingOverlay; server-side
// render: the startup page in error.vue).
export const SLOW_AFTER_MS = 3000

export const WAKING_MESSAGE =
  'The server is starting up. Please try again in a moment.'

// Errors thrown by the API plugin for "server asleep / unreachable" carry
// `data.waking = true`, so callers can tell them apart from real failures.
export function isBackendWaking(error: unknown): boolean {
  return (
    (error as { data?: { waking?: boolean } } | null | undefined)?.data
      ?.waking === true
  )
}

// Gateway statuses a sleeping/restarting host answers with.
export function isWakingStatus(status: number): boolean {
  return [502, 503, 504].includes(status)
}

// Requests the user isn't waiting on must not throw the full-screen startup
// page over what they are looking at: the read counter ping, and the
// recommendations section (optional, and can be slow even on a warm server).
export function isBackgroundRequest(path: string, method?: string): boolean {
  const verb = (method ?? 'GET').toUpperCase()
  if (verb === 'POST') {
    return /\/works\/[^/]+\/read$/.test(path)
  }
  return verb === 'GET' && /\/recommendations\/[^/]+$/.test(path)
}
