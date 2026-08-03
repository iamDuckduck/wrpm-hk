import {describe, expect, it} from 'vitest'
import {getNextCarouselIndex} from './carousel'

describe('getNextCarouselIndex', () => {
  it('wraps forward from the last slide to the first', () => {
    expect(getNextCarouselIndex(2, 3, 1)).toBe(0)
  })

  it('wraps backward from the first slide to the last', () => {
    expect(getNextCarouselIndex(0, 3, -1)).toBe(2)
  })

  it('keeps a one-slide carousel on its only slide', () => {
    expect(getNextCarouselIndex(0, 1, 1)).toBe(0)
    expect(getNextCarouselIndex(0, 1, -1)).toBe(0)
  })

  it('returns the safe empty-state index when there are no slides', () => {
    expect(getNextCarouselIndex(0, 0, 1)).toBe(0)
  })
})
