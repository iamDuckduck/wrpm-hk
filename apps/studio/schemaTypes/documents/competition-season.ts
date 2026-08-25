import {defineArrayMember, defineField, defineType} from 'sanity'
import {firstPreviewText, formatPreviewDate, joinPreviewParts} from '../utils/preview'

export const competitionSeason = defineType({
  name: 'competitionSeason',
  title: 'Competition Season',
  type: 'document',
  fields: [
    defineField({
      name: 'competition',
      title: 'Competition',
      type: 'reference',
      to: [{type: 'competition'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Season Title',
      type: 'localizedString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title.zhHk', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Upcoming', value: 'upcoming'},
          {title: 'Ongoing', value: 'ongoing'},
          {title: 'Completed', value: 'completed'},
        ],
        layout: 'radio',
      },
      initialValue: 'upcoming',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startsAt',
      title: 'Starts At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endsAt',
      title: 'Ends At',
      type: 'datetime',
    }),
    defineField({
      name: 'participants',
      title: 'Participants',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'member'}]})],
      validation: (Rule) => Rule.required().min(1).unique(),
    }),
  ],
  preview: {
    select: {
      titleZhHk: 'title.zhHk',
      titleEn: 'title.en',
      slug: 'slug.current',
      competitionTitleZhHk: 'competition.title.zhHk',
      competitionTitleEn: 'competition.title.en',
      status: 'status',
      startsAt: 'startsAt',
    },
    prepare({
      titleZhHk,
      titleEn,
      slug,
      competitionTitleZhHk,
      competitionTitleEn,
      status,
      startsAt,
    }) {
      const seasonTitle = firstPreviewText(titleZhHk, titleEn, slug) ?? 'Untitled season'
      const competitionTitle = firstPreviewText(competitionTitleZhHk, competitionTitleEn)

      return {
        title: seasonTitle,
        subtitle: joinPreviewParts(competitionTitle, status, formatPreviewDate(startsAt)),
      }
    },
  },
})
