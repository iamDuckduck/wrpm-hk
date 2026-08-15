import {existsSync, readFileSync} from 'node:fs'
import {describe, expect, it} from 'vitest'

const styles = readFileSync(
  new URL('../src/styles/global.css', import.meta.url),
  'utf8',
)
const heroStyles = readFileSync(
  new URL('../src/components/HeroCarousel.astro', import.meta.url),
  'utf8',
)
const aboutComponentPath = new URL('../src/components/AboutSection.astro', import.meta.url)
const aboutStyles = existsSync(aboutComponentPath)
  ? readFileSync(aboutComponentPath, 'utf8')
  : ''
const homepageSource = readFileSync(
  new URL('../src/pages/index.astro', import.meta.url),
  'utf8',
)
const homepageComponentSource = readFileSync(
  new URL('../src/components/HomePage.astro', import.meta.url),
  'utf8',
)

describe('WRPM visual foundation', () => {
  it('keeps the approved dark sports-broadcast color tokens', () => {
    expect(styles).toContain('--color-background: #131313')
    expect(styles).toContain('--color-primary: #e60012')
    expect(styles).toContain('--color-on-background: #e2e2e2')
  })

  it('keeps the approved typography and container dimensions', () => {
    expect(styles).toContain("--font-display: 'Sora'")
    expect(styles).toContain("--font-body: 'Inter'")
    expect(styles).toContain("--font-label: 'JetBrains Mono'")
    expect(styles).toContain('--container-width: 80rem')
  })

  it('uses the fixed translucent navigation treatment', () => {
    expect(styles).toMatch(/\.site-header\s*{[^}]*position:\s*fixed/s)
    expect(styles).toContain('backdrop-filter: blur(12px)')
  })

  it('preserves the complete mobile hero image in its source ratio', () => {
    expect(heroStyles).toMatch(
      /@media\s*\(max-width:\s*47\.999rem\)[\s\S]*?\.hero-carousel__slide\s*{[\s\S]*?aspect-ratio:\s*13\s*\/\s*9/s,
    )
    expect(heroStyles).toMatch(
      /@media\s*\(max-width:\s*47\.999rem\)[\s\S]*?\.hero-carousel__viewport[\s\S]*?min-height:\s*0/s,
    )
    expect(heroStyles).toMatch(
      /@media\s*\(max-width:\s*47\.999rem\)[\s\S]*?\.hero-carousel__media img\s*{[\s\S]*?object-fit:\s*contain/s,
    )
  })

  it('scales mobile hero copy to fit inside the image frame', () => {
    expect(heroStyles).toMatch(
      /@media\s*\(max-width:\s*47\.999rem\)[\s\S]*?\.hero-carousel h1,[\s\S]*?\.hero-carousel h2\s*{[\s\S]*?font-size:\s*clamp\(1\.5rem,\s*7vw,\s*2\.25rem\)/s,
    )
    expect(heroStyles).toMatch(
      /@media\s*\(max-width:\s*47\.999rem\)[\s\S]*?\.hero-carousel__description\s*{[\s\S]*?margin-top:\s*var\(--space-2\)/s,
    )
  })

  it('matches the approved Figma hero content treatment', () => {
    expect(heroStyles).toMatch(
      /\.hero-carousel__description\s*\{[\s\S]*?border-left:\s*4px solid var\(--color-primary\)/s,
    )
    expect(heroStyles).toContain('padding-left: 1.75rem')
    expect(heroStyles).not.toContain('WRPM / {String(index + 1)')
  })

  it('keeps mobile carousel controls compact and below the copy', () => {
    expect(heroStyles).toMatch(
      /@media\s*\(max-width:\s*47\.999rem\)[\s\S]*?\.hero-carousel h1,[\s\S]*?\.hero-carousel h2\s*{[\s\S]*?font-size:\s*clamp\(1\.5rem,\s*7vw,\s*2\.25rem\)/s,
    )
    expect(heroStyles).toMatch(
      /@media\s*\(max-width:\s*47\.999rem\)[\s\S]*?\.hero-carousel__arrow\s*{[\s\S]*?width:\s*2\.25rem[\s\S]*?height:\s*2\.25rem/s,
    )
    expect(heroStyles).toMatch(
      /@media\s*\(max-width:\s*47\.999rem\)[\s\S]*?\.hero-carousel__dot\s*{[\s\S]*?min-width:\s*2rem[\s\S]*?min-height:\s*2\.25rem/s,
    )
  })

  it('uses compact mobile navigation while preserving the desktop controls', () => {
    expect(styles).toMatch(/\.mobile-navigation\s*{[^}]*display:\s*none/s)
    expect(styles).toMatch(
      /@media\s*\(min-width:\s*48rem\)[\s\S]*?\.mobile-navigation\s*{[^}]*display:\s*block/s,
    )
    expect(styles).toMatch(
      /@media\s*\(min-width:\s*48rem\)[\s\S]*?\.mobile-language-switcher\s*{[^}]*display:\s*none/s,
    )
    expect(styles).toMatch(
      /@media\s*\(min-width:\s*48rem\)[\s\S]*?\.language-switcher\s*{[^}]*display:\s*flex/s,
    )
    expect(styles).not.toMatch(
      /@media\s*\(min-width:\s*48rem\)[\s\S]*?\.desktop-navigation\s*\{[\s\S]*?display:\s*flex/s,
    )
  })

  it('matches the Figma navigation and carousel control treatment', () => {
    expect(styles).toMatch(
      /\.mobile-navigation summary\s*{[\s\S]*?background:\s*transparent/s,
    )
    expect(heroStyles).toContain(
      '<span class="hero-carousel__dash" aria-hidden="true"></span>',
    )
    expect(heroStyles).not.toContain('String(index + 1).padStart(2, \'0\')')
    expect(heroStyles).toMatch(
      /\.hero-carousel__arrow\s*{[\s\S]*?background:\s*transparent[\s\S]*?color:\s*var\(--color-primary\)/s,
    )
    expect(heroStyles).toContain('@media (hover: hover) and (min-width: 48rem)')
    expect(heroStyles).toContain('.hero-carousel:hover .hero-carousel__arrow')
  })

  it('renders the CMS-backed About section on the homepage', () => {
    expect(homepageSource).toContain('<HomePage locale="zh-HK" />')
    expect(homepageComponentSource).toContain("import AboutSection from './AboutSection.astro'")
    expect(homepageComponentSource).toContain('<AboutSection')
    expect(homepageComponentSource).toContain('heading={homepage.homePage?.aboutHeading}')
    expect(homepageComponentSource).toContain('text={homepage.homePage?.aboutText}')
  })

  it('uses the approved About section layout and responsive typography', () => {
    expect(aboutStyles).toContain('border-top: 2px solid rgb(230 0 18 / 30%)')
    expect(aboutStyles).toContain('border-left: 2px solid rgb(230 0 18 / 30%)')
    expect(aboutStyles).toMatch(/grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)/)
    expect(aboutStyles).toContain('grid-column: 1 / -1')
    expect(aboutStyles).toContain('font-size: clamp(2rem, 4vw, 3rem)')
    expect(aboutStyles).toContain('font-size: 2rem')
  })
})
