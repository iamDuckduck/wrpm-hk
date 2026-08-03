import {describe, expect, it, vi} from 'vitest'

vi.stubEnv('SANITY_PROJECT_ID', 'uw34v0nm')
vi.stubEnv('SANITY_DATASET', 'production')
vi.stubEnv('SANITY_API_VERSION', '2026-07-26')

const {buildSanityImageSrcSet, buildSanityImageUrl} = await import('./sanity-image')

const image = {
  asset: {
    _type: 'reference' as const,
    _ref: 'image-63e50c6cb54821a7550c3670108294ffad221ebb-640x448-webp',
  },
}

describe('buildSanityImageUrl', () => {
  it('returns null when the image has no asset reference', () => {
    expect(buildSanityImageUrl(null, {width: 640})).toBeNull()
    expect(buildSanityImageUrl({}, {width: 640})).toBeNull()
  })

  it('requests an optimized image at the requested width', () => {
    const url = buildSanityImageUrl(image, {width: 640})

    expect(url).toContain('/images/uw34v0nm/production/')
    expect(url).toContain('w=640')
    expect(url).toContain('fit=max')
    expect(url).toContain('auto=format')
  })

  it('produces distinct URLs for responsive widths', () => {
    const small = buildSanityImageUrl(image, {width: 480})
    const large = buildSanityImageUrl(image, {width: 1280})

    expect(small).not.toBe(large)
    expect(small).toContain('w=480')
    expect(large).toContain('w=1280')
  })

  it('builds a responsive srcset with width descriptors', () => {
    const srcSet = buildSanityImageSrcSet(image, [480, 960])

    expect(srcSet).toContain('w=480&fit=max&auto=format 480w')
    expect(srcSet).toContain('w=960&fit=max&auto=format 960w')
  })
})
