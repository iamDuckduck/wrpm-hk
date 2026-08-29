import {describe, expect, it} from 'vitest'
import type {CompetitionCompletedMatch} from '../queries/competition'
import {calculateCompetitionStandings} from './competition-ranking'

describe('calculateCompetitionStandings', () => {
  it('sums native completed match players without converting them to result entries', () => {
    const participants = [
      {memberId: 'alice', name: 'Alice', slug: 'alice'},
      {memberId: 'bob', name: 'Bob', slug: 'bob'},
      {memberId: 'carol', name: 'Carol', slug: 'carol'},
      {memberId: 'dave', name: 'Dave', slug: 'dave'},
    ]
    const matches: CompetitionCompletedMatch[] = [
      {
        _id: 'match-1',
        sequence: 1,
        status: 'completed',
        detailsUrl: 'https://example.invalid/match-1',
        matchType: {_id: 'type-a', title: 'A 組', slug: 'a'},
        players: [
          {memberId: 'alice', memberName: 'Alice', score: 12},
          {memberId: 'bob', memberName: 'Bob', score: 7},
          {memberId: 'dave', memberName: 'Dave', score: 3},
          {memberId: 'carol', memberName: 'Carol', score: -22},
        ],
      },
      {
        _id: 'match-2',
        sequence: 2,
        status: 'completed',
        detailsUrl: 'https://example.invalid/match-2',
        matchType: {_id: 'type-a', title: 'A 組', slug: 'a'},
        players: [
          {memberId: 'alice', memberName: 'Alice', score: 3},
          {memberId: 'bob', memberName: 'Bob', score: 8},
          {memberId: 'dave', memberName: 'Dave', score: 2},
          {memberId: 'carol', memberName: 'Carol', score: -13},
        ],
      },
    ]

    expect(calculateCompetitionStandings(participants, matches)).toEqual([
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
        totalScore: -35,
        matchesPlayed: 2,
        rank: 4,
      },
    ])
  })

  it('snaps summed decimal scores so totals and tied ranks stay exact', () => {
    const participants = [
      {memberId: 'alice', name: 'Alice', slug: 'alice'},
      {memberId: 'bob', name: 'Bob', slug: 'bob'},
      {memberId: 'carol', name: 'Carol', slug: 'carol'},
      {memberId: 'dave', name: 'Dave', slug: 'dave'},
    ]
    const matches: CompetitionCompletedMatch[] = [
      {
        _id: 'match-1',
        sequence: 1,
        status: 'completed',
        detailsUrl: 'https://example.invalid/match-1',
        matchType: {_id: 'type-a', title: 'A 組', slug: 'a'},
        players: [
          {memberId: 'alice', memberName: 'Alice', score: 0.1},
          {memberId: 'bob', memberName: 'Bob', score: 0.3},
          {memberId: 'carol', memberName: 'Carol', score: -3.4},
          {memberId: 'dave', memberName: 'Dave', score: -11.2},
        ],
      },
      {
        _id: 'match-2',
        sequence: 2,
        status: 'completed',
        detailsUrl: 'https://example.invalid/match-2',
        matchType: {_id: 'type-a', title: 'A 組', slug: 'a'},
        players: [
          {memberId: 'alice', memberName: 'Alice', score: 0.2},
          {memberId: 'bob', memberName: 'Bob', score: 0},
          {memberId: 'carol', memberName: 'Carol', score: -4.1},
          {memberId: 'dave', memberName: 'Dave', score: -11.2},
        ],
      },
      {
        _id: 'match-3',
        sequence: 3,
        status: 'completed',
        detailsUrl: 'https://example.invalid/match-3',
        matchType: {_id: 'type-a', title: 'A 組', slug: 'a'},
        players: [
          {memberId: 'alice', memberName: 'Alice', score: 0},
          {memberId: 'bob', memberName: 'Bob', score: 0},
          {memberId: 'carol', memberName: 'Carol', score: -3.1},
          {memberId: 'dave', memberName: 'Dave', score: -11.2},
        ],
      },
    ]

    expect(calculateCompetitionStandings(participants, matches)).toEqual([
      {
        memberId: 'alice',
        name: 'Alice',
        slug: 'alice',
        totalScore: 0.3,
        matchesPlayed: 3,
        rank: 1,
      },
      {
        memberId: 'bob',
        name: 'Bob',
        slug: 'bob',
        totalScore: 0.3,
        matchesPlayed: 3,
        rank: 1,
      },
      {
        memberId: 'carol',
        name: 'Carol',
        slug: 'carol',
        totalScore: -10.6,
        matchesPlayed: 3,
        rank: 3,
      },
      {
        memberId: 'dave',
        name: 'Dave',
        slug: 'dave',
        totalScore: -33.6,
        matchesPlayed: 3,
        rank: 4,
      },
    ])
  })
})
