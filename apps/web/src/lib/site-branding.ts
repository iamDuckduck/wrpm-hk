import type {SiteSettings} from '../queries/home-page'
import {buildSanityImageUrl} from './sanity-image'

export type SiteBranding = {
  organizationName: string
  logoUrl: string | null
  logoAlt: string
}

export function resolveSiteBranding(
  siteSettings: SiteSettings | null,
): SiteBranding {
  return {
    organizationName: siteSettings?.organizationName?.trim() || 'WRPM',
    logoUrl: buildSanityImageUrl(siteSettings?.logo, {width: 160}),
    logoAlt: siteSettings?.logo?.alt?.trim() || '',
  }
}
