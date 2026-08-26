import {describe, expect, it} from 'vitest'
import {calculateLeagueStandings, groupMatchesByRound} from './league-ranking'

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

describe('groupMatchesByRound', () => {
  it('groups matches by round and assigns score-derived placements', () => {
    expect(
      groupMatchesByRound([
        {
          id: 'round-2',
          round: 2,
          scheduledAt: '2026-08-20T12:00:00Z',
          results: [
            {memberId: 'dave', score: 4},
            {memberId: 'alice', score: 9},
          ],
        },
        {
          id: 'round-1-late',
          round: 1,
          scheduledAt: '2026-08-12T12:00:00Z',
          results: [
            {memberId: 'dave', score: -5},
            {memberId: 'carol', score: 7},
          ],
        },
        {
          id: 'round-1-early',
          round: 1,
          scheduledAt: '2026-08-10T12:00:00Z',
          results: [
            {memberId: 'bob', score: 12},
            {memberId: 'alice', score: 12},
          ],
        },
      ]),
    ).toEqual([
      {
        round: 1,
        matches: [
          {
            id: 'round-1-early',
            round: 1,
            scheduledAt: '2026-08-10T12:00:00Z',
            results: [
              {memberId: 'alice', score: 12, placement: 1},
              {memberId: 'bob', score: 12, placement: 1},
            ],
          },
          {
            id: 'round-1-late',
            round: 1,
            scheduledAt: '2026-08-12T12:00:00Z',
            results: [
              {memberId: 'carol', score: 7, placement: 1},
              {memberId: 'dave', score: -5, placement: 2},
            ],
          },
        ],
      },
      {
        round: 2,
        matches: [
          {
            id: 'round-2',
            round: 2,
            scheduledAt: '2026-08-20T12:00:00Z',
            results: [
              {memberId: 'alice', score: 9, placement: 1},
              {memberId: 'dave', score: 4, placement: 2},
            ],
          },
        ],
      },
    ])
  })
})
