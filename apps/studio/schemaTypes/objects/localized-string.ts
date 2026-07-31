import {defineField, defineType} from 'sanity'

export const localizedString = defineType({
  name: 'localizedString',
  title: 'Localized String',
  type: 'object',
  fields: [
    defineField({
      name: 'zhHk',
      title: '繁體中文 (zh-HK)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'en',
      title: 'English (en)',
      type: 'string',
    }),
    defineField({
      name: 'ja',
      title: '日本語 (ja)',
      type: 'string',
    }),
  ],
})
