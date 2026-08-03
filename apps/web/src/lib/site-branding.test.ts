import {describe, expect, it, vi} from 'vitest'
import type {SiteSettings} from '../queries/home-page'

vi.stubEnv('SANITY_PROJECT_ID', 'uw34v0nm')
vi.stubEnv('SANITY_DATASET', 'production')
vi.stubEnv('SANITY_API_VERSION', '2026-07-26')

const {resolveSiteBranding} = await import('./site-branding')

const siteSettings: SiteSettings = {
  _id: 'siteSettings',
  organizationName: 'WRPM 香港分部',
  logo: {
    asset: {
      _type: 'reference',
      _ref: 'image-63e50c6cb54821a7550c3670108294ffad221ebb-640x448-webp',
    },
    alt: 'WRPM 標誌',
    crop: null,
    hotspot: null,
  },
}

describe('resolveSiteBranding', () => {
  it('uses the published organization name, logo, and alt text', () => {
    const branding = resolveSiteBranding(siteSettings)

    expect(branding.organizationName).toBe('WRPM 香港分部')
    expect(branding.logoUrl).toContain('w=160')
    expect(branding.logoAlt).toBe('WRPM 標誌')
  })

  it('uses text-only WRPM branding when Site Settings is missing', () => {
    expect(resolveSiteBranding(null)).toEqual({
      organizationName: 'WRPM',
      logoUrl: null,
      logoAlt: '',
    })
  })

  it('treats blank names and missing logo data as absent', () => {
    expect(
      resolveSiteBranding({
        _id: 'siteSettings',
        organizationName: '   ',
        logo: null,
      }),
    ).toEqual({
      organizationName: 'WRPM',
      logoUrl: null,
      logoAlt: '',
    })
  })
})
