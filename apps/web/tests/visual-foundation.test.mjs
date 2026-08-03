import {readFileSync} from 'node:fs'
import {describe, expect, it} from 'vitest'

const styles = readFileSync(
  new URL('../src/styles/global.css', import.meta.url),
  'utf8',
)
const heroStyles = readFileSync(
  new URL('../src/components/HeroCarousel.astro', import.meta.url),
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

  it('uses a compact mobile hero ratio instead of a tall crop box', () => {
    expect(heroStyles).toMatch(
      /@media\s*\(max-width:\s*47\.999rem\)[\s\S]*?\.hero-carousel__slide\s*{[\s\S]*?aspect-ratio:\s*16\s*\/\s*9/s,
    )
    expect(heroStyles).toMatch(
      /@media\s*\(max-width:\s*47\.999rem\)[\s\S]*?\.hero-carousel__viewport[\s\S]*?min-height:\s*0/s,
    )
  })
})
