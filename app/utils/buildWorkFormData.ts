export interface WorkFormInput {
  title: string
  text: string
  category: string[]
  coverFile?: File | null
  attachmentFile?: File | null
  attachmentTitle?: string
}

export function buildWorkFormData(input: WorkFormInput): FormData {
  const form = new FormData()
  form.append('title', input.title)
  form.append('text', input.text)
  // Repeated fields - the documented/preferred encoding for an array in
  // multipart/form-data (also accepts a single string or a JSON-encoded
  // array string, but this is what the spec's `encoding` block describes).
  for (const cat of input.category) {
    form.append('category', cat)
  }
  if (input.coverFile) {
    form.append('cover', input.coverFile)
  }
  if (input.attachmentFile) {
    form.append('attachment', input.attachmentFile)
    if (input.attachmentTitle) {
      form.append('attachmentTitle', input.attachmentTitle)
    }
  }
  return form
}

export const COVER_MAX_BYTES = 2 * 1024 * 1024
export const ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024
