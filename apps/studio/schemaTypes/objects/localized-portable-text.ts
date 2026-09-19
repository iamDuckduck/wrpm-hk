import {defineArrayMember, defineField, defineType} from 'sanity'

const portableText = defineArrayMember({
  type: 'block',
  styles: [{title: 'Normal', value: 'normal'}],
  lists: [
    {title: 'Bullet list', value: 'bullet'},
    {title: 'Numbered list', value: 'number'},
  ],
  marks: {
    decorators: [
      {title: 'Bold', value: 'strong'},
      {title: 'Italic', value: 'em'},
    ],
    annotations: [
      {
        name: 'link',
        title: 'Link',
        type: 'object',
        fields: [
          defineField({
            name: 'href',
            title: 'URL',
            type: 'url',
            validation: (Rule) =>
              Rule.required().uri({scheme: ['http', 'https', 'mailto'], allowRelative: true}),
          }),
        ],
      },
    ],
  },
})

export const localizedPortableText = defineType({
  name: 'localizedPortableText',
  title: 'Localized formatted text',
  type: 'object',
  fields: [
    defineField({name: 'zhHk', title: '繁體中文', type: 'array', of: [portableText]}),
    defineField({name: 'en', title: 'English', type: 'array', of: [portableText]}),
    defineField({name: 'ja', title: '日本語', type: 'array', of: [portableText]}),
  ],
})
