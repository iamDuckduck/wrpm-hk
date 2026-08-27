import {describe, expect, it} from 'vitest'
import {match} from '../schemaTypes/documents/match'
import {matchPlayer} from '../schemaTypes/objects/match-player'

type ValidationDocument = {
  _id?: string
  status?: string
  stage?: {_ref?: string}
  matchType?: {_ref?: string}
}
type ValidationClient = {
  fetch: (query: string, params: Record<string, unknown>) => Promise<unknown>
}
type ValidationContext = {
  document?: ValidationDocument
  getClient?: (options: {apiVersion: string}) => ValidationClient
}
type Validator = (
  value: unknown,
  context: ValidationContext,
) => true | string | Promise<true | string>

function getValidator(field: {validation?: (rule: unknown) => unknown}): Validator {
  let validator: Validator | undefined
  const rule = {
    required() {
      return rule
    },
    length() {
      return rule
    },
    integer() {
      return rule
    },
    min() {
      return rule
    },
    max() {
      return rule
    },
    custom(next: Validator) {
      validator = next
      return rule
    },
  }

  field.validation?.(rule)
  return validator ?? (() => 'Expected a custom validator')
}

function getAsyncValidator(field: {validation?: (rule: unknown) => unknown}) {
  const validator = getValidator(field)
  return async (value: unknown, context: ValidationContext) => validator(value, context)
}

function player(memberId: string, fields: Record<string, unknown> = {}) {
  return {member: {_ref: memberId}, ...fields}
}

function fourPlayers(fields: Record<string, unknown> = {}) {
  return ['alice', 'bob', 'carol', 'dave'].map((memberId) => player(memberId, fields))
}

const matchFields = match.fields as Array<{name: string; validation?: (rule: unknown) => unknown}>
const playerFields = matchPlayer.fields as Array<{
  name: string
  validation?: (rule: unknown) => unknown
}>

function field(fields: Array<{name: string; validation?: (rule: unknown) => unknown}>, name: string) {
  const found = fields.find((item) => item.name === name)
  if (!found) throw new Error(`Missing ${name} field`)
  return found
}

function sequenceContext(otherSequences: number[]) {
  const calls: Array<{query: string; params: Record<string, unknown>}> = []

  return {
    calls,
    context: {
      document: {
        _id: 'match-current',
        stage: {_ref: 'stage-a'},
        matchType: {_ref: 'type-a'},
      },
      getClient: () => ({
        fetch: async (query: string, params: Record<string, unknown>) => {
          calls.push({query, params})
          return otherSequences.map((sequence, index) => ({
            _id: `match-other-${index}`,
            sequence,
          }))
        },
      }),
    } satisfies ValidationContext,
  }
}

describe('match schema player validation', () => {
  const validatePlayers = getValidator(field(matchFields, 'players'))
  const validateSequence = getAsyncValidator(field(matchFields, 'sequence'))

  it('requires exactly four unique members for every status', () => {
    expect(validatePlayers(fourPlayers(), {document: {status: 'scheduled'}})).toBe(true)
    expect(validatePlayers(fourPlayers().slice(0, 3), {document: {status: 'scheduled'}})).toContain(
      'exactly four',
    )
    expect(
      validatePlayers(
        [player('alice'), player('bob'), player('alice'), player('dave')],
        {document: {status: 'cancelled'}},
      ),
    ).toContain('unique')
  })

  it('accepts only members for scheduled and cancelled matches', () => {
    expect(
      validatePlayers(fourPlayers({score: 1}), {document: {status: 'scheduled'}}),
    ).toContain('members only')
    expect(
      validatePlayers(fourPlayers({placement: 1}), {document: {status: 'cancelled'}}),
    ).toContain('members only')
  })

  it('requires scores and the official 1-to-4 placement set for completed matches', () => {
    expect(
      validatePlayers(
        fourPlayers({placement: 1}),
        {document: {status: 'completed'}},
      ),
    ).toContain('score')
    expect(
      validatePlayers(
        [
          player('alice', {score: 4, placement: 1}),
          player('bob', {score: 3, placement: 1}),
          player('carol', {score: 2, placement: 3}),
          player('dave', {score: 1, placement: 4}),
        ],
        {document: {status: 'completed'}},
      ),
    ).toContain('unique')
    expect(
      validatePlayers(
        fourPlayers().map((item, index) => ({
          ...item,
          score: index + 1,
          placement: index + 1,
        })),
        {document: {status: 'completed'}},
      ),
    ).toBe(true)
  })

  it('requires a valid HTTP(S) details URL only for completed matches', () => {
    const validateDetailsUrl = getValidator(field(matchFields, 'detailsUrl'))

    expect(validateDetailsUrl('https://example.invalid/match', {document: {status: 'completed'}})).toBe(
      true,
    )
    expect(validateDetailsUrl(undefined, {document: {status: 'completed'}})).toContain('require')
    expect(validateDetailsUrl('ftp://example.invalid/match', {document: {status: 'completed'}})).toContain(
      'HTTP',
    )
    expect(validateDetailsUrl('https://', {document: {status: 'completed'}})).not.toBe(true)
    expect(validateDetailsUrl('https://?missing-host', {document: {status: 'completed'}})).not.toBe(true)
    expect(validateDetailsUrl('https://example.invalid/match', {document: {status: 'scheduled'}})).toContain(
      'must not',
    )
  })

  it('accepts a contiguous sequence within one stage and match type', async () => {
    const {context, calls} = sequenceContext([1, 2])

    await expect(validateSequence(3, context)).resolves.toBe(true)
    expect(calls).toHaveLength(1)
    expect(calls[0].query).toContain('stage._ref == $stageId')
    expect(calls[0].query).toContain('matchType._ref == $matchTypeId')
    expect(calls[0].params).toMatchObject({stageId: 'stage-a', matchTypeId: 'type-a'})
  })

  it('rejects duplicate, gapped, and non-one-starting group sequences', async () => {
    await expect(validateSequence(2, sequenceContext([1, 2]).context)).resolves.toContain('unique')
    await expect(validateSequence(4, sequenceContext([1, 3]).context)).resolves.toContain(
      'consecutive',
    )
    await expect(validateSequence(4, sequenceContext([2, 3]).context)).resolves.toContain(
      'start at 1',
    )
  })

  it('skips the group lookup safely when stage or match type is missing', async () => {
    const context: ValidationContext = {
      document: {_id: 'match-current'},
      getClient: () => ({
        fetch: async () => {
          throw new Error('A missing reference must not query the client')
        },
      }),
    }

    await expect(validateSequence(1, context)).resolves.toBe(true)
  })

  it('gates score and placement fields by match status', () => {
    const validateScore = getValidator(field(playerFields, 'score'))
    const validatePlacement = getValidator(field(playerFields, 'placement'))

    expect(validateScore(undefined, {document: {status: 'completed'}})).toContain('score')
    expect(validateScore(1, {document: {status: 'scheduled'}})).toContain('must not')
    expect(validatePlacement(1.5, {document: {status: 'completed'}})).toContain('integers')
    expect(validatePlacement(5, {document: {status: 'completed'}})).toContain('1 to 4')
    expect(validatePlacement(1, {document: {status: 'scheduled'}})).toContain('must not')
  })
})
