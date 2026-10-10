import type {CompetitionCompletedMatch} from '../queries/competition'
import {cleanScore} from './format-score'

export interface RankingParticipant {
  memberId: string
  name: string
  slug: string
}

export interface CompetitionStanding {
  memberId: string
  name: string
  slug: string
  totalScore: number
  matchesPlayed: number
  rank: number
  diff: number | null
}

/**
 * Calculate standings from the competition match contract.
 *
 * Competition matches expose their four players directly.
 */
export function calculateCompetitionStandings(
  participants: RankingParticipant[],
  matches: CompetitionCompletedMatch[],
): CompetitionStanding[] {
  const totals = new Map(
    participants.map((participant) => [
      participant.memberId,
      {totalScore: 0, matchesPlayed: 0},
    ]),
  )

  for (const match of matches) {
    for (const player of match.players) {
      const current = totals.get(player.memberId)
      if (!current) continue

      current.totalScore += player.score
      current.matchesPlayed += 1
    }
  }

  const standings = participants
    .map((participant) => {
      const total = totals.get(participant.memberId) ?? {
        totalScore: 0,
        matchesPlayed: 0,
      }

      return {
        ...participant,
        ...total,
        totalScore: cleanScore(total.totalScore),
        rank: 0,
        diff: null as number | null,
      }
    })
    .sort((left, right) => {
      if (left.totalScore !== right.totalScore) {
        return right.totalScore - left.totalScore
      }

      return left.name.localeCompare(right.name)
    })

  let previousScore: number | null = null
  for (const [index, standing] of standings.entries()) {
    standing.rank = standing.totalScore === previousScore ? standings[index - 1].rank : index + 1
    standing.diff = index === 0 ? null : cleanScore(standings[index - 1].totalScore - standing.totalScore)
    previousScore = standing.totalScore
  }

  return standings
}
