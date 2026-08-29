export function cleanScore(value: number): number {
  return Number(value.toFixed(10))
}

export function formatScore(score: number, signed = false): string {
  const cleaned = cleanScore(score)
  const text = String(cleaned)
  return signed && cleaned > 0 ? `+${text}` : text
}
