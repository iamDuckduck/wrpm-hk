import {defineArrayMember, defineField, defineType} from 'sanity'
import {firstPreviewText, joinPreviewParts} from '../utils/preview'

type MatchStatus = 'scheduled' | 'completed' | 'cancelled'

type MatchReference = {
  _ref?: string
}

type MatchDocument = {
  status?: MatchStatus
  _id?: string
  stage?: MatchReference
  matchType?: MatchReference
}

type MatchPlayerDraft = {
  member?: {_ref?: string}
  score?: number
}

type MatchSequenceRecord = {
  sequence?: unknown
}

type MatchValidationContext = {
  document?: MatchDocument
  getClient?: (options: {apiVersion: string}) => {
    fetch: <Result>(query: string, params: Record<string, unknown>) => Promise<Result>
  }
}

const MATCH_SEQUENCE_QUERY = `*[
  _type == "match" &&
  stage._ref == $stageId &&
  matchType._ref == $matchTypeId &&
  !(_id in $excludedIds)
] {
  sequence
}`

function matchStatus(document: unknown): MatchStatus | undefined {
  return (document as MatchDocument | undefined)?.status
}

function matchReferenceId(reference: MatchReference | undefined): string | undefined {
  return typeof reference?._ref === 'string' && reference._ref ? reference._ref : undefined
}

async function validateMatchSequence(
  value: unknown,
  context: MatchValidationContext,
): Promise<true | string> {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) return true

  const stageId = matchReferenceId(context.document?.stage)
  const matchTypeId = matchReferenceId(context.document?.matchType)
  if (!stageId || !matchTypeId || !context.getClient) return true

  const documentId = context.document?._id?.replace(/^drafts\./, '')
  const excludedIds = documentId ? [...new Set([documentId, `drafts.${documentId}`])] : []
  const client = context.getClient({apiVersion: '2025-02-19'})
  const records = await client.fetch<MatchSequenceRecord[]>(MATCH_SEQUENCE_QUERY, {
    stageId,
    matchTypeId,
    excludedIds,
  })
  const existingSequences = (Array.isArray(records) ? records : []).map((record) => record.sequence)

  if (
    existingSequences.some(
      (sequence) =>
        typeof sequence !== 'number' || !Number.isInteger(sequence) || sequence < 1,
    )
  ) {
    return 'Match sequences must be positive integers.'
  }

  const sequences = [...(existingSequences as number[]), value]
  if (new Set(sequences).size !== sequences.length) {
    return 'Match sequences within a stage and match type must be unique.'
  }

  const orderedSequences = [...sequences].sort((left, right) => left - right)
  if (orderedSequences[0] !== 1) {
    return 'Match sequences within a stage and match type must start at 1.'
  }

  if (orderedSequences.some((sequence, index) => sequence !== index + 1)) {
    return 'Match sequences within a stage and match type must be consecutive.'
  }

  return true
}

export const match = defineType({
  name: 'match',
  title: 'Match',
  type: 'document',
  fields: [
    defineField({
      name: 'stage',
      title: 'Stage',
      type: 'reference',
      to: [{type: 'matchStage'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'matchType',
      title: 'Match Type',
      type: 'reference',
      to: [{type: 'matchType'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sequence',
      title: 'Sequence',
      type: 'number',
      validation: (Rule) =>
        Rule.required()
          .integer()
          .min(1)
          .custom((value, context) => validateMatchSequence(value, context)),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Scheduled', value: 'scheduled'},
          {title: 'Completed', value: 'completed'},
          {title: 'Cancelled', value: 'cancelled'},
        ],
        layout: 'radio',
      },
      initialValue: 'scheduled',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'detailsUrl',
      title: 'Details URL',
      type: 'url',
      hidden: ({document}) => matchStatus(document) !== 'completed',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const status = matchStatus(context.document)
          const url = typeof value === 'string' ? value.trim() : ''

          if (status === 'completed') {
            if (!url) return 'Completed matches require a details URL.'
            try {
              const parsed = new URL(url)
              return parsed.hostname.length > 0 && ['http:', 'https:'].includes(parsed.protocol)
                ? true
                : 'Details URL must be a valid HTTP or HTTPS URL.'
            } catch {
              return 'Details URL must be a valid HTTP or HTTPS URL.'
            }
          }

          return !url ? true : 'Scheduled and cancelled matches must not include a details URL.'
        }),
    }),
    defineField({
      name: 'players',
      title: 'Players',
      description:
        'Enter exactly four unique members. Completed matches require a score for each player; placement is calculated from score, then member name.',
      type: 'array',
      of: [defineArrayMember({type: 'matchPlayer'})],
      validation: (Rule) =>
        Rule.required().length(4).custom((value, context) => {
          const players = (Array.isArray(value) ? value : []) as MatchPlayerDraft[]

          if (players.length !== 4) {
            return 'Every match requires exactly four players.'
          }

          const memberIds = players.map((player) => player.member?._ref)
          if (memberIds.some((memberId) => !memberId) || new Set(memberIds).size !== 4) {
            return 'Every match requires four unique member references.'
          }

          const status = matchStatus(context.document)
          if (status === 'completed') {
            if (
              !players.every(
                (player) => typeof player.score === 'number' && Number.isFinite(player.score),
              )
            ) {
              return 'Completed matches require a score for every player.'
            }

          } else if (players.some((player) => player.score !== undefined)) {
            return 'Scheduled and cancelled matches must include members only.'
          }

          return true
        }),
    }),
  ],
  preview: {
    select: {
      stageTitleZhHk: 'stage.title.zhHk',
      stageTitleEn: 'stage.title.en',
      matchTypeTitleZhHk: 'matchType.title.zhHk',
      matchTypeTitleEn: 'matchType.title.en',
      sequence: 'sequence',
      status: 'status',
      detailsUrl: 'detailsUrl',
    },
    prepare({
      stageTitleZhHk,
      stageTitleEn,
      matchTypeTitleZhHk,
      matchTypeTitleEn,
      sequence,
      status,
      detailsUrl,
    }) {
      const stageTitle = firstPreviewText(stageTitleZhHk, stageTitleEn)
      const matchTypeTitle = firstPreviewText(matchTypeTitleZhHk, matchTypeTitleEn)
      const sequenceLabel = typeof sequence === 'number' ? `Match ${sequence}` : undefined

      return {
        title: sequenceLabel ?? 'Match',
        subtitle: joinPreviewParts(stageTitle, matchTypeTitle, status, detailsUrl),
      }
    },
  },
})
