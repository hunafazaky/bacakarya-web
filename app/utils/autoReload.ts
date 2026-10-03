// The startup page reloads itself once the server answers. If the reload
// keeps landing on the same error (e.g. the server is up but something else
// is wrong), that would loop forever - so allow only a few automatic reloads
// per minute, then fall back to a manual button.
const KEY = 'bacakarya_auto_reloads'

export function reserveAutoReload(max = 3, windowMs = 60_000): boolean {
  try {
    const now = Date.now()
    const recent = (
      JSON.parse(sessionStorage.getItem(KEY) || '[]') as number[]
    ).filter((t) => now - t < windowMs)
    if (recent.length >= max) {
      return false
    }
    sessionStorage.setItem(KEY, JSON.stringify([...recent, now]))
    return true
  } catch {
    // Storage blocked: we can't guard against a loop, so don't auto-reload.
    return false
  }
}
