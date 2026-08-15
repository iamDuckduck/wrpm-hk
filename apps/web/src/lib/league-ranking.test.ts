import {describe, expect, it} from 'vitest'
import {calculateLeagueStandings} from './league-ranking'

describe('calculateLeagueStandings', () => {
  it('sums match scores, shares tied ranks, and leaves unused participants unranked', () => {
    const standings = calculateLeagueStandings(
      [
        {memberId: 'alice', name: 'Alice', slug: 'alice'},
        {memberId: 'bob', name: 'Bob', slug: 'bob'},
        {memberId: 'carol', name: 'Carol', slug: 'carol'},
        {memberId: 'dave', name: 'Dave', slug: 'dave'},
      ],
      [
        {
          id: 'match-1',
          results: [
            {memberId: 'alice', score: 12},
            {memberId: 'bob', score: 7},
            {memberId: 'dave', score: 3},
          ],
        },
        {
          id: 'match-2',
          results: [
            {memberId: 'alice', score: 3},
            {memberId: 'bob', score: 8},
            {memberId: 'dave', score: 2},
          ],
        },
      ],
    )

    expect(standings).toEqual([
      {
        memberId: 'alice',
        name: 'Alice',
        slug: 'alice',
        totalScore: 15,
        matchesPlayed: 2,
        rank: 1,
      },
      {
        memberId: 'bob',
        name: 'Bob',
        slug: 'bob',
        totalScore: 15,
        matchesPlayed: 2,
        rank: 1,
      },
      {
        memberId: 'dave',
        name: 'Dave',
        slug: 'dave',
        totalScore: 5,
        matchesPlayed: 2,
        rank: 3,
      },
      {
        memberId: 'carol',
        name: 'Carol',
        slug: 'carol',
        totalScore: 0,
        matchesPlayed: 0,
        rank: null,
      },
    ])
  })
})
