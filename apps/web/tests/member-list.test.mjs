import {readFileSync} from 'node:fs'
import {describe, expect, it} from 'vitest'

const readSource = (path) =>
  readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8')

describe('localized member list', () => {
  it('uses one shared member list page for the default and public locale routes', () => {
    expect(readSource('pages/members/index.astro')).toContain(
      '<MemberListPage locale="en" />',
    )
    expect(readSource('pages/[locale]/members.astro')).toContain(
      '<MemberListPage locale={locale} />',
    )
  })

  it('fetches localized active members and renders an intentional empty state', () => {
    const source = readSource('components/MemberListPage.astro')

    expect(source).toContain('MEMBER_LIST_QUERY')
    expect(source).toContain('getSanityLocaleKey(locale)')
    expect(source).toContain('sortedMembers.length > 0')
    expect(source).toContain('copy.memberListEmpty')
  })

  it('sorts by English name and omits biography previews', () => {
    const source = readSource('components/MemberListPage.astro')
    const query = readSource('queries/members.ts')

    expect(source).toContain('sort(compareMembersByEnglishName)')
    expect(source).not.toContain('member.intro')
    expect(query).toContain('"englishName": name.en')
    const listFields = query.split('const MEMBER_DETAIL_FIELDS')[0]
    expect(listFields).not.toContain('"intro"')
  })

  it('uses 9:13 portraits without cropping their logos', () => {
    const source = readSource('components/MemberListPage.astro')

    expect(source).toContain('aspect-ratio: 9 / 13')
    expect(source).toContain('object-fit: contain')
  })

  it('renders CMS members page title and description', () => {
    const source = readSource('components/MemberListPage.astro')

    expect(source).toContain('MEMBERS_PAGE_QUERY')
    expect(source).toContain('membersPage?.title?.trim()')
    expect(source).toContain('hasRichText(description)')
    expect(source).toContain('<RichText class="member-list-page__description"')
    expect(source).not.toContain('copy.memberListTitle')
    expect(source).not.toContain('copy.memberListDescription')
  })
})
