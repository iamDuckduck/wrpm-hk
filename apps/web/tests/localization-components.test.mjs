import {readFileSync} from 'node:fs'
import {describe, expect, it} from 'vitest'

const readComponent = (name) =>
  readFileSync(new URL(`../src/components/${name}`, import.meta.url), 'utf8')

describe('localized homepage chrome', () => {
  it('renders a language switcher for every supported locale', () => {
    const source = readComponent('Navbar.astro')

    expect(source).toContain('getLocalePath(locale)')
    expect(source).toContain('SUPPORTED_LOCALES')
    expect(source).toContain('language-switcher')
    expect(source).toContain('aria-current')
  })

  it('uses locale copy for hero labels and carousel status', () => {
    const source = readComponent('HeroCarousel.astro')

    expect(source).toContain('getLocaleCopy(locale)')
    expect(source).toContain('copy.heroLabel')
    expect(source).toContain('copy.previousSlide')
    expect(source).toContain('copy.slideStatus')
  })

  it('uses locale copy for footer rights text', () => {
    const source = readComponent('Footer.astro')

    expect(source).toContain('getLocaleCopy(locale)')
    expect(source).toContain('copy.footerRights')
  })
})
