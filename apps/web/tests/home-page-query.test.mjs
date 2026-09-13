import {readFileSync} from 'node:fs'
import {describe, expect, it} from 'vitest'

const querySource = readFileSync(
  new URL('../src/queries/home-page.ts', import.meta.url),
  'utf8',
)

describe('homepage query localization', () => {
  it('selects localized content with a Traditional Chinese fallback where configured', () => {
    expect(querySource).toContain('$locale')
    expect(querySource).toContain('$locale == "en" =>')
    expect(querySource).toContain('$locale == "ja" =>')
    expect(querySource).toContain('coalesce(')
    expect(querySource).toContain('organizationName.zhHk')
    expect(querySource).toContain('title.zhHk')
    expect(querySource).toContain('description.zhHk')
    expect(querySource).toContain('aboutHeading.zhHk')
    expect(querySource).toContain('aboutText.zhHk')
    expect(querySource).toContain('"aboutHeading": select(')
    expect(querySource).not.toContain('"aboutHeading": coalesce(')
  })
})
