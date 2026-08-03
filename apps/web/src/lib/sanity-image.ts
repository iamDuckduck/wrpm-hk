import {
  createImageUrlBuilder,
  type SanityImageSource,
} from '@sanity/image-url'
import {sanityConfig} from './sanity'

const imageBuilder = createImageUrlBuilder(sanityConfig)

type ImageUrlOptions = {
  width: number
}

export function buildSanityImageUrl(
  source: SanityImageSource | null | undefined,
  {width}: ImageUrlOptions,
) {
  if (!source || (typeof source === 'object' && !('asset' in source))) {
    return null
  }

  return imageBuilder
    .image(source)
    .width(width)
    .fit('max')
    .auto('format')
    .url()
}

export function buildSanityImageSrcSet(
  source: SanityImageSource | null | undefined,
  widths: number[],
) {
  const entries = widths
    .map((width) => {
      const url = buildSanityImageUrl(source, {width})
      return url ? `${url} ${width}w` : null
    })
    .filter((entry): entry is string => entry !== null)

  return entries.length > 0 ? entries.join(', ') : null
}
