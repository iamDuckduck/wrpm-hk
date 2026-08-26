import {describe, expect, it} from 'vitest'

import {
  COMPETITION_NAVIGATION_QUERY,
  COMPETITION_SEASON_BY_SLUG_QUERY,
  COMPETITION_SEASON_SLUGS_QUERY,
  COMPETITION_SLUGS_QUERY,
  CURRENT_COMPETITION_QUERY,
} from '../src/queries/competition.ts'

describe('competition queries', () => {
  it('resolves the requested competition current season by ongoing status then latest start', () => {
    expect(CURRENT_COMPETITION_QUERY).toContain('_type == "competition"')
    expect(CURRENT_COMPETITION_QUERY).toContain('$competitionSlug')
    expect(CURRENT_COMPETITION_QUERY).toContain('competition._ref == ^._id')
    expect(CURRENT_COMPETITION_QUERY).toContain('status == "ongoing"')
    expect(CURRENT_COMPETITION_QUERY).toContain('startsAt desc')
  })

  it('resolves a selected season within the requested competition', () => {
    expect(COMPETITION_SEASON_BY_SLUG_QUERY).toContain('$competitionSlug')
    expect(COMPETITION_SEASON_BY_SLUG_QUERY).toContain('$seasonSlug')
    expect(COMPETITION_SEASON_BY_SLUG_QUERY).toContain('competition._ref == ^._id')
    expect(COMPETITION_SEASON_BY_SLUG_QUERY).toContain('slug.current == $seasonSlug')
  })

  it('scopes completed match results and season choices to the selected competition season', () => {
    expect(CURRENT_COMPETITION_QUERY).toContain('"seasons": *[')
    expect(CURRENT_COMPETITION_QUERY).toContain('competition._ref == ^._id')
    expect(COMPETITION_SEASON_BY_SLUG_QUERY).toContain('season._ref == ^._id')
    expect(COMPETITION_SEASON_BY_SLUG_QUERY).toContain('status == "completed"')
    expect(COMPETITION_SEASON_BY_SLUG_QUERY).toContain('"seasons": *[')
    expect(COMPETITION_SEASON_BY_SLUG_QUERY).toContain('competition._ref == ^._id')
    expect(COMPETITION_SEASON_BY_SLUG_QUERY).toContain('competition._ref == ^.competition._ref')
  })

  it('provides competition slugs for route generation and localized navigation items', () => {
    expect(COMPETITION_SLUGS_QUERY).toContain('_type == "competition"')
    expect(COMPETITION_SLUGS_QUERY).toContain('slug.current')
    expect(COMPETITION_SEASON_SLUGS_QUERY).toContain('competitionSlug')
    expect(COMPETITION_SEASON_SLUGS_QUERY).toContain('seasonSlug')
    expect(COMPETITION_NAVIGATION_QUERY).toContain('_type == "competition"')
    expect(COMPETITION_NAVIGATION_QUERY).toContain('title.zhHk')
  })
})
