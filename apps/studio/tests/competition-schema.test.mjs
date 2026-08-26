import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import test from 'node:test'
import {URL} from 'node:url'

const sourceUrls = {
  competition: new URL('../schemaTypes/documents/competition.ts', import.meta.url),
  competitionSeason: new URL('../schemaTypes/documents/competition-season.ts', import.meta.url),
  matchStage: new URL('../schemaTypes/documents/match-stage.ts', import.meta.url),
  matchType: new URL('../schemaTypes/documents/match-type.ts', import.meta.url),
  match: new URL('../schemaTypes/documents/match.ts', import.meta.url),
  index: new URL('../schemaTypes/index.ts', import.meta.url),
}

async function readOptionalSource(url) {
  try {
    return await readFile(url, 'utf8')
  } catch (error) {
    if (error?.code === 'ENOENT') return ''
    throw error
  }
}

const [
  competitionSource,
  competitionSeasonSource,
  matchStageSource,
  matchTypeSource,
  matchSource,
  indexSource,
] = await Promise.all([
  readFile(sourceUrls.competition, 'utf8'),
  readFile(sourceUrls.competitionSeason, 'utf8'),
  readOptionalSource(sourceUrls.matchStage),
  readOptionalSource(sourceUrls.matchType),
  readFile(sourceUrls.match, 'utf8'),
  readFile(sourceUrls.index, 'utf8'),
])

