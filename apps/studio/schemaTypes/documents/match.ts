import {defineArrayMember, defineField, defineType} from 'sanity'
import {firstPreviewText, joinPreviewParts} from '../utils/preview'

type MatchResultDraft = {
  member?: {_ref?: string}
}

export const match = defineType({
  name: 'match',
  title: 'Match',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localizedString',
      validation: (Rule) => Rule.required(),
    }),
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
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const status = (context.document as {status?: string} | undefined)?.status
          const url = typeof value === 'string' ? value : ''

          if (status === 'completed' && !url) {
            return 'Completed matches require a details URL.'
          }

          if (!url) return true

          return /^https?:\/\//i.test(url) ? true : 'Details URL must use HTTP or HTTPS.'
        }),
    }),
    defineField({
      name: 'results',
      title: 'Results',
      description:
        'Enter one result for each participating member. Completed matches require results.',
      type: 'array',
      of: [defineArrayMember({type: 'matchResult'})],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const results = (value ?? []) as MatchResultDraft[]
          const status = (context.document as {status?: string} | undefined)?.status

          if (status === 'completed' && results.length === 0) {
            return 'Completed matches require at least one result.'
          }

          const memberIds = results
            .map((result) => result.member?._ref)
            .filter((memberId): memberId is string => Boolean(memberId))

          return new Set(memberIds).size === memberIds.length
            ? true
            : 'Each member can appear only once in a match.'
        }),
    }),
  ],
  preview: {
    select: {
      titleZhHk: 'title.zhHk',
      titleEn: 'title.en',
      stageTitleZhHk: 'stage.title.zhHk',
      stageTitleEn: 'stage.title.en',
      matchTypeTitleZhHk: 'matchType.title.zhHk',
      matchTypeTitleEn: 'matchType.title.en',
      sequence: 'sequence',
      status: 'status',
      detailsUrl: 'detailsUrl',
    },
    prepare({
      titleZhHk,
      titleEn,
      stageTitleZhHk,
      stageTitleEn,
      matchTypeTitleZhHk,
      matchTypeTitleEn,
      sequence,
      status,
      detailsUrl,
    }) {
      const matchTitle = firstPreviewText(titleZhHk, titleEn) ?? 'Untitled match'
      const stageTitle = firstPreviewText(stageTitleZhHk, stageTitleEn)
      const matchTypeTitle = firstPreviewText(matchTypeTitleZhHk, matchTypeTitleEn)
      const sequenceLabel = typeof sequence === 'number' ? `Match ${sequence}` : undefined

      return {
        title: matchTitle,
        subtitle: joinPreviewParts(stageTitle, matchTypeTitle, sequenceLabel, status, detailsUrl),
      }
    },
  },
})
