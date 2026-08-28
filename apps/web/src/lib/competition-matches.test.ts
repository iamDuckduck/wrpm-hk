import {describe, expect, it} from 'vitest'
import type {CompetitionMatch, CompetitionMatchStage} from '../queries/competition'
import {
  flattenCompletedMatches,
  formatStageDate,
  groupStagesForDisplay,
} from './competition-matches'

const typeA = {_id: 'type-a', title: 'A 組', slug: 'a'}
const typeB = {_id: 'type-b', title: 'B 組', slug: 'b'}
type TestPlayer = {memberId: string; memberName?: string; score?: number}

const pendingPlayers: TestPlayer[] = [
  {memberId: 'kei'},
  {memberId: 'duck'},
  {memberId: 'alice'},
  {memberId: 'mari'},
]

const completedPlayers: TestPlayer[] = [
  {memberId: 'duck', memberName: 'Duck', score: 30},
  {memberId: 'kei', memberName: 'Kei', score: 10},
  {memberId: 'alice', memberName: 'Alice', score: -40},
  {memberId: 'mari', memberName: 'Mari', score: 0},
]

const shuffledCompletedPlayers: TestPlayer[] = [
  {memberId: 'alice', memberName: 'Alice', score: -40},
  {memberId: 'mari', memberName: 'Mari', score: 0},
  {memberId: 'duck', memberName: 'Duck', score: 30},
  {memberId: 'kei', memberName: 'Kei', score: 10},
]

type MatchOverrides = {
  _id: string
  sequence: number
  status: 'scheduled' | 'completed' | 'cancelled'
  detailsUrl?: string
  matchType?: typeof typeA | typeof typeB
  players?: TestPlayer[]
}

function match(overrides: MatchOverrides): CompetitionMatch {
  const common = {
    _id: overrides._id,
    sequence: overrides.sequence,
    matchType: overrides.matchType ?? typeA,
  }

  if (overrides.status === 'completed') {
    return {
      ...common,
      status: 'completed',
      detailsUrl: overrides.detailsUrl ?? `https://example.invalid/${overrides._id}`,
      players: overrides.players ?? completedPlayers,
    } as unknown as CompetitionMatch
  }

  return {
    ...common,
    status: overrides.status,
    players: overrides.players ?? pendingPlayers,
  }
}

const olderStage: CompetitionMatchStage = {
  _id: 'stage-old',
  title: 'Round 1',
  startsOn: '2026-08-01',
  endsOn: '2026-08-03',
  matches: [
    match({
      _id: 'old-a-2',
      sequence: 2,
      status: 'scheduled',
      matchType: typeA,
    }),
    match({
      _id: 'old-b-2',
      sequence: 2,
      status: 'scheduled',
      matchType: typeB,
    }),
    match({
      _id: 'old-a-1',
      sequence: 1,
      status: 'completed',
      detailsUrl: 'https://example.invalid/old-a-1',
      matchType: typeA,
      players: shuffledCompletedPlayers,
    }),
    match({
      _id: 'old-b-1',
      sequence: 1,
      status: 'cancelled',
      matchType: typeB,
    }),
  ],
}

const newerStage: CompetitionMatchStage = {
  _id: 'stage-new',
  title: 'Round 2',
  startsOn: '2026-09-10',
  endsOn: '2026-09-10',
  matches: [
    match({
      _id: 'new-a-1',
      sequence: 1,
      status: 'completed',
      detailsUrl: 'https://example.invalid/new-a-1',
      players: [
        {memberId: 'duck', memberName: 'Duck', score: 8},
        {memberId: 'kei', memberName: 'Kei', score: 2},
        {memberId: 'alice', memberName: 'Alice', score: -3},
        {memberId: 'mari', memberName: 'Mari', score: -7},
      ],
    }),
  ],
}

describe('flattenCompletedMatches', () => {
  it('keeps only completed matches across every stage', () => {
    expect(flattenCompletedMatches([olderStage, newerStage]).map(({_id, players}) => ({_id, players}))).toEqual([
      {
        _id: 'old-a-1',
        players: shuffledCompletedPlayers,
      },
      {
        _id: 'new-a-1',
        players: [
          {memberId: 'duck', memberName: 'Duck', score: 8},
          {memberId: 'kei', memberName: 'Kei', score: 2},
          {memberId: 'alice', memberName: 'Alice', score: -3},
          {memberId: 'mari', memberName: 'Mari', score: -7},
        ],
      },
    ])
  })
})

describe('formatStageDate', () => {
  it('uses a single date when endsOn is missing or the same day', () => {
    expect(formatStageDate('en', '2026-09-10', null)).toBe(
      formatStageDate('en', '2026-09-10', '2026-09-10'),
    )
    expect(formatStageDate('en', '2026-09-10', null)).toContain('2026')
  })

  it('uses a date range when endsOn is later than startsOn', () => {
    const label = formatStageDate('en', '2026-08-01', '2026-08-03')
    expect(label).toContain('–')
    expect(label.split('–')).toHaveLength(2)
  })
})

