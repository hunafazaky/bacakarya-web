export function decodeJwtPayload(token: string): { id?: string } | null {
  try {
    const payload = token.split('.', 2)[1]
    if (!payload) {
      return null
    }
    // base64url -> base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json =
      typeof window === 'undefined'
        ? Buffer.from(base64, 'base64').toString('utf8')
        : decodeURIComponent(
            atob(base64)
              .split('')
              .map(
                (c) =>
                  '%' + (c.codePointAt(0) ?? 0).toString(16).padStart(2, '0')
              )
              .join('')
          )
    return JSON.parse(json)
  } catch {
    return null
  }
}
