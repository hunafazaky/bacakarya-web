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
