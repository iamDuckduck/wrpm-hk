import {describe, expect, it} from 'vitest'
import {hasRichText, richTextToPlainText, toRichTextHtml, type PortableTextBlock} from './rich-text'

describe('rich text rendering', () => {
  it('preserves legacy paragraphs and line breaks while escaping HTML', () => {
    expect(toRichTextHtml('First line\nSecond <script>\n\nFinal')).toBe(
      '<p>First line<br>Second &lt;script&gt;</p><p>Final</p>',
    )
  })

  it('renders marks, lists, and safe links', () => {
    const value: PortableTextBlock[] = [
      {
        _key: 'a',
        _type: 'block',
        listItem: 'bullet',
        markDefs: [{_key: 'link', _type: 'link', href: 'https://example.com'}],
        children: [
          {_key: 's', _type: 'span', text: 'Safe', marks: ['strong', 'link']},
        ],
      },
      {
        _key: 'b',
        _type: 'block',
        listItem: 'bullet',
        markDefs: [{_key: 'bad', _type: 'link', href: 'javascript:alert(1)'}],
        children: [{_key: 's', _type: 'span', text: 'Plain', marks: ['bad']}],
      },
    ]

    expect(toRichTextHtml(value)).toBe(
      '<ul><li><a href="https://example.com" rel="noreferrer noopener"><strong>Safe</strong></a></li><li>Plain</li></ul>',
    )
  })

  it('detects content and extracts plain text', () => {
    const value: PortableTextBlock[] = [
      {_key: 'a', _type: 'block', children: [{_key: 's', _type: 'span', text: 'Hello'}]},
      {_key: 'b', _type: 'block', children: [{_key: 's', _type: 'span', text: '世界'}]},
    ]

    expect(hasRichText(value)).toBe(true)
    expect(hasRichText('  ')).toBe(false)
    expect(richTextToPlainText(value)).toBe('Hello\n世界')
  })
})
