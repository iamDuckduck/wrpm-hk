import {describe, expect, it} from 'vitest'

import {
  CURRENT_LEAGUE_QUERY,
  LEAGUE_SEASON_BY_SLUG_QUERY,
  LEAGUE_SEASON_SLUGS_QUERY,
} from '../src/queries/league.ts'

describe('league season queries', () => {
  it('selects an ongoing season before falling back to the latest start date', () => {
    expect(CURRENT_LEAGUE_QUERY).toContain('_type == "leagueSeason"')
    expect(CURRENT_LEAGUE_QUERY).toContain('status == "ongoing"')
    expect(CURRENT_LEAGUE_QUERY).toContain('startsAt desc')
  })

  it('fetches completed matches through the season reference', () => {
    expect(CURRENT_LEAGUE_QUERY).toContain('season._ref == ^._id')
    expect(CURRENT_LEAGUE_QUERY).toContain('status == "completed"')
  })

  it('includes participant image metadata for season result presentation', () => {
    expect(CURRENT_LEAGUE_QUERY).toContain('"participants": participants[]->')
    expect(CURRENT_LEAGUE_QUERY).toContain('profileImage {')
    expect(CURRENT_LEAGUE_QUERY).toContain('asset')
    expect(CURRENT_LEAGUE_QUERY).toContain('alt')
  })

  it('supports a specific season slug and returns season choices', () => {
    expect(LEAGUE_SEASON_BY_SLUG_QUERY).toContain('$seasonSlug')
    expect(LEAGUE_SEASON_BY_SLUG_QUERY).toContain('season._ref == ^._id')
    expect(LEAGUE_SEASON_SLUGS_QUERY).toContain('leagueSeason')
    expect(LEAGUE_SEASON_SLUGS_QUERY).toContain('slug.current')
  })
})
