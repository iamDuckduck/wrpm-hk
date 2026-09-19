import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import test from 'node:test'
import {URL} from 'node:url'

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8')

test('registers localized Portable Text with the approved controls', async () => {
  const [index, schema] = await Promise.all([
    read('../schemaTypes/index.ts'),
    read('../schemaTypes/objects/localized-portable-text.ts'),
  ])

  assert.match(index, /localizedPortableText/)
  assert.match(schema, /value:\s*'strong'/)
  assert.match(schema, /value:\s*'em'/)
  assert.match(schema, /value:\s*'bullet'/)
  assert.match(schema, /value:\s*'number'/)
  assert.match(schema, /name:\s*'link'/)
  assert.match(schema, /scheme:\s*\['http', 'https', 'mailto'\]/)
})

test('adds formatted fields while retaining deprecated legacy text', async () => {
  const sources = await Promise.all([
    read('../schemaTypes/documents/member.ts'),
    read('../schemaTypes/documents/members-page.ts'),
    read('../schemaTypes/documents/competition.ts'),
    read('../schemaTypes/documents/home-page.ts'),
    read('../schemaTypes/objects/hero-slide.ts'),
  ])

  for (const source of sources) {
    assert.match(source, /type:\s*'localizedPortableText'/)
    assert.match(source, /deprecated:/)
    assert.match(source, /readOnly:\s*true/)
    assert.match(source, /hidden:\s*\(\{value\}\)\s*=>\s*value === undefined/)
  }
})