describe('groupStagesForDisplay', () => {
  it('orders stages newest first, types by first appearance, and matches by sequence', () => {
    const stages = groupStagesForDisplay([olderStage, newerStage], 'en')

    expect(stages.map((stage) => stage.id)).toEqual(['stage-new', 'stage-old'])
    expect(stages[0].dateLabel).toBe(formatStageDate('en', '2026-09-10', '2026-09-10'))
    expect(stages[1].dateLabel).toBe(formatStageDate('en', '2026-08-01', '2026-08-03'))

    expect(stages[1].matchTypes.map((type) => type.slug)).toEqual(['a', 'b'])
    expect(stages[1].matchTypes[0].matches.map((item) => item.id)).toEqual(['old-a-1', 'old-a-2'])
    expect(stages[1].matchTypes[1].matches.map((item) => item.id)).toEqual([
      'old-b-1',
      'old-b-2',
    ])
    expect(stages[1].matchTypes.map((type) => type.matches.map((item) => item.sequence))).toEqual([
      [1, 2],
      [1, 2],
    ])
  })

  it('orders match types by first appearance and sequences only within each type', () => {
    const stages = groupStagesForDisplay(
      [
        {
          _id: 'stage-seq',
          title: 'Section 1',
          startsOn: '2026-07-27',
          endsOn: '2026-07-27',
          matches: [
            match({
              _id: 'live-2',
              sequence: 2,
              status: 'completed',
              matchType: typeA,
            }),
            match({
              _id: 'non-live-2',
              sequence: 2,
              status: 'cancelled',
              matchType: typeB,
            }),
            match({
              _id: 'non-live-1',
              sequence: 1,
              status: 'completed',
              matchType: typeB,
            }),
          ],
        },
      ],
      'en',
    )

    expect(stages[0].matchTypes.map((type) => type.slug)).toEqual(['a', 'b'])
    expect(stages[0].matchTypes[0].matches.map((item) => item.sequence)).toEqual([2])
    expect(stages[0].matchTypes[1].matches.map((item) => item.sequence)).toEqual([1, 2])
  })

  it('calculates score-descending placements and exposes scores only for completed matches', () => {
    const [completed] = groupStagesForDisplay([olderStage], 'en')[0].matchTypes[0].matches

    expect(completed.status).toBe('completed')
    if (completed.status !== 'completed') throw new Error('Expected a completed match')
    expect(completed.detailsUrl).toBe('https://example.invalid/old-a-1')
    expect(completed.players).toEqual([
      {memberId: 'duck', score: 30, placement: 1},
      {memberId: 'kei', score: 10, placement: 2},
      {memberId: 'mari', score: 0, placement: 3},
      {memberId: 'alice', score: -40, placement: 4},
    ])

    const cancelled = groupStagesForDisplay([olderStage], 'en')[0].matchTypes[1].matches[0]
    expect(cancelled.status).toBe('cancelled')
    expect(cancelled).not.toHaveProperty('detailsUrl')
    expect(cancelled.players).toEqual(pendingPlayers)
    expect(cancelled.players.every((player) => !('score' in player))).toBe(true)
  })

  it('breaks equal scores alphabetically before assigning sequential placements', () => {
    const [completed] = groupStagesForDisplay(
      [
        {
          ...olderStage,
          matches: [
            match({
              _id: 'tie-match',
              sequence: 1,
              status: 'completed',
              players: [
                {memberId: 'bob', memberName: 'Bob', score: 100},
                {memberId: 'alice', memberName: 'Alice', score: 100},
                {memberId: 'zoe', memberName: 'Zoe', score: 5},
                {memberId: 'mari', memberName: 'Mari', score: 0},
              ],
            }),
          ],
        },
      ],
      'en',
    )[0].matchTypes[0].matches

    if (completed.status !== 'completed') throw new Error('Expected a completed match')
    expect(completed.players).toEqual([
      {memberId: 'alice', score: 100, placement: 1},
      {memberId: 'bob', score: 100, placement: 2},
      {memberId: 'zoe', score: 5, placement: 3},
      {memberId: 'mari', score: 0, placement: 4},
    ])
  })

  it('renders four members for scheduled matches without score, placement, or details data', () => {
    const scheduled = groupStagesForDisplay([olderStage], 'en')[0].matchTypes[0].matches[1]

    expect(scheduled.status).toBe('scheduled')
    expect(scheduled.players).toHaveLength(4)
    expect(scheduled).not.toHaveProperty('detailsUrl')
    expect(scheduled.players.every((player) => !('score' in player))).toBe(true)
  })
})
