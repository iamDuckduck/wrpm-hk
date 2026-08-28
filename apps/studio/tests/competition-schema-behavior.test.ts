import {describe, expect, it} from 'vitest'
import {match} from '../schemaTypes/documents/match'
import {matchPlayer} from '../schemaTypes/objects/match-player'

type ValidationContext = {
  document?: {_id?: string; status?: string}
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

describe('match schema player validation', () => {
  const validatePlayers = getValidator(field(matchFields, 'players'))

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
    expect(validatePlayers(fourPlayers({score: 1}), {document: {status: 'cancelled'}})).toContain(
      'members only',
    )
  })

  it('requires scores but calculates placements outside the stored document', () => {
    expect(validatePlayers(fourPlayers(), {document: {status: 'completed'}})).toContain('score')
    expect(
      validatePlayers(
        fourPlayers().map((item, index) => ({
          ...item,
          score: index + 1,
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

  it('does not constrain sequence uniqueness or contiguity', () => {
    const sequenceField = field(matchFields, 'sequence')
    let customCalled = false
    const rule = {
      required() {
        return rule
      },
      integer() {
        return rule
      },
      min() {
        return rule
      },
      custom() {
        customCalled = true
        return rule
      },
    }

    sequenceField.validation?.(rule)
    expect(customCalled).toBe(false)
  })

  it('gates the score field by match status', () => {
    const validateScore = getValidator(field(playerFields, 'score'))

    expect(validateScore(undefined, {document: {status: 'completed'}})).toContain('score')
    expect(validateScore(1, {document: {status: 'scheduled'}})).toContain('must not')
  })
})
