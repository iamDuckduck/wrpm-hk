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

  it('derives standings without adding a separate public schedule page', () => {
    const source = readSource('components/LeagueOverviewPage.astro')

    expect(source).toContain('CURRENT_LEAGUE_QUERY')
    expect(source).toContain('calculateLeagueStandings')
    expect(source).toContain('standing.rank')
    expect(source).toContain('copy.leagueRanking')
    expect(source).toContain('copy.leagueNoRankings')
    expect(source).not.toContain('LeagueSchedulePage')
  })

  it('renders completed match results inside the league overview', () => {
    const source = readSource('components/LeagueOverviewPage.astro')

    expect(source).toContain('league-overview__results')
    expect(source).toContain('copy.leagueResults')
    expect(source).toContain('currentLeague.matches')
    expect(source).toContain('buildSanityImageUrl')
  })
})
