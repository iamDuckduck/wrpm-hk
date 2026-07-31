import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {singletonTypes, structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'WRPM website',

  projectId: 'uw34v0nm',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    newDocumentOptions: (previous) =>
      previous.filter((template) => !singletonTypes.has(template.templateId)),
    actions: (previous, context) =>
      singletonTypes.has(context.schemaType)
        ? previous.filter((action) => action.action !== 'duplicate')
        : previous,
  },
})
