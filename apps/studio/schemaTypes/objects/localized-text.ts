import {defineField, defineType} from 'sanity'

export const localizedText = defineType({
  name: 'localizedText',
  title: 'Localized Text',
  type: 'object',
  fields: [
    defineField({
      name: 'zhHk',
      title: '繁體中文 (zh-HK)',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'en',
      title: 'English (en)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'ja',
      title: '日本語 (ja)',
      type: 'text',
      rows: 4,
    }),
  ],
})
