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

  it('scopes season choices to the requested competition', () => {
    expect(CURRENT_COMPETITION_QUERY).toContain('"seasons": *[')
    expect(CURRENT_COMPETITION_QUERY).toContain('competition._ref == ^._id')
    expect(COMPETITION_SEASON_BY_SLUG_QUERY).toContain('"seasons": *[')
    expect(COMPETITION_SEASON_BY_SLUG_QUERY).toContain('competition._ref == ^._id')
    expect(COMPETITION_SEASON_BY_SLUG_QUERY).toContain('competition._ref == ^.competition._ref')
  })

  it('fetches match stages for the selected season and all-status matches', () => {
    for (const query of [CURRENT_COMPETITION_QUERY, COMPETITION_SEASON_BY_SLUG_QUERY]) {
      expect(query).toContain('_type == "matchStage"')
      expect(query).toContain('season._ref == ^._id')
      expect(query).toContain('startsOn desc')
      expect(query).toContain('stage._ref == ^._id')
      expect(query).toContain('sequence asc')
      expect(query).toContain('matchType')
      expect(query).toContain('"players"')
      expect(query).toContain('placement')
      expect(query).toContain('score')
      expect(query).toContain('status == "completed"')
      expect(query).toContain('detailsUrl')
      expect(query).not.toContain('"results"')
      expect(query).not.toContain('scheduledAt')
      expect(query).not.toMatch(/\bround\b/)
    }
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
