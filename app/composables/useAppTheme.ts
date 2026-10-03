export function useAppTheme() {
  const theme = useTheme()
  // Explicit user choice, once made, wins over ssrClientHints' own
  // OS-preference detection (which only picks a default before the user
  // has ever chosen). 1 year, since there's no real reason for this to
  // ever expire on its own.
  const stored = useCookie<'light' | 'dark' | null>('bacakarya_theme', {
    default: () => null,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })

  const isDark = computed(() => theme.global.name.value === 'dark')

  function toggle() {
    const next = isDark.value ? 'light' : 'dark'
    theme.change(next)
    stored.value = next
  }

  // Runs during setup (not onMounted) so SSR and the client agree on the
  // very first render - no flash-then-switch.
  function applyStored() {
    if (stored.value) {
      theme.change(stored.value)
    }
  }

  return { isDark, toggle, applyStored }
}
