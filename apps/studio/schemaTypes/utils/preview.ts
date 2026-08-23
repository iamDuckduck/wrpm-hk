export function firstPreviewText(...values: unknown[]): string | undefined {
  return values.find(
    (value): value is string => typeof value === 'string' && value.trim().length > 0,
  )?.trim()
}

export function joinPreviewParts(...parts: Array<string | number | undefined>): string {
  return parts
    .filter((part): part is string | number => part !== undefined && part !== '')
    .join(' · ')
}

export function formatPreviewDate(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined

  return date.toISOString().slice(0, 10)
}
