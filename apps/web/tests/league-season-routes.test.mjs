import {existsSync, readFileSync} from 'node:fs'
import {describe, expect, it} from 'vitest'

const readSource = (path) =>
  readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8')

describe('localized league season routes', () => {
  it('allows the shared League Overview to fetch a requested season', () => {
    const source = readSource('components/LeagueOverviewPage.astro')

    expect(source).toContain('seasonSlug?: string')
    expect(source).toContain('LEAGUE_SEASON_BY_SLUG_QUERY')
    expect(source).toContain('copy.leagueSeasonSelector')
    expect(source).toContain('currentLeague?.seasons')
  })

  it('generates default-locale season routes from published season slugs', () => {
    const path = 'pages/league/[seasonSlug].astro'

    expect(existsSync(new URL(`../src/${path}`, import.meta.url))).toBe(true)

    const source = readSource(path)
    expect(source).toContain('LEAGUE_SEASON_SLUGS_QUERY')
    expect(source).toContain('getStaticPaths')
    expect(source).toContain('seasonSlug')
  })

  it('generates localized season routes for public locales', () => {
    const path = 'pages/[locale]/league/[seasonSlug].astro'

    expect(existsSync(new URL(`../src/${path}`, import.meta.url))).toBe(true)

    const source = readSource(path)
    expect(source).toContain('PUBLIC_LOCALES')
    expect(source).toContain('getSanityLocaleKey')
    expect(source).toContain('LEAGUE_SEASON_SLUGS_QUERY')
  })
})
