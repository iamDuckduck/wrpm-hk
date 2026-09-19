// Run after `pnpm --dir apps/web build` to check real compiled Astro output.
import assert from 'node:assert/strict'
import {readFileSync, readdirSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {join} from 'node:path'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const files = readdirSync(dist, {recursive: true}).filter((file) => /\.(html|css)$/.test(file))
const contents = files.map((file) => [file, readFileSync(join(dist, file), 'utf8')])
const styles = contents.map(([, content]) => content).join('\n')
const classes = [
  'member-detail__intro', 'member-list-page__description',
  'hero-carousel__description', 'about-section__text',
  'competition-overview-page__intro', 'competition-overview__description-text',
]
let checked = 0
for (const className of classes) {
  const scope = styles.match(new RegExp(`\\.${className}\\[(data-astro-cid-[a-z0-9]+)\\]`))?.[1]
  assert.ok(scope, `Missing compiled CSS for ${className}`)
  let instances = 0
  for (const [file, html] of contents.filter(([file]) => file.endsWith('.html'))) {
    for (const [tag] of html.matchAll(/<div\b[^>]*>/g)) {
      if (!tag.match(/class="([^"]*)"/)?.[1].split(/\s+/).includes(className)) continue
      assert.ok(tag.includes(scope), `${file}: ${className} dropped its parent CSS scope`)
      instances++
      checked++
    }
  }
  assert.ok(instances > 0, `No rendered instances of ${className} to verify`)
}
console.log(`Verified parent CSS scopes on ${checked} rich-text sections across all built locales.`)
