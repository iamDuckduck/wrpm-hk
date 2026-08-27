import {readFileSync} from 'node:fs'
import {describe, expect, it} from 'vitest'

const readSource = (path) =>
  readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8')

describe('localized member detail', () => {
  it('generates default and public locale member routes from Sanity slugs', () => {
    expect(readSource('pages/members/[slug].astro')).toContain(
      'MEMBER_SLUGS_QUERY',
    )
    expect(readSource('pages/[locale]/members/[slug].astro')).toContain(
      'PUBLIC_LOCALES',
    )
    expect(readSource('pages/[locale]/members/[slug].astro')).toContain(
      '<MemberDetailPage locale={locale} slug={slug} />',
    )
  })

  it('renders the profile, media links, and not-found state without biography', () => {
    const source = readSource('components/MemberDetailPage.astro')

    expect(source).toContain('MEMBER_BY_SLUG_QUERY')
    expect(source).not.toContain('member.biography')
    expect(source).not.toContain('copy.memberBiography')
    expect(source).toContain('member.mediaLinks')
    expect(source).toContain('copy.memberNotFound')
    expect(source).toContain('copy.backToMembers')
  })

  it('keeps the profile image centered and aligns identity information left below it', () => {
    const source = readSource('components/MemberDetailPage.astro')

    expect(source).toMatch(
      /\.member-detail__header\s*\{[\s\S]*?display:\s*flex[\s\S]*?align-items:\s*center/s,
    )
    expect(source).toMatch(
      /\.member-detail__heading\s*\{[\s\S]*?align-items:\s*flex-start[\s\S]*?text-align:\s*left/s,
    )
  })

  it('uses a single small-red heading for related links', () => {
    const source = readSource('components/MemberDetailPage.astro')

    expect(source).toContain(
      '<h2 id="member-links-title" class="member-detail__label">{copy.memberLinks}</h2>',
    )
    expect(source).not.toContain(
      '<p class="member-detail__label">{copy.memberLinks}</p>',
    )
    expect(source).not.toContain('<h2 id="member-links-title">{copy.memberLinks}</h2>')
    expect(source).not.toMatch(/\.member-detail__section h2\s*\{/)
  })
})
