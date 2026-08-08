import {readFileSync} from 'node:fs'
import {describe, expect, it} from 'vitest'

const readSource = (path) =>
  readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8')

describe('localized homepage routes', () => {
  it('uses one shared homepage component for the default route', () => {
    expect(readSource('pages/index.astro')).toContain(
      '<HomePage locale="zh-HK" />',
    )
    expect(readSource('components/HomePage.astro')).toContain(
      'getSanityLocaleKey(locale)',
    )
  })

  it('generates only the English and Japanese locale routes', () => {
    const routeSource = readSource('pages/[locale].astro')

    expect(routeSource).toContain('getStaticPaths')
    expect(routeSource).toContain('PUBLIC_LOCALES')
    expect(routeSource).toContain('<HomePage locale={locale} />')
  })

  it('sets the document language from the selected locale', () => {
    expect(readSource('layouts/BaseLayout.astro')).toContain(
      '<html lang={locale}>',
    )
  })
})
