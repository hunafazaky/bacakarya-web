// Tiptap's getHTML() returns '<p></p>' for an empty editor, which is a
// truthy string - so `!!text` would let an empty work be published. This
// checks for actual content instead (no DOM needed, so it is SSR-safe).
export function isRichTextEmpty(html: string | null | undefined): boolean {
  if (!html) {
    return true
  }
  return (
    html
      .replaceAll(/<[^>]*>/g, '')
      .replaceAll(/&nbsp;|&#160;/gi, ' ')
      .trim() === ''
  )
}
