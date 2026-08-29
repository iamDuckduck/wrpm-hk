import {describe, expect, it} from 'vitest'
import {cleanScore, formatScore} from './format-score'

describe('cleanScore', () => {
  it('snaps IEEE 754 ranking totals to the intended decimal', () => {
    expect(cleanScore(-10.600000000000001)).toBe(-10.6)
    expect(cleanScore(-33.599999999999994)).toBe(-33.6)
    expect(cleanScore(0.1 + 0.2)).toBe(0.3)
  })

  it('leaves integers unchanged', () => {
    expect(cleanScore(32)).toBe(32)
  })
})

describe('formatScore', () => {
  it('renders ranking totals without floating-point artifacts or trailing zeros', () => {
    expect(formatScore(-10.600000000000001)).toBe('-10.6')
    expect(formatScore(-33.599999999999994)).toBe('-33.6')
    expect(formatScore(32)).toBe('32')
    expect(formatScore(11.2)).toBe('11.2')
  })

  it('prefixes a plus sign for positive match scores when signed', () => {
    expect(formatScore(8.4, true)).toBe('+8.4')
    expect(formatScore(0, true)).toBe('0')
    expect(formatScore(-7, true)).toBe('-7')
  })
})
