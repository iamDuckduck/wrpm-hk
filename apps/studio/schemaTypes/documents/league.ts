import {defineArrayMember, defineField, defineType} from 'sanity'
import {firstPreviewText, joinPreviewParts} from '../utils/preview'

export const league = defineType({
  name: 'league',
  title: 'League',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
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
      name: 'intro',
      title: 'Introduction',
      type: 'localizedText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localizedText',
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
      status: 'status',
    },
    prepare({titleZhHk, titleEn, slug, status}) {
      return {
        title: firstPreviewText(titleZhHk, titleEn, slug) ?? 'Untitled league',
        subtitle: joinPreviewParts(slug, status),
      }
    },
  },
})
