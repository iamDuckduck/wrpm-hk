import {defineArrayMember, defineField, defineType} from 'sanity'

export const leagueSeason = defineType({
  name: 'leagueSeason',
  title: 'League Season',
  type: 'document',
  fields: [
    defineField({
      name: 'league',
      title: 'League',
      type: 'reference',
      to: [{type: 'league'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Season Title',
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
      name: 'startsAt',
      title: 'Starts At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endsAt',
      title: 'Ends At',
      type: 'datetime',
    }),
    defineField({
      name: 'participants',
      title: 'Participants',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'member'}]})],
      validation: (Rule) => Rule.required().min(1).unique(),
    }),
  ],
})
