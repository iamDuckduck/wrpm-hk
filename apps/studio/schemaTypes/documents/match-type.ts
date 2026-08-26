import {defineField, defineType} from 'sanity'
import {firstPreviewText, joinPreviewParts} from '../utils/preview'

export const matchType = defineType({
  name: 'matchType',
  title: 'Match Type',
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
      options: {source: 'title.en', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      titleZhHk: 'title.zhHk',
      titleEn: 'title.en',
      slug: 'slug.current',
    },
    prepare({titleZhHk, titleEn, slug}) {
      return {
        title: firstPreviewText(titleZhHk, titleEn, slug) ?? 'Untitled match type',
        subtitle: joinPreviewParts(slug),
      }
    },
  },
})
