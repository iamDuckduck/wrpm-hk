export type LocalizedPlainText = {
  zhHk?: string
  en?: string
  ja?: string
}

export type PortableTextBlock = {
  _key: string
  _type: 'block'
  style: 'normal'
  markDefs: []
  children: Array<{_key: string; _type: 'span'; marks: []; text: string}>
}

export type LocalizedPortableText = {
  _type: 'localizedPortableText'
  zhHk?: PortableTextBlock[]
  en?: PortableTextBlock[]
  ja?: PortableTextBlock[]
}

export type MigrationPatch = {
  path: string
  value: LocalizedPortableText
}

const localeKeys = ['zhHk', 'en', 'ja'] as const

export function plainTextToPortableText(value: string) {
  return value
    .trim()
    .split(/\r?\n\s*\r?\n+/)
    .filter((paragraph) => paragraph.trim().length > 0)
    .map((paragraph, index): PortableTextBlock => ({
      _key: `legacy-block-${index}`,
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _key: `legacy-span-${index}`,
          _type: 'span',
          marks: [],
          text: paragraph.trim().replaceAll(/\r?\n/g, '\n'),
        },
      ],
    }))
}

export function convertLocalizedText(value: unknown): LocalizedPortableText | null {
  if (!value || typeof value !== 'object') return null

  const source = value as LocalizedPlainText
  const converted: LocalizedPortableText = {_type: 'localizedPortableText'}

  for (const locale of localeKeys) {
    const text = source[locale]
    if (typeof text !== 'string' || text.trim().length === 0) continue
    converted[locale] = plainTextToPortableText(text)
  }

  return localeKeys.some((locale) => converted[locale]?.length) ? converted : null
}

function addPatch(
  patches: MigrationPatch[],
  document: Record<string, unknown>,
  legacyField: string,
  richField: string,
) {
  if (document[richField] !== undefined) return
  const value = convertLocalizedText(document[legacyField])
  if (value) patches.push({path: richField, value})
}

export function buildRichTextPatches(document: Record<string, unknown>): MigrationPatch[] {
  const patches: MigrationPatch[] = []

  if (document._type === 'member') {
    addPatch(patches, document, 'intro', 'introRich')
  }

  if (document._type === 'membersPage') {
    addPatch(patches, document, 'description', 'descriptionRich')
  }

  if (document._type === 'competition') {
    addPatch(patches, document, 'intro', 'introRich')
    addPatch(patches, document, 'description', 'descriptionRich')
  }

  if (document._type === 'homePage') {
    addPatch(patches, document, 'aboutText', 'aboutTextRich')

    const slides = Array.isArray(document.heroSlides) ? document.heroSlides : []
    for (const slide of slides) {
      if (!slide || typeof slide !== 'object') continue
      const item = slide as Record<string, unknown>
      const key = item._key
      if (typeof key !== 'string' || item.descriptionRich !== undefined) continue
      const value = convertLocalizedText(item.description)
      if (!value) continue
      patches.push({
        path: `heroSlides[_key==${JSON.stringify(key)}].descriptionRich`,
        value,
      })
    }
  }

  return patches
}
