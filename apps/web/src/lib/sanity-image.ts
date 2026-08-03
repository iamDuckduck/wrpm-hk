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
