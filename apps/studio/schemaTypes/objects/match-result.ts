import {defineField, defineType} from 'sanity'

export const matchResult = defineType({
  name: 'matchResult',
  title: 'Match Result',
  type: 'object',
  fields: [
    defineField({
      name: 'member',
      title: 'Member',
      type: 'reference',
      to: [{type: 'member'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'score',
      title: 'Score',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
