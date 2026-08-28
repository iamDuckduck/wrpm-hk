import {defineConfig, type Template} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {singletonTypes, structure} from './structure'

const parentedTemplates: Template[] = [
  {
    id: 'season-from-competition',
    title: 'Competition Season',
    schemaType: 'competitionSeason',
    parameters: [{name: 'competitionId', type: 'string'}],
    value: ({competitionId}: {competitionId: string}) => ({
      competition: {_type: 'reference', _ref: competitionId},
    }),
  },
  {
    id: 'stage-from-season',
    title: 'Match Stage',
    schemaType: 'matchStage',
    parameters: [{name: 'seasonId', type: 'string'}],
    value: ({seasonId}: {seasonId: string}) => ({
      season: {_type: 'reference', _ref: seasonId},
    }),
  },
  {
    id: 'match-from-stage',
    title: 'Match',
    schemaType: 'match',
    parameters: [{name: 'stageId', type: 'string'}],
    value: ({stageId}: {stageId: string}) => ({
      stage: {_type: 'reference', _ref: stageId},
    }),
  },
]

export default defineConfig({
  name: 'default',
  title: 'WRPM website',

  projectId: 'uw34v0nm',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    templates: (previous) => [...previous, ...parentedTemplates],
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
