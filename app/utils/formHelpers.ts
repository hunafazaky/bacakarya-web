export function titleRule(value: string) {
  return !!value?.trim() || 'Title is required'
}

// ['a title', 'some content', 'a cover image']
//   -> 'a title, some content and a cover image'
export function joinWithAnd(items: string[]): string {
  if (items.length <= 1) {
    return items.join('')
  }
  return `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`
}
