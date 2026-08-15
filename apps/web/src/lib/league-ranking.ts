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
