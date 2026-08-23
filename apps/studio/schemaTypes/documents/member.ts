import {defineArrayMember, defineField, defineType} from 'sanity'
import {firstPreviewText} from '../utils/preview'

export const member = defineType({
  name: 'member',
  title: 'Member',
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
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'memberCategory'}],
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'localizedText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'biography',
      title: 'Biography',
      type: 'localizedText',
    }),
    defineField({
      name: 'mediaLinks',
      title: 'Media Links',
      type: 'array',
      of: [defineArrayMember({type: 'memberLink'})],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Active', value: 'active'},
          {title: 'Inactive', value: 'inactive'},
        ],
        layout: 'radio',
      },
      initialValue: 'active',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      nameZhHk: 'name.zhHk',
      nameEn: 'name.en',
      slug: 'slug.current',
      status: 'status',
    },
    prepare({nameZhHk, nameEn, slug, status}) {
      return {
        title: firstPreviewText(nameZhHk, nameEn, slug) ?? 'Untitled member',
        subtitle: firstPreviewText(status) ?? 'No status',
      }
    },
  },
})
