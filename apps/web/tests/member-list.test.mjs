import {readFileSync} from 'node:fs'
import {describe, expect, it} from 'vitest'

const readSource = (path) =>
  readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8')

describe('localized member list', () => {
  it('uses one shared member list page for the default and public locale routes', () => {
    expect(readSource('pages/members/index.astro')).toContain(
      '<MemberListPage locale="zh-HK" />',
    )
    expect(readSource('pages/[locale]/members.astro')).toContain(
      '<MemberListPage locale={locale} />',
    )
  })

  it('fetches localized active members and renders an intentional empty state', () => {
    const source = readSource('components/MemberListPage.astro')

    expect(source).toContain('MEMBER_LIST_QUERY')
    expect(source).toContain('getSanityLocaleKey(locale)')
    expect(source).toContain('members.length > 0')
    expect(source).toContain('copy.memberListEmpty')
  })

  it('renders CMS members page title and description', () => {
    const source = readSource('components/MemberListPage.astro')

    expect(source).toContain('MEMBERS_PAGE_QUERY')
    expect(source).toContain('membersPage?.title?.trim()')
    expect(source).toContain('membersPage?.description?.trim()')
    expect(source).not.toContain('copy.memberListTitle')
    expect(source).not.toContain('copy.memberListDescription')
  })
})
