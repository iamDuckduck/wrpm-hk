import {defineArrayMember, defineField, defineType} from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroSlides',
      title: 'Hero Slides',
      type: 'array',
      of: [defineArrayMember({type: 'heroSlide'})],
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'aboutHeading',
      title: 'About Heading',
      type: 'localizedString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'aboutText',
      title: 'About text (legacy plain text)',
      type: 'localizedText',
      deprecated: {reason: 'Use Formatted about text instead.'},
      readOnly: true,
      hidden: ({value}) => value === undefined,
    }),
    defineField({
      name: 'aboutTextRich',
      title: 'Formatted about text',
      type: 'localizedPortableText',
    }),
  ],
})
