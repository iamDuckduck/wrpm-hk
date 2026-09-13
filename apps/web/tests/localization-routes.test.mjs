import {existsSync, readFileSync} from 'node:fs'
import {describe, expect, it} from 'vitest'

const readSource = (path) =>
  readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8')

describe('localized homepage routes', () => {
  it('uses one shared homepage component for the default route', () => {
    expect(readSource('pages/index.astro')).toContain(
      '<HomePage locale="en" />',
    )
    expect(readSource('components/HomePage.astro')).toContain(
      'getSanityLocaleKey(locale)',
    )
  })

  it('generates only the Traditional Chinese and Japanese locale routes', () => {
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

  it('uses the supplied logo as the primary browser tab icon', () => {
    expect(readSource('layouts/BaseLayout.astro')).toContain(
      '<link rel="icon" type="image/png" href="/favicon.png" />',
    )
    expect(existsSync(new URL('../public/favicon.png', import.meta.url))).toBe(true)
    expect(readFileSync(new URL('../public/favicon.ico', import.meta.url)).byteLength).toBeGreaterThan(
      1000,
    )
  })
})