function fieldMatches(source) {
  return [...source.matchAll(/defineField\(\{\s*name:\s*'([^']+)'/g)]
}

function fieldNames(source) {
  return fieldMatches(source).map((match) => match[1])
}

function fieldSource(source, fieldName) {
  const matches = fieldMatches(source)
  const fieldIndex = matches.findIndex((match) => match[1] === fieldName)

  assert.notEqual(fieldIndex, -1, `Expected field ${fieldName}`)

  const start = matches[fieldIndex].index
  const nextFieldStart = matches[fieldIndex + 1]?.index
  const fieldsEnd = source.indexOf('\n  ],\n  preview:', start)
  const end = nextFieldStart ?? fieldsEnd

  assert.ok(end > start, `Expected to locate the end of field ${fieldName}`)

  return source.slice(start, end)
}

function assertFieldType(source, fieldName, typeName) {
  assert.match(fieldSource(source, fieldName), new RegExp(`\\btype:\\s*'${typeName}'`))
}

test('defines the approved Competition source contract', () => {
  assert.match(
    competitionSource,
    /export const competition = defineType\(\{\s*name:\s*'competition',\s*title:\s*'Competition',\s*type:\s*'document'/,
  )
  assert.deepEqual(fieldNames(competitionSource), ['title', 'slug', 'intro', 'description'])
  assertFieldType(competitionSource, 'title', 'localizedString')
  assertFieldType(competitionSource, 'slug', 'slug')
  assertFieldType(competitionSource, 'intro', 'localizedText')
  assertFieldType(competitionSource, 'description', 'localizedText')
})

test('defines the approved Competition Season source contract', () => {
  assert.match(
    competitionSeasonSource,
    /export const competitionSeason = defineType\(\{\s*name:\s*'competitionSeason',\s*title:\s*'Competition Season',\s*type:\s*'document'/,
  )
  assert.deepEqual(fieldNames(competitionSeasonSource), [
    'competition',
    'title',
    'slug',
    'status',
    'startsAt',
    'endsAt',
    'participants',
  ])

  const competitionReference = fieldSource(competitionSeasonSource, 'competition')
  assert.match(competitionReference, /type:\s*'reference'/)
  assert.match(competitionReference, /to:\s*\[\{type:\s*'competition'\}\]/)

  assertFieldType(competitionSeasonSource, 'title', 'localizedString')
  assertFieldType(competitionSeasonSource, 'slug', 'slug')
  assertFieldType(competitionSeasonSource, 'status', 'string')
  assertFieldType(competitionSeasonSource, 'startsAt', 'datetime')
  assertFieldType(competitionSeasonSource, 'endsAt', 'datetime')
  assertFieldType(competitionSeasonSource, 'participants', 'array')
  assert.match(
    fieldSource(competitionSeasonSource, 'participants'),
    /defineArrayMember\(\{type:\s*'reference',\s*to:\s*\[\{type:\s*'member'\}\]\}\)/,
  )
})

test('references Match Stages from Match source', () => {
  const stageReference = fieldSource(matchSource, 'stage')

  assert.match(stageReference, /title:\s*'Stage'/)
  assert.match(stageReference, /type:\s*'reference'/)
  assert.match(stageReference, /to:\s*\[\{type:\s*'matchStage'\}\]/)
  assert.match(stageReference, /Rule\.required\(\)/)
})

test('defines the approved Match Stage source contract', () => {
  assert.match(
    matchStageSource,
    /export const matchStage = defineType\(\{\s*name:\s*'matchStage',\s*title:\s*'Match Stage',\s*type:\s*'document'/,
  )
  assert.deepEqual(fieldNames(matchStageSource), ['season', 'title', 'startsOn', 'endsOn'])

  const seasonReference = fieldSource(matchStageSource, 'season')
  assert.match(seasonReference, /type:\s*'reference'/)
  assert.match(seasonReference, /to:\s*\[\{type:\s*'competitionSeason'\}\]/)
  assert.match(seasonReference, /Rule\.required\(\)/)

  const titleField = fieldSource(matchStageSource, 'title')
  assert.match(titleField, /type:\s*'localizedString'/)
  assert.match(titleField, /Rule\.required\(\)/)

  const startsOnField = fieldSource(matchStageSource, 'startsOn')
  assert.match(startsOnField, /type:\s*'date'/)
  assert.match(startsOnField, /Rule\.required\(\)/)

  const endsOnField = fieldSource(matchStageSource, 'endsOn')
  assert.match(endsOnField, /type:\s*'date'/)
  assert.doesNotMatch(endsOnField, /Rule\.required\(\)/)
  assert.match(endsOnField, /Rule\.custom/)
  assert.match(endsOnField, /startsOn/)
  assert.match(endsOnField, /new Date\(value\)/)
  assert.match(endsOnField, /new Date\(startsOn\)/)
  assert.match(endsOnField, /endsOn >= startsOnDate/)
})

test('defines the approved Match Type source contract', () => {
  assert.match(
    matchTypeSource,
    /export const matchType = defineType\(\{\s*name:\s*'matchType',\s*title:\s*'Match Type',\s*type:\s*'document'/,
  )
  assert.deepEqual(fieldNames(matchTypeSource), ['title', 'slug'])
  assertFieldType(matchTypeSource, 'title', 'localizedString')
  assert.match(fieldSource(matchTypeSource, 'title'), /Rule\.required\(\)/)

  const slugField = fieldSource(matchTypeSource, 'slug')
  assert.match(slugField, /type:\s*'slug'/)
  assert.match(slugField, /source:\s*'title\.en'/)
  assert.match(slugField, /maxLength:\s*96/)
  assert.match(slugField, /Rule\.required\(\)/)
})

test('defines the refactored Match source contract', () => {
  assert.deepEqual(fieldNames(matchSource), [
    'title',
    'stage',
    'matchType',
    'sequence',
    'status',
    'detailsUrl',
    'results',
  ])

  assertFieldType(matchSource, 'title', 'localizedString')
  assert.match(fieldSource(matchSource, 'title'), /Rule\.required\(\)/)

  const matchTypeReference = fieldSource(matchSource, 'matchType')
  assert.match(matchTypeReference, /type:\s*'reference'/)
  assert.match(matchTypeReference, /to:\s*\[\{type:\s*'matchType'\}\]/)
  assert.match(matchTypeReference, /Rule\.required\(\)/)

  const sequenceField = fieldSource(matchSource, 'sequence')
  assert.match(sequenceField, /type:\s*'number'/)
  assert.match(sequenceField, /Rule\.required\(\)/)
  assert.match(sequenceField, /\.integer\(\)/)
  assert.match(sequenceField, /\.min\(1\)/)

  const statusField = fieldSource(matchSource, 'status')
  assert.match(statusField, /initialValue:\s*'scheduled'/)
  assert.match(statusField, /scheduled/)
  assert.match(statusField, /completed/)
  assert.match(statusField, /cancelled/)

  const detailsUrlField = fieldSource(matchSource, 'detailsUrl')
  assert.match(detailsUrlField, /type:\s*'url'/)
  assert.match(detailsUrlField, /Rule\.custom/)
  assert.ok(detailsUrlField.includes('/^https?:\\/\\//i'))
  assert.match(detailsUrlField, /status === 'completed'/)
  assert.match(detailsUrlField, /!url|!value|value === undefined/)
  assert.match(detailsUrlField, /Completed matches require/)

  const resultsField = fieldSource(matchSource, 'results')
  assert.match(resultsField, /type:\s*'array'/)
  assert.match(resultsField, /status === 'completed'/)
  assert.match(resultsField, /results\.length === 0/)
  assert.match(resultsField, /new Set\(memberIds\)\.size === memberIds\.length/)

  assert.doesNotMatch(matchSource, /name:\s*'(season|round|scheduledAt)'/)
  assert.match(matchSource, /preview:\s*\{[\s\S]*titleZhHk: 'title\.zhHk'/)
  assert.match(matchSource, /stageTitleZhHk: 'stage\.title\.zhHk'/)
  assert.match(matchSource, /matchTypeTitleZhHk: 'matchType\.title\.zhHk'/)
  assert.match(matchSource, /sequence: 'sequence'/)
  assert.match(matchSource, /detailsUrl: 'detailsUrl'/)
  assert.doesNotMatch(
    matchSource,
    /seasonTitle|scheduledAt|roundLabel|name:\s*'(season|round|scheduledAt)'/,
  )
})

test('registers Competition schemas instead of League schemas', () => {
  assert.match(indexSource, /import \{competition\} from '\.\/documents\/competition'/)
  assert.match(indexSource, /import \{competitionSeason\} from '\.\/documents\/competition-season'/)
  assert.match(indexSource, /import \{matchStage\} from '\.\/documents\/match-stage'/)
  assert.match(indexSource, /import \{matchType\} from '\.\/documents\/match-type'/)
  assert.doesNotMatch(indexSource, /documents\/league(?:-season)?/)

  const schemaTypesArray = indexSource.match(/export const schemaTypes = \[([\s\S]*?)\]\s*$/)
  assert.ok(schemaTypesArray, 'Expected to find the schemaTypes registration array')

  const registeredNames = [...schemaTypesArray[1].matchAll(/^\s*([A-Za-z]\w*),\s*$/gm)].map(
    (match) => match[1],
  )

  assert.ok(registeredNames.includes('competition'))
  assert.ok(registeredNames.includes('competitionSeason'))
  assert.ok(registeredNames.includes('matchStage'))
  assert.ok(registeredNames.includes('matchType'))
  assert.ok(!registeredNames.includes('league'))
  assert.ok(!registeredNames.includes('leagueSeason'))
})
