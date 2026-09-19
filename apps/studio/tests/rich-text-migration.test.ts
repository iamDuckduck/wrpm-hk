import {describe, expect, it} from 'vitest'
import {
  buildRichTextPatches,
  convertLocalizedText,
  plainTextToPortableText,
} from '../migrations/rich-text-descriptions/content'

describe('rich-text description migration', () => {
  it('preserves paragraphs, manual line breaks, and locales', () => {
    expect(convertLocalizedText({
      zhHk: '第一行\n第二行\n\n下一段',
      en: 'English',
      ja: '',
    })).toEqual({
      _type: 'localizedPortableText',
      zhHk: [
        expect.objectContaining({children: [expect.objectContaining({text: '第一行\n第二行'})]}),
        expect.objectContaining({children: [expect.objectContaining({text: '下一段'})]}),
      ],
      en: [expect.objectContaining({children: [expect.objectContaining({text: 'English'})]})],
    })
  })

  it('does not generate empty blocks', () => {
    expect(plainTextToPortableText('  ')).toEqual([])
    expect(convertLocalizedText({en: '  '})).toBeNull()
  })

  it('skips rich content that already exists and addresses hero slides by key', () => {
    const patches = buildRichTextPatches({
      _type: 'homePage',
      aboutText: {en: 'Legacy about'},
      aboutTextRich: {en: [{_type: 'block'}]},
      heroSlides: [
        {_key: 'first', description: {en: 'Legacy slide'}},
        {
          _key: 'second',
          description: {en: 'Do not copy'},
          descriptionRich: {en: [{_type: 'block'}]},
        },
      ],
    })

    expect(patches).toHaveLength(1)
    expect(patches[0].path).toBe('heroSlides[_key=="first"].descriptionRich')
  })
})
