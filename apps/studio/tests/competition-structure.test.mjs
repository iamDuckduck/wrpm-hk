import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import test from 'node:test'
import {URL} from 'node:url'

const [structureSource, configSource] = await Promise.all([
  readFile(new URL('../structure.ts', import.meta.url), 'utf8'),
  readFile(new URL('../sanity.config.ts', import.meta.url), 'utf8'),
])

test('nests Competitions into Season, Stage, and Match lists', () => {
  assert.match(structureSource, /\.title\('Competitions'\)/)
  assert.match(
    structureSource,
    /_type == "competitionSeason" && competition\._ref == \$competitionId/,
  )
  assert.match(structureSource, /_type == "matchStage" && season\._ref == \$seasonId/)
  assert.match(structureSource, /_type == "match" && stage\._ref == \$stageId/)
  assert.match(structureSource, /field:\s*'sequence',\s*direction:\s*'asc'/)
  assert.match(structureSource, /\.title\('Details'\)/)
  assert.match(structureSource, /\.title\('Seasons'\)/)
  assert.match(structureSource, /\.title\('Stages'\)/)
  assert.match(structureSource, /\.title\('Matches'\)/)
})

test('hides nested competition types from the flat document list', () => {
  assert.match(structureSource, /nestedDeskTypes/)
  assert.match(structureSource, /'competition'/)
  assert.match(structureSource, /'competitionSeason'/)
  assert.match(structureSource, /'matchStage'/)
  assert.match(structureSource, /'match'/)
  assert.doesNotMatch(
    structureSource,
    /documentTypeListItems\(\)[\s\S]*filter\(\s*\(listItem\) => !singletonTypes/,
  )
})

test('exposes Members Page as a singleton next to Home Page', () => {
  assert.match(structureSource, /'membersPage'/)
  assert.match(structureSource, /singletonListItem\(S, 'membersPage', 'Members Page'\)/)
})

test('pre-fills parent references from nested create templates', () => {
  for (const source of [structureSource, configSource]) {
    assert.match(source, /season-from-competition/)
    assert.match(source, /stage-from-season/)
    assert.match(source, /match-from-stage/)
  }

  assert.match(configSource, /schemaType:\s*'competitionSeason'/)
  assert.match(configSource, /schemaType:\s*'matchStage'/)
  assert.match(configSource, /schemaType:\s*'match'/)
  assert.match(configSource, /competition:\s*\{_type:\s*'reference',\s*_ref:\s*competitionId\}/)
  assert.match(configSource, /season:\s*\{_type:\s*'reference',\s*_ref:\s*seasonId\}/)
  assert.match(configSource, /stage:\s*\{_type:\s*'reference',\s*_ref:\s*stageId\}/)
})
