import {defineField, defineType} from 'sanity'
import {firstPreviewText, joinPreviewParts} from '../utils/preview'

export const competition = defineType({
  name: 'competition',
  title: 'Competition',
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
      title: 'Introduction (legacy plain text)',
      type: 'localizedText',
      deprecated: {reason: 'Use Formatted introduction instead.'},
      readOnly: true,
      hidden: ({value}) => value === undefined,
    }),
    defineField({
      name: 'introRich',
      title: 'Formatted introduction',
      type: 'localizedPortableText',
    }),
    defineField({
      name: 'description',
      title: 'Description (legacy plain text)',
      type: 'localizedText',
      deprecated: {reason: 'Use Formatted description instead.'},
      readOnly: true,
      hidden: ({value}) => value === undefined,
    }),
    defineField({
      name: 'descriptionRich',
      title: 'Formatted description',
      type: 'localizedPortableText',
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
        title: firstPreviewText(titleZhHk, titleEn, slug) ?? 'Untitled competition',
        subtitle: joinPreviewParts(slug),
      }
    },
  },
})
