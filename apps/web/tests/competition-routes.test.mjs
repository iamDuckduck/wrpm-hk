import {existsSync, readFileSync} from 'node:fs'
import {describe, expect, it} from 'vitest'

const readSource = (path) =>
  readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8')

const expectRoute = (path, snippets) => {
  expect(existsSync(new URL(`../src/${path}`, import.meta.url))).toBe(true)
  const source = readSource(path)

  for (const snippet of snippets) expect(source).toContain(snippet)
}

describe('localized competition routes', () => {
  it('generates the default current competition overview from competition slugs', () => {
    expectRoute('pages/competitions/[competitionSlug].astro', [
      'COMPETITION_SLUGS_QUERY',
      'getStaticPaths',
      'competitionSlug',
      '<CompetitionOverviewPage',
      'locale="zh-HK"',
    ])
  })

  it('generates localized current competition overview routes', () => {
    expectRoute('pages/[locale]/competitions/[competitionSlug].astro', [
      'PUBLIC_LOCALES',
      'COMPETITION_SLUGS_QUERY',
      'getStaticPaths',
      'competitionSlug',
      '<CompetitionOverviewPage',
      'locale={locale}',
    ])
  })

  it('generates default historical competition overview routes scoped by both slugs', () => {
    expectRoute('pages/competitions/[competitionSlug]/[seasonSlug].astro', [
      'COMPETITION_SEASON_SLUGS_QUERY',
      'getStaticPaths',
      'competitionSlug',
      'seasonSlug',
      '<CompetitionOverviewPage',
      'locale="zh-HK"',
    ])
  })

  it('generates localized historical competition overview routes', () => {
    expectRoute('pages/[locale]/competitions/[competitionSlug]/[seasonSlug].astro', [
      'PUBLIC_LOCALES',
      'COMPETITION_SEASON_SLUGS_QUERY',
      'getStaticPaths',
      'competitionSlug',
      'seasonSlug',
      '<CompetitionOverviewPage',
      'locale={locale}',
    ])
  })

  it('generates default and localized completed-match routes for the selected season', () => {
    expectRoute('pages/competitions/[competitionSlug]/[seasonSlug]/matches.astro', [
      'COMPETITION_SEASON_SLUGS_QUERY',
      'getStaticPaths',
      'competitionSlug',
      'seasonSlug',
      '<CompetitionMatchesPage',
      'locale="zh-HK"',
    ])
    expectRoute('pages/[locale]/competitions/[competitionSlug]/[seasonSlug]/matches.astro', [
      'PUBLIC_LOCALES',
      'COMPETITION_SEASON_SLUGS_QUERY',
      'getStaticPaths',
      'competitionSlug',
      'seasonSlug',
      '<CompetitionMatchesPage',
      'locale={locale}',
    ])
  })
})
