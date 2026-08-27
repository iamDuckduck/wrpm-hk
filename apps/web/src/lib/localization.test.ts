import {describe, expect, it} from 'vitest'
import {
  DEFAULT_LOCALE,
  PUBLIC_LOCALES,
  SUPPORTED_LOCALES,
  getLocaleCopy,
  getLocalePath,
  getLocalizedHref,
  getPathWithoutLocale,
  getSanityLocaleKey,
} from './localization'

describe('localization', () => {
  it('defines Traditional Chinese as the default locale', () => {
    expect(DEFAULT_LOCALE).toBe('zh-HK')
    expect(SUPPORTED_LOCALES).toEqual(['zh-HK', 'en', 'ja'])
    expect(PUBLIC_LOCALES).toEqual(['en', 'ja'])
  })

  it('maps public locales to their static paths', () => {
    expect(getLocalePath('zh-HK')).toBe('/')
    expect(getLocalePath('en')).toBe('/en')
    expect(getLocalePath('ja')).toBe('/ja')
  })

  it('strips public locale prefixes from pathnames', () => {
    expect(getPathWithoutLocale('/')).toBe('/')
    expect(getPathWithoutLocale('/en')).toBe('/')
    expect(getPathWithoutLocale('/ja')).toBe('/')
    expect(getPathWithoutLocale('/members/alice')).toBe('/members/alice')
    expect(getPathWithoutLocale('/en/members/alice')).toBe('/members/alice')
    expect(getPathWithoutLocale('/ja/competitions/foo/bar/matches')).toBe(
      '/competitions/foo/bar/matches',
    )
    expect(getPathWithoutLocale('/en/members/alice/')).toBe('/members/alice')
  })

  it('rebuilds the current page path for a target locale', () => {
    expect(getLocalizedHref('en', '/members/alice')).toBe('/en/members/alice')
    expect(getLocalizedHref('zh-HK', '/en/competitions/foo/bar/matches')).toBe(
      '/competitions/foo/bar/matches',
    )
    expect(getLocalizedHref('en', '/ja')).toBe('/en')
    expect(getLocalizedHref('zh-HK', '/en')).toBe('/')
    expect(getLocalizedHref('ja', '/')).toBe('/ja')
    expect(getLocalizedHref('en', '/members/alice/')).toBe('/en/members/alice')
  })

  it('maps URL locales to Sanity localized field keys', () => {
    expect(getSanityLocaleKey('zh-HK')).toBe('zhHk')
    expect(getSanityLocaleKey('en')).toBe('en')
    expect(getSanityLocaleKey('ja')).toBe('ja')
  })

  it('provides translated UI copy for each locale', () => {
    expect(getLocaleCopy('zh-HK').home).toBe('首頁')
    expect(getLocaleCopy('en').home).toBe('Home')
    expect(getLocaleCopy('ja').home).toBe('ホーム')
    expect(getLocaleCopy('en').selectSlide(1)).toBe('Show slide 2')
    expect(getLocaleCopy('zh-HK').competitionMatchStatus('scheduled')).toBe('已排期')
    expect(getLocaleCopy('en').competitionMatchSequence(1)).toBe('Match 01')
    expect(getLocaleCopy('ja').competitionMatchDetails).toBe('試合詳細')
    expect(getLocaleCopy('en').competitionBackToSeason).toBe('Back to season overview')
    expect(getLocaleCopy('en').competitionSelectedSeason).toBe('Selected season')
    expect(getLocaleCopy('en').competitionStageSchedule).toBe('Stage schedule')
    expect(getLocaleCopy('en').competitionStageSummary(3)).toBe('3 stages · Newest first')
  })
})
