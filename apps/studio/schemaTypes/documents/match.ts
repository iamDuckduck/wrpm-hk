import {defineArrayMember, defineField, defineType} from 'sanity'
import {firstPreviewText, joinPreviewParts} from '../utils/preview'

type MatchStatus = 'scheduled' | 'completed' | 'cancelled'

type MatchDocument = {
  status?: MatchStatus
}

type MatchPlayerDraft = {
  member?: {_ref?: string}
  score?: number
}

function matchStatus(document: unknown): MatchStatus | undefined {
  return (document as MatchDocument | undefined)?.status
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
      description:
        'Public match number (賽事 01). Used for display and sort order. Does not need to be unique; duplicates and gaps are allowed so you can change 2 to 1 without swapping first.',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1),
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
