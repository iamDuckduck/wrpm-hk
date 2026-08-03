export function getNextCarouselIndex(
  currentIndex: number,
  slideCount: number,
  direction: -1 | 1,
) {
  if (slideCount <= 0) {
    return 0
  }

  return (currentIndex + direction + slideCount) % slideCount
}
