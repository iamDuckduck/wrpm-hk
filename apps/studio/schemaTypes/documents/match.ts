import {defineArrayMember, defineField, defineType} from 'sanity'
import {firstPreviewText, formatPreviewDate, joinPreviewParts} from '../utils/preview'

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
      name: 'season',
      title: 'Competition Season',
      type: 'reference',
      to: [{type: 'competitionSeason'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'round',
      title: 'Round',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'scheduledAt',
      title: 'Scheduled At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
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
      name: 'results',
      title: 'Results',
      description: 'Enter one result for each participating member. Completed matches require results.',
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
      seasonTitleZhHk: 'season.title.zhHk',
      seasonTitleEn: 'season.title.en',
      round: 'round',
      status: 'status',
      scheduledAt: 'scheduledAt',
    },
    prepare({seasonTitleZhHk, seasonTitleEn, round, status, scheduledAt}) {
      const seasonTitle = firstPreviewText(seasonTitleZhHk, seasonTitleEn)
      const roundLabel = typeof round === 'number' ? `Round ${round}` : undefined

      return {
        title: joinPreviewParts(seasonTitle, roundLabel) || 'Untitled match',
        subtitle: joinPreviewParts(status, formatPreviewDate(scheduledAt)),
      }
    },
  },
})
