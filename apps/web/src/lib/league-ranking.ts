import {cleanScore} from './format-score'

export interface RankingParticipant {
  memberId: string
  name: string
  slug: string
}

export interface MatchResultForRanking {
  memberId: string
  score: number
}

export interface CompletedLeagueMatch {
  id: string
  results: MatchResultForRanking[]
}

export interface LeagueMatchForResults extends CompletedLeagueMatch {
  round: number
  scheduledAt: string
}

export interface PlacedMatchResult extends MatchResultForRanking {
  placement: number
}

export interface PlacedLeagueMatch extends Omit<LeagueMatchForResults, 'results'> {
  results: PlacedMatchResult[]
}

export interface LeagueMatchRound {
  round: number
  matches: PlacedLeagueMatch[]
}

export interface LeagueStanding {
  memberId: string
  name: string
  slug: string
  totalScore: number
  matchesPlayed: number
  rank: number | null
}

export function calculateLeagueStandings(
  participants: RankingParticipant[],
  matches: CompletedLeagueMatch[],
): LeagueStanding[] {
  const totals = new Map(
    participants.map((participant) => [
      participant.memberId,
      {totalScore: 0, matchesPlayed: 0},
    ]),
  )

  for (const match of matches) {
    for (const result of match.results) {
      const current = totals.get(result.memberId)
      if (!current) continue

      current.totalScore += result.score
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
        rank: null as number | null,
      }
    })
    .sort((left, right) => {
      const leftPlayed = left.matchesPlayed > 0
      const rightPlayed = right.matchesPlayed > 0

      if (leftPlayed !== rightPlayed) return leftPlayed ? -1 : 1
      if (left.totalScore !== right.totalScore) {
        return right.totalScore - left.totalScore
      }

      return left.name.localeCompare(right.name)
    })

  let previousScore: number | null = null
  for (const [index, standing] of standings.entries()) {
    if (standing.matchesPlayed === 0) continue

    standing.rank = standing.totalScore === previousScore ? standings[index - 1].rank : index + 1
    previousScore = standing.totalScore
  }

  return standings
}

export function groupMatchesByRound(
  matches: LeagueMatchForResults[],
): LeagueMatchRound[] {
  const rounds = new Map<number, PlacedLeagueMatch[]>()
  const orderedMatches = [...matches].sort((left, right) => {
    if (left.round !== right.round) return left.round - right.round
    return left.scheduledAt.localeCompare(right.scheduledAt)
  })

  for (const match of orderedMatches) {
    const orderedResults = [...match.results].sort((left, right) => {
      if (left.score !== right.score) return right.score - left.score
      return left.memberId.localeCompare(right.memberId)
    })

    let previousScore: number | null = null
    let previousPlacement = 0
    const results = orderedResults.map((result, index) => {
      const placement =
        result.score === previousScore ? previousPlacement : index + 1

      previousScore = result.score
      previousPlacement = placement

      return {
        ...result,
        placement,
      }
    })

    const roundMatches = rounds.get(match.round) ?? []
    roundMatches.push({
      ...match,
      results,
    })
    rounds.set(match.round, roundMatches)
  }

  return Array.from(rounds, ([round, roundMatches]) => ({
    round,
    matches: roundMatches,
  }))
}
