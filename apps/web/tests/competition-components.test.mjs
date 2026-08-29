import {existsSync, readFileSync} from 'node:fs'
import {describe, expect, it} from 'vitest'

const readSource = (path) =>
  readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8')

describe('competition presentation and navigation', () => {
  it('uses a shared Competition overview for current and historical seasons', () => {
    const path = 'components/CompetitionOverviewPage.astro'
    expect(existsSync(new URL(`../src/${path}`, import.meta.url))).toBe(true)

    const source = readSource(path)
    expect(source).toContain('competitionSlug: string')
    expect(source).toContain('seasonSlug?: string')
    expect(source).toContain('CURRENT_COMPETITION_QUERY')
    expect(source).toContain('COMPETITION_SEASON_BY_SLUG_QUERY')
    expect(source).toContain('calculateCompetitionStandings')
    expect(source).not.toContain('calculateLeagueStandings')
    expect(source).toContain('flattenCompletedMatches')
    expect(source).toContain('competition-ranking-list')
    expect(source).toContain('competition-ranking-row')
    expect(source).toMatch(
      /\.competition-ranking-row\s*\{[\s\S]*?grid-template-columns:\s*2\.5rem\s+3\.5rem\s+minmax\(0,\s*1fr\)/,
    )
    expect(source).toMatch(
      /@media\s*\(min-width:\s*48rem\)[\s\S]*?\.competition-ranking-row\s*\{[\s\S]*?grid-template-columns:\s*3rem\s+4rem\s+minmax\(0,\s*1fr\)\s+auto\s+auto/,
    )
    expect(source).toContain('competition-season-selector')
    expect(source).toContain('/competitions/${competitionSlug}/')
    expect(source).not.toContain('LeagueOverviewPage')
  })

  it('places the selected season status beside the season title', () => {
    const source = readSource('components/CompetitionOverviewPage.astro')

    expect(source).toContain('class="competition-overview-page__season-row"')
    expect(source).toContain('class="competition-overview-page__season"')
    expect(source).toContain('class="competition-overview-page__status"')
    expect(source).toMatch(
      /\.competition-overview-page__season-row\s*\{[\s\S]*?display:\s*flex/,
    )
  })

  it('keeps completed results on a separate selected-season matches page', () => {
    const path = 'components/CompetitionMatchesPage.astro'
    expect(existsSync(new URL(`../src/${path}`, import.meta.url))).toBe(true)

    const source = readSource(path)
    expect(source).toContain('COMPETITION_SEASON_BY_SLUG_QUERY')
    expect(source).toContain('groupStagesForDisplay')
    expect(source).toContain('competition-stage')
    expect(source).toContain('competition-match-type')
    expect(source).toContain('copy.competitionMatchStatus')
    expect(source).toContain('target="_blank"')
    expect(source).toContain('rel="noreferrer"')
    expect(source).toContain('dateLabel')
    expect(source).toContain('competitionBackToSeason')
    expect(source).toContain('competitionSelectedSeason')
    expect(source).toContain('competitionStageSchedule')
    expect(source).toContain('competitionStageSummary(displayStages.length)')
    expect(source).toContain('competition-matches__summary')
    expect(source).toContain('<h1 id="competition-matches-title">{copy.competitionResults}</h1>')
    expect(source).not.toContain('competition-matches-page__season')
    expect(source).toContain('competitionResultsEmpty')
    expect(source).toContain('competition-match--scheduled')
    expect(source).toContain('competition-match--cancelled')
    expect(source).toContain('match.players')
    expect(source).toContain('completedPlayer.placement')
    expect(source).not.toContain("'placement' in player")
    expect(source).not.toContain('match.results')
    expect(source).toContain('competitionSlug: string')
    expect(source).not.toContain('groupMatchesByRound')
    expect(source).not.toContain('LeagueOverviewPage')
  })

  it('loads published competitions once in BaseLayout and passes them to Navbar', () => {
    const source = readSource('layouts/BaseLayout.astro')

    expect(source).toContain('COMPETITION_NAVIGATION_QUERY')
    expect(source).toContain('sanityClient.fetch<CompetitionNavigationItem[]>')
    expect(source).toContain('competitions={competitions}')
  })

  it('renders localized competition dropdown links in the navigation drawer', () => {
    const source = readSource('components/Navbar.astro')

    expect(source).toContain('CompetitionNavigationItem')
    expect(source).toContain('competitions: CompetitionNavigationItem[]')
    expect(source).toContain('copy.competitions')
    expect(source).toContain('competitions.map')
    expect(source).toContain('getLocalizedPath(locale, `/competitions/${competition.slug}`)')
    expect(source).toContain('aria-current')
  })

  it('provides localized Competition copy without leftover League copy', () => {
    const source = readSource('lib/localization.ts')

    expect(source).toContain('competitions: string')
    expect(source).toContain('competitionOverview: string')
    expect(source).toContain('competitionRanking: string')
    expect(source).toContain('competitionMatches: string')
    expect(source).toContain('competitionMatchDetails: string')
    expect(source).toContain('competitionMatchStatus')
    expect(source).toContain('competitionMatchSequence')
    expect(source).toContain('competitionNotFound: string')
    expect(source).not.toContain('leagueOverview: string')
    expect(source).not.toContain('league: string')
  })
})
