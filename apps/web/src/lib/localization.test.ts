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
  it('defines English as the default locale', () => {
    expect(DEFAULT_LOCALE).toBe('en')
    expect(SUPPORTED_LOCALES).toEqual(['zh-HK', 'en', 'ja'])
    expect(PUBLIC_LOCALES).toEqual(['zh-HK', 'ja'])
  })

  it('maps public locales to their static paths', () => {
    expect(getLocalePath('zh-HK')).toBe('/zh-HK')
    expect(getLocalePath('en')).toBe('/')
    expect(getLocalePath('ja')).toBe('/ja')
  })

  it('strips public locale prefixes from pathnames', () => {
    expect(getPathWithoutLocale('/')).toBe('/')
    expect(getPathWithoutLocale('/zh-HK')).toBe('/')
    expect(getPathWithoutLocale('/ja')).toBe('/')
    expect(getPathWithoutLocale('/members/alice')).toBe('/members/alice')
    expect(getPathWithoutLocale('/zh-HK/members/alice')).toBe('/members/alice')
    expect(getPathWithoutLocale('/ja/competitions/foo/bar/matches')).toBe(
      '/competitions/foo/bar/matches',
    )
    expect(getPathWithoutLocale('/zh-HK/members/alice/')).toBe('/members/alice')
  })

  it('rebuilds the current page path for a target locale', () => {
    expect(getLocalizedHref('en', '/members/alice')).toBe('/members/alice')
    expect(getLocalizedHref('zh-HK', '/ja/competitions/foo/bar/matches')).toBe(
      '/zh-HK/competitions/foo/bar/matches',
    )
    expect(getLocalizedHref('en', '/ja')).toBe('/')
    expect(getLocalizedHref('zh-HK', '/ja')).toBe('/zh-HK')
    expect(getLocalizedHref('ja', '/')).toBe('/ja')
    expect(getLocalizedHref('en', '/members/alice/')).toBe('/members/alice')
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
    expect(getLocaleCopy('zh-HK').competitionMatchSequence(1)).toBe('半莊 01')
    expect(getLocaleCopy('en').competitionMatchSequence(1)).toBe('Hanchan 01')
    expect(getLocaleCopy('ja').competitionMatchSequence(1)).toBe('半荘 01')
    expect(getLocaleCopy('ja').competitionMatchDetails).toBe('半荘詳細')
  })

  it('keeps language names in their native language', () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(getLocaleCopy(locale).localeNames).toEqual({
        'zh-HK': '中文',
        en: 'English',
        ja: '日本語',
      })
    }
    expect(getLocaleCopy('en').competitionBackToSeason).toBe('Back to season overview')
    expect(getLocaleCopy('en').competitionSelectedSeason).toBe('Selected season')
    expect(getLocaleCopy('en').competitionStageSchedule).toBe('Stage schedule')
    expect(getLocaleCopy('en').competitionStageSummary(3)).toBe('3 stages · Newest first')
  })
})
