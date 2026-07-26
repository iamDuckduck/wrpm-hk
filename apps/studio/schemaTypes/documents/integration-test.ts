import {defineField, defineType} from 'sanity'

export const integrationTest = defineType({
  name: 'integrationTest',
  title: 'Integration Test',
  type: 'document',
  fields: [
    defineField({
      name: 'message',
      title: 'Message',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
