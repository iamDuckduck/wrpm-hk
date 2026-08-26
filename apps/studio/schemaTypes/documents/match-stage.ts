import {defineField, defineType} from 'sanity'
import {firstPreviewText, formatPreviewDate, joinPreviewParts} from '../utils/preview'

type MatchStageDocument = {
  startsOn?: string
}

export const matchStage = defineType({
  name: 'matchStage',
  title: 'Match Stage',
  type: 'document',
  fields: [
    defineField({
      name: 'season',
      title: 'Competition Season',
      type: 'reference',
      to: [{type: 'competitionSeason'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Stage Title',
      type: 'localizedString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startsOn',
      title: 'Starts On',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endsOn',
      title: 'Ends On',
      type: 'date',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const startsOn = (context.document as MatchStageDocument | undefined)?.startsOn
          const endsOn = typeof value === 'string' && value ? new Date(value) : undefined
          const startsOnDate = startsOn ? new Date(startsOn) : undefined

          if (!endsOn || !startsOnDate) return true

          return endsOn >= startsOnDate ? true : 'Ends On must be on or after Starts On.'
        }),
    }),
  ],
  preview: {
    select: {
      titleZhHk: 'title.zhHk',
      titleEn: 'title.en',
      seasonTitleZhHk: 'season.title.zhHk',
      seasonTitleEn: 'season.title.en',
      startsOn: 'startsOn',
      endsOn: 'endsOn',
    },
    prepare({titleZhHk, titleEn, seasonTitleZhHk, seasonTitleEn, startsOn, endsOn}) {
      const stageTitle = firstPreviewText(titleZhHk, titleEn) ?? 'Untitled match stage'
      const seasonTitle = firstPreviewText(seasonTitleZhHk, seasonTitleEn)

      return {
        title: stageTitle,
        subtitle: joinPreviewParts(
          seasonTitle,
          formatPreviewDate(startsOn),
          formatPreviewDate(endsOn),
        ),
      }
    },
  },
})
