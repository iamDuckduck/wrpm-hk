import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import test from 'node:test'
import {URL} from 'node:url'

const sourceUrls = {
  competition: new URL('../schemaTypes/documents/competition.ts', import.meta.url),
  competitionSeason: new URL('../schemaTypes/documents/competition-season.ts', import.meta.url),
  match: new URL('../schemaTypes/documents/match.ts', import.meta.url),
  index: new URL('../schemaTypes/index.ts', import.meta.url),
}

const [competitionSource, competitionSeasonSource, matchSource, indexSource] =
  await Promise.all(Object.values(sourceUrls).map((url) => readFile(url, 'utf8')))

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

test('references Competition Seasons from Match source', () => {
  const seasonReference = fieldSource(matchSource, 'season')

  assert.match(seasonReference, /title:\s*'Competition Season'/)
  assert.match(seasonReference, /type:\s*'reference'/)
  assert.match(seasonReference, /to:\s*\[\{type:\s*'competitionSeason'\}\]/)
})

test('registers Competition schemas instead of League schemas', () => {
  assert.match(indexSource, /import \{competition\} from '\.\/documents\/competition'/)
  assert.match(
    indexSource,
    /import \{competitionSeason\} from '\.\/documents\/competition-season'/,
  )
  assert.doesNotMatch(indexSource, /documents\/league(?:-season)?/)

  const schemaTypesArray = indexSource.match(/export const schemaTypes = \[([\s\S]*?)\]\s*$/)
  assert.ok(schemaTypesArray, 'Expected to find the schemaTypes registration array')

  const registeredNames = [...schemaTypesArray[1].matchAll(/^\s*([A-Za-z]\w*),\s*$/gm)].map(
    (match) => match[1],
  )

  assert.ok(registeredNames.includes('competition'))
  assert.ok(registeredNames.includes('competitionSeason'))
  assert.ok(!registeredNames.includes('league'))
  assert.ok(!registeredNames.includes('leagueSeason'))
})
