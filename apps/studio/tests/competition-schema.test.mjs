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
  matchPlayer: new URL('../schemaTypes/objects/match-player.ts', import.meta.url),
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
  matchPlayerSource,
  indexSource,
] = await Promise.all([
  readFile(sourceUrls.competition, 'utf8'),
  readFile(sourceUrls.competitionSeason, 'utf8'),
  readOptionalSource(sourceUrls.matchStage),
  readOptionalSource(sourceUrls.matchType),
  readFile(sourceUrls.match, 'utf8'),
  readFile(sourceUrls.matchPlayer, 'utf8'),
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
  const fieldsEndWithPreview = source.indexOf('\n  ],\n  preview:', start)
  const fieldsEnd = fieldsEndWithPreview >= 0 ? fieldsEndWithPreview : source.indexOf('\n  ],', start)
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

test('defines the approved Match Player source contract', () => {
  assert.match(
    matchPlayerSource,
    /export const matchPlayer = defineType\(\{\s*name:\s*'matchPlayer',\s*title:\s*'Match Player',\s*type:\s*'object'/,
  )
  assert.deepEqual(fieldNames(matchPlayerSource), ['member', 'score', 'placement'])

  const memberField = fieldSource(matchPlayerSource, 'member')
  assert.match(memberField, /type:\s*'reference'/)
  assert.match(memberField, /to:\s*\[\{type:\s*'member'\}\]/)
  assert.match(memberField, /Rule\.required\(\)/)

  const scoreField = fieldSource(matchPlayerSource, 'score')
  assert.match(scoreField, /type:\s*'number'/)
  assert.match(scoreField, /status !== 'completed'/)
  assert.match(scoreField, /Completed matches require a score/)

  const placementField = fieldSource(matchPlayerSource, 'placement')
  assert.match(placementField, /type:\s*'number'/)
  assert.match(placementField, /status !== 'completed'/)
  assert.match(placementField, /Completed match placements/)
  assert.match(placementField, /integer\(\)/)
  assert.match(placementField, /min\(1\)/)
  assert.match(placementField, /max\(4\)/)
})

test('defines the refactored Match source contract', () => {
  assert.deepEqual(fieldNames(matchSource), [
    'title',
    'stage',
    'matchType',
    'sequence',
    'status',
    'detailsUrl',
    'players',
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
  assert.match(detailsUrlField, /new URL\(url\)/)
  assert.match(detailsUrlField, /parsed\.hostname/)
  assert.match(detailsUrlField, /\['http:', 'https:'\]/)
  assert.match(detailsUrlField, /status === 'completed'/)
  assert.match(detailsUrlField, /!url|!value|value === undefined/)
  assert.match(detailsUrlField, /Completed matches require/)

  const playersField = fieldSource(matchSource, 'players')
  assert.match(playersField, /type:\s*'array'/)
  assert.match(playersField, /defineArrayMember\(\{type:\s*'matchPlayer'\}\)/)
  assert.match(playersField, /(?:\.length\(4\)|\.min\(4\)[\s\S]*\.max\(4\))/)
  assert.match(playersField, /exactly four/i)
  assert.match(playersField, /new Set\(memberIds\)\.size (?:===|!==) 4/)
  assert.match(playersField, /status === 'completed'/)
  assert.match(matchSource, /!==\s*'completed'/)
  assert.match(playersField, /placement/)
  assert.match(playersField, /score/)
  assert.doesNotMatch(matchSource, /name:\s*'results'/)

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
  assert.match(indexSource, /import \{matchPlayer\} from '\.\/objects\/match-player'/)
  assert.doesNotMatch(indexSource, /objects\/match-result/)
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
  assert.ok(registeredNames.includes('matchPlayer'))
  assert.ok(!registeredNames.includes('league'))
  assert.ok(!registeredNames.includes('leagueSeason'))
})
