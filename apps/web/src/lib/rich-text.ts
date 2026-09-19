export type PortableTextSpan = {
  _key: string
  _type: 'span'
  text: string
  marks?: string[]
}

export type PortableTextMarkDefinition = {
  _key: string
  _type: string
  href?: string
}

export type PortableTextBlock = {
  _key: string
  _type: 'block'
  style?: 'normal'
  listItem?: 'bullet' | 'number'
  level?: number
  children?: PortableTextSpan[]
  markDefs?: PortableTextMarkDefinition[]
}

export type RichTextValue = string | PortableTextBlock[] | null | undefined

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function safeHref(value: string | undefined) {
  const href = value?.trim()
  if (!href) return null

  if (href.startsWith('#') || href.startsWith('?') || (href.startsWith('/') && !href.startsWith('//'))) {
    return href
  }

  try {
    const url = new URL(href)
    return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? href : null
  } catch {
    return null
  }
}

function renderSpan(span: PortableTextSpan, markDefs: Map<string, PortableTextMarkDefinition>) {
  let html = escapeHtml(span.text).replaceAll(/\r?\n/g, '<br>')

  for (const mark of span.marks ?? []) {
    if (mark === 'strong') {
      html = `<strong>${html}</strong>`
      continue
    }

    if (mark === 'em') {
      html = `<em>${html}</em>`
      continue
    }

    const definition = markDefs.get(mark)
    if (definition?._type !== 'link') continue

    const href = safeHref(definition.href)
    if (!href) continue

    const external = href.startsWith('http://') || href.startsWith('https://')
    html = `<a href="${escapeHtml(href)}"${external ? ' rel="noreferrer noopener"' : ''}>${html}</a>`
  }

  return html
}

function renderBlock(block: PortableTextBlock) {
  const markDefs = new Map((block.markDefs ?? []).map((definition) => [definition._key, definition]))
  return (block.children ?? []).map((span) => renderSpan(span, markDefs)).join('')
}

function renderLegacy(value: string) {
  return value
    .trim()
    .split(/\r?\n\s*\r?\n+/)
    .filter((paragraph) => paragraph.trim().length > 0)
    .map((paragraph) => `<p>${escapeHtml(paragraph.trim()).replaceAll(/\r?\n/g, '<br>')}</p>`)
    .join('')
}

export function hasRichText(value: RichTextValue) {
  if (typeof value === 'string') return value.trim().length > 0
  return Array.isArray(value) && value.some((block) => renderBlock(block).trim().length > 0)
}

export function richTextToPlainText(value: RichTextValue) {
  if (typeof value === 'string') return value.trim()
  if (!Array.isArray(value)) return ''

  return value
    .map((block) => (block.children ?? []).map((span) => span.text).join(''))
    .filter(Boolean)
    .join('\n')
    .trim()
}

export function toRichTextHtml(value: RichTextValue) {
  if (typeof value === 'string') return renderLegacy(value)
  if (!Array.isArray(value)) return ''

  let html = ''
  let openList: 'bullet' | 'number' | null = null

  const closeList = () => {
    if (!openList) return
    html += openList === 'bullet' ? '</ul>' : '</ol>'
    openList = null
  }

  for (const block of value) {
    if (block._type !== 'block') continue

    if (block.listItem) {
      if (openList !== block.listItem) {
        closeList()
        html += block.listItem === 'bullet' ? '<ul>' : '<ol>'
        openList = block.listItem
      }
      html += `<li>${renderBlock(block)}</li>`
      continue
    }

    closeList()
    html += `<p>${renderBlock(block)}</p>`
  }

  closeList()
  return html
}
