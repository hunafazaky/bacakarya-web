// A preview URL for a user-picked file. Every createObjectURL call pins the
// file in memory until it is revoked, so this revokes the previous URL when
// the file changes and the last one when the component unmounts. (The old
// approach created a URL inside a computed and only ever revoked the final
// one, leaking one per cover the user picked.)
export function useObjectUrl(source: () => File | File[] | null | undefined) {
  const url = ref<string | null>(null)

  function revoke() {
    if (url.value) {
      URL.revokeObjectURL(url.value)
      url.value = null
    }
  }

  watch(source, (value) => {
    revoke()
    const file = Array.isArray(value) ? value[0] : value
    if (file) {
      url.value = URL.createObjectURL(file)
    }
  })

  onBeforeUnmount(revoke)

  return url
}
