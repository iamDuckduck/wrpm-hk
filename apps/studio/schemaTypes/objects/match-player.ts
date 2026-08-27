import {defineField, defineType} from 'sanity'

type MatchStatus = 'scheduled' | 'completed' | 'cancelled'

type MatchDocument = {
  status?: MatchStatus
}

function matchStatus(document: unknown): MatchStatus | undefined {
  return (document as MatchDocument | undefined)?.status
}

export const matchPlayer = defineType({
  name: 'matchPlayer',
  title: 'Match Player',
  type: 'object',
  fields: [
    defineField({
      name: 'member',
      title: 'Member',
      type: 'reference',
      to: [{type: 'member'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'score',
      title: 'Score',
      type: 'number',
      hidden: ({document}) => matchStatus(document) !== 'completed',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const status = matchStatus(context.document)

          if (status !== 'completed') {
            return value === undefined
              ? true
              : 'Scheduled and cancelled matches must not include player scores.'
          }

          return typeof value === 'number' && Number.isFinite(value)
            ? true
            : 'Completed matches require a score for every player.'
        }),
    }),
  ],
})
