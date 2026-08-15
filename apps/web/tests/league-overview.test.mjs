import {readFileSync} from 'node:fs'
import {describe, expect, it} from 'vitest'

const readSource = (path) =>
  readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8')

describe('localized league overview', () => {
  it('uses one shared page for the default and public locale routes', () => {
    expect(readSource('pages/league/index.astro')).toContain(
      '<LeagueOverviewPage locale="zh-HK" />',
    )
    expect(readSource('pages/[locale]/league.astro')).toContain(
      '<LeagueOverviewPage locale={locale} />',
    )
  })

  it('derives and renders standings without exposing a public schedule', () => {
    const source = readSource('components/LeagueOverviewPage.astro')

    expect(source).toContain('CURRENT_LEAGUE_QUERY')
    expect(source).toContain('calculateLeagueStandings')
    expect(source).toContain('standing.rank')
    expect(source).toContain('copy.leagueRanking')
    expect(source).toContain('copy.leagueNoRankings')
    expect(source).not.toContain('scheduledAt')
  })
})
