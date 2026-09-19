import {describe, expect, it} from 'vitest'
import {compareMembersByEnglishName, type SortableMember} from './member-sort'

const member = (
  _id: string,
  englishName: string | null,
  name = englishName,
): SortableMember => ({_id, englishName, name})

describe('compareMembersByEnglishName', () => {
  it('sorts English names case-insensitively with numeric ordering', () => {
    const members = [member('3', 'Player 10'), member('1', 'alice'), member('2', 'Player 2')]

    expect(members.sort(compareMembersByEnglishName).map(({_id}) => _id)).toEqual(['1', '2', '3'])
  })

  it('places missing English names last and breaks ties deterministically', () => {
    const members = [
      member('d', null, '張三'),
      member('c', 'Alex', '亞歷士'),
      member('b', null, '王五'),
      member('a', 'alex', 'Alex'),
    ]

    expect(members.sort(compareMembersByEnglishName).map(({_id}) => _id)).toEqual([
      'a',
      'c',
      'd',
      'b',
    ])
  })
})
