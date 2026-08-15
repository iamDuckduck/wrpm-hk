import {defineField, defineType} from 'sanity'

export const memberCategory = defineType({
  name: 'memberCategory',
  title: 'Member Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'localizedString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name.zhHk', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
  ],
})
