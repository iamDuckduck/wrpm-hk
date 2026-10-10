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
        diff: null,
      },
      {
        memberId: 'bob',
        name: 'Bob',
        slug: 'bob',
        totalScore: 15,
        matchesPlayed: 2,
        rank: 1,
        diff: 0,
      },
      {
        memberId: 'dave',
        name: 'Dave',
        slug: 'dave',
        totalScore: 5,
        matchesPlayed: 2,
        rank: 3,
        diff: 10,
      },
      {
        memberId: 'carol',
        name: 'Carol',
        slug: 'carol',
        totalScore: -35,
        matchesPlayed: 2,
        rank: 4,
        diff: 40,
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
        diff: null,
      },
      {
        memberId: 'bob',
        name: 'Bob',
        slug: 'bob',
        totalScore: 0.3,
        matchesPlayed: 3,
        rank: 1,
        diff: 0,
      },
      {
        memberId: 'carol',
        name: 'Carol',
        slug: 'carol',
        totalScore: -10.6,
        matchesPlayed: 3,
        rank: 3,
        diff: 10.9,
      },
      {
        memberId: 'dave',
        name: 'Dave',
        slug: 'dave',
        totalScore: -33.6,
        matchesPlayed: 3,
        rank: 4,
        diff: 23,
      },
    ])
  })
})


describe('reference leaderboard ordering and gaps', () => {
  const participants = [
    'Jimmy', 'Wing', 'Russell', 'Leo', 'Hugh', 'Shun Hei', 'Kaka', 'Kelvin',
  ].map((name) => ({memberId: name, name, slug: name.toLowerCase()}))

  it('ranks unplayed zero totals above negative scores and compares adjacent rows', () => {
    const matches: CompetitionCompletedMatch[] = [{
      _id: 'match-reference', sequence: 1, status: 'completed',
      detailsUrl: 'https://example.invalid/match',
      matchType: {_id: 'a', title: 'A', slug: 'a'},
      players: [
        {memberId: 'Jimmy', memberName: 'Jimmy', score: 31.7},
        {memberId: 'Wing', memberName: 'Wing', score: 5.6},
        {memberId: 'Kaka', memberName: 'Kaka', score: -6},
        {memberId: 'Kelvin', memberName: 'Kelvin', score: -63.3},
      ],
    }]
    const standings = calculateCompetitionStandings(participants, matches)
    expect(standings.map(({name, totalScore, matchesPlayed, rank, diff}) =>
      [name, totalScore, matchesPlayed, rank, diff],
    )).toEqual([
      ['Jimmy', 31.7, 1, 1, null],
      ['Wing', 5.6, 1, 2, 26.1],
      ['Hugh', 0, 0, 3, 5.6],
      ['Leo', 0, 0, 3, 0],
      ['Russell', 0, 0, 3, 0],
      ['Shun Hei', 0, 0, 3, 0],
      ['Kaka', -6, 1, 7, 6],
      ['Kelvin', -63.3, 1, 8, 57.3],
    ])
  })

  it('shows participants before the first match and handles an empty participant list', () => {
    expect(calculateCompetitionStandings([], [])).toEqual([])
    const standings = calculateCompetitionStandings(participants, [])
    expect(standings).toHaveLength(8)
    expect(standings.every(({totalScore, matchesPlayed, rank}) =>
      totalScore === 0 && matchesPlayed === 0 && rank === 1,
    )).toBe(true)
    expect(standings.map(({diff}) => diff)).toEqual([null, 0, 0, 0, 0, 0, 0, 0])
  })
})
