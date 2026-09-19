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
      title: 'Page description (legacy plain text)',
      type: 'localizedText',
      deprecated: {reason: 'Use Formatted page description instead.'},
      readOnly: true,
      hidden: ({value}) => value === undefined,
    }),
    defineField({
      name: 'descriptionRich',
      title: 'Formatted page description',
      type: 'localizedPortableText',
    }),
  ],
})
