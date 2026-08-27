import type {Locale} from './localization'
import type {
  CompetitionCompletedMatch,
  CompetitionMatch,
  CompetitionMatchStage,
} from '../queries/competition'

export type DisplayCompletedMatchPlayer = {
  memberId: string
  score: number
  placement: number
}

export type DisplayPendingMatchPlayer = {
  memberId: string
}

type DisplayMatchBase = {
  id: string
  sequence: number
}

export type DisplayCompletedMatch = DisplayMatchBase & {
  status: 'completed'
  detailsUrl: string
  players: DisplayCompletedMatchPlayer[]
}

export type DisplayPendingMatch = DisplayMatchBase & {
  status: 'scheduled' | 'cancelled'
  players: DisplayPendingMatchPlayer[]
}

export type DisplayMatch = DisplayCompletedMatch | DisplayPendingMatch

export type DisplayMatchType = {
  id: string
  title: string
  slug: string
  matches: DisplayMatch[]
}

export type DisplayStage = {
  id: string
  title: string | null
  startsOn: string
  endsOn: string | null
  dateLabel: string
  matchTypes: DisplayMatchType[]
}

export function flattenCompletedMatches(
  stages: CompetitionMatchStage[] | null | undefined,
): CompetitionCompletedMatch[] {
  return (stages ?? []).flatMap((stage) =>
    (stage.matches ?? [])
      .filter((item): item is CompetitionCompletedMatch => item.status === 'completed'),
  )
}

export function formatStageDate(
  locale: Locale,
  startsOn: string,
  endsOn: string | null,
): string {
  const startLabel = formatIsoDate(locale, startsOn)

  if (!endsOn || endsOn === startsOn) return startLabel

  return `${startLabel} – ${formatIsoDate(locale, endsOn)}`
}

export function groupStagesForDisplay(
  stages: CompetitionMatchStage[] | null | undefined,
  locale: Locale,
): DisplayStage[] {
  return [...(stages ?? [])]
    .sort((left, right) => {
      if (left.startsOn !== right.startsOn) {
        return right.startsOn.localeCompare(left.startsOn)
      }

      return right._id.localeCompare(left._id)
    })
    .map((stage) => ({
      id: stage._id,
      title: stage.title,
      startsOn: stage.startsOn,
      endsOn: stage.endsOn,
      dateLabel: formatStageDate(locale, stage.startsOn, stage.endsOn),
      matchTypes: groupMatchTypes(stage.matches ?? [], locale),
    }))
}

function formatIsoDate(locale: Locale, value: string): string {
  const [year, month, day] = value.split('-').map(Number)

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(year, month - 1, day))
}

function groupMatchTypes(matches: CompetitionMatch[], locale: Locale): DisplayMatchType[] {
  const ordered = [...matches].sort((left, right) => {
    if (left.sequence !== right.sequence) return left.sequence - right.sequence
    return left._id.localeCompare(right._id)
  })
  const groups = new Map<string, DisplayMatchType>()
  const order: string[] = []

  for (const item of ordered) {
    const typeId = item.matchType._id

    if (!groups.has(typeId)) {
      groups.set(typeId, {
        id: typeId,
        title: item.matchType.title?.trim() || '',
        slug: item.matchType.slug,
        matches: [],
      })
      order.push(typeId)
    }

    groups.get(typeId)?.matches.push(toDisplayMatch(item, locale))
  }

  return order.map((id) => groups.get(id)).filter((group): group is DisplayMatchType => Boolean(group))
}

function toDisplayMatch(item: CompetitionMatch, locale: Locale): DisplayMatch {
  if (item.status === 'completed') {
    return {
      id: item._id,
      sequence: item.sequence,
      status: item.status,
      detailsUrl: item.detailsUrl,
      players: [...item.players]
        .sort((left, right) => compareCompletedPlayers(left, right, locale))
        .map((player, index) => ({
          memberId: player.memberId,
          score: player.score,
          placement: index + 1,
        })),
    }
  }

  return {
    id: item._id,
    sequence: item.sequence,
    status: item.status,
    players: item.players.map((player) => ({memberId: player.memberId})),
  }
}

function compareCompletedPlayers(
  left: CompetitionCompletedMatch['players'][number],
  right: CompetitionCompletedMatch['players'][number],
  locale: Locale,
): number {
  if (left.score !== right.score) return right.score - left.score

  const leftName = left.memberName?.trim() || left.memberId
  const rightName = right.memberName?.trim() || right.memberId
  const nameComparison = leftName.localeCompare(rightName, locale, {sensitivity: 'base'})

  return nameComparison || left.memberId.localeCompare(right.memberId)
}
