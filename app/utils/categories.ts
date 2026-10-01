// There is no /categories endpoint in bacakarya-api - the classifier
// suggests one automatically server-side on work creation (prepended to
// whatever the author picks), but there's nowhere to fetch a canonical
// list from. This mirrors the old app's hardcoded list. Update here if
// the set of categories changes; there's no other source of truth.
export const CATEGORIES = [
  'Teknologi',
  'Kesehatan',
  'Olahraga',
  'Travel',
  'Otomotif',
] as const

export type Category = (typeof CATEGORIES)[number]

// The values above are what the API stores and filters by, so they must stay
// as-is. Only the text shown in the UI is translated, via this map. Unknown
// categories (e.g. ones the classifier might add) fall back to the raw value.
const CATEGORY_LABELS: Record<string, string> = {
  Teknologi: 'Technology',
  Kesehatan: 'Health',
  Olahraga: 'Sports',
  Travel: 'Travel',
  Otomotif: 'Automotive',
}

export function categoryLabel(category?: string): string {
  if (!category) {
    return ''
  }
  return CATEGORY_LABELS[category] ?? category
}

// For v-select: `title` is displayed, `value` is what gets stored/sent.
export const CATEGORY_ITEMS = CATEGORIES.map((value) => ({
  title: categoryLabel(value),
  value,
}))
