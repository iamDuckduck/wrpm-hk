import {defineField, defineType} from 'sanity'

export const membersPage = defineType({
  name: 'membersPage',
  title: 'Members Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'localizedString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Page Description',
      type: 'localizedText',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
