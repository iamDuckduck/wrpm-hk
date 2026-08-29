import {readFileSync} from 'node:fs'
import {describe, expect, it} from 'vitest'

const querySource = readFileSync(new URL('../src/queries/members.ts', import.meta.url), 'utf8')

describe('members page query localization', () => {
  it('selects English and Japanese values with a Traditional Chinese fallback', () => {
    expect(querySource).toContain('MEMBERS_PAGE_QUERY')
    expect(querySource).toContain('_id == "membersPage"')
    expect(querySource).toContain('$locale')
    expect(querySource).toContain('$locale == "en" =>')
    expect(querySource).toContain('$locale == "ja" =>')
    expect(querySource).toContain('coalesce(')
    expect(querySource).toContain('title.zhHk')
    expect(querySource).toContain('description.zhHk')
  })
})
