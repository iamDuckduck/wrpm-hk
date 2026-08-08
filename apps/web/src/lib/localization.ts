export const SUPPORTED_LOCALES = ['zh-HK', 'en', 'ja'] as const
export const PUBLIC_LOCALES = ['en', 'ja'] as const
export const DEFAULT_LOCALE = 'zh-HK' as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]
export type SanityLocaleKey = 'zhHk' | 'en' | 'ja'

export interface LocaleCopy {
  pageTitle: string
  pageDescription: string
  skipLink: string
  home: string
  about: string
  languageSwitcher: string
  localeNames: Record<Locale, string>
  heroLabel: string
  heroControls: string
  previousSlide: string
  nextSlide: string
  selectSlide: (index: number) => string
  slideStatus: (index: number, total: number, title: string) => string
  slideStatusTemplate: string
  emptyEyebrow: string
  emptyTitle: string
  emptyDescription: string
  footerRights: string
}

const localeCopies: Record<Locale, LocaleCopy> = {
  'zh-HK': {
    pageTitle: '首頁',
    pageDescription: 'WRPM 香港分部官方網站',
    skipLink: '跳至主要內容',
    home: '首頁',
    about: '關於我們',
    languageSwitcher: '選擇語言',
    localeNames: {
      'zh-HK': '繁體中文',
      en: 'English',
      ja: '日本語',
    },
    heroLabel: '首頁主視覺',
    heroControls: '主視覺控制',
    previousSlide: '上一張主視覺',
    nextSlide: '下一張主視覺',
    selectSlide: (index) => `顯示第 ${index + 1} 張主視覺`,
    slideStatus: (index, total, title) =>
      `第 ${index + 1} 張，共 ${total} 張：${title}`,
    slideStatusTemplate: '第 __INDEX__ 張，共 __TOTAL__ 張：__TITLE__',
    emptyEyebrow: 'WRPM / HOME',
    emptyTitle: '首頁內容準備中',
    emptyDescription: '請稍後回來查看最新內容。',
    footerRights: '版權所有',
  },
  en: {
    pageTitle: 'Home',
    pageDescription: 'Official website of WRPM Hong Kong Branch',
    skipLink: 'Skip to main content',
    home: 'Home',
    about: 'About Us',
    languageSwitcher: 'Choose language',
    localeNames: {
      'zh-HK': 'Traditional Chinese',
      en: 'English',
      ja: 'Japanese',
    },
    heroLabel: 'Homepage hero',
    heroControls: 'Hero carousel controls',
    previousSlide: 'Previous hero slide',
    nextSlide: 'Next hero slide',
    selectSlide: (index) => `Show slide ${index + 1}`,
    slideStatus: (index, total, title) =>
      `Slide ${index + 1} of ${total}: ${title}`,
    slideStatusTemplate: 'Slide __INDEX__ of __TOTAL__: __TITLE__',
    emptyEyebrow: 'WRPM / HOME',
    emptyTitle: 'Homepage content is being prepared',
    emptyDescription: 'Please check back later for the latest content.',
    footerRights: 'All rights reserved',
  },
  ja: {
    pageTitle: 'ホーム',
    pageDescription: 'WRPM 香港支部公式ウェブサイト',
    skipLink: 'メインコンテンツへスキップ',
    home: 'ホーム',
    about: '私たちについて',
    languageSwitcher: '言語を選択',
    localeNames: {
      'zh-HK': '繁体字中国語',
      en: '英語',
      ja: '日本語',
    },
    heroLabel: 'ホームのメインビジュアル',
    heroControls: 'メインビジュアル操作',
    previousSlide: '前のメインビジュアル',
    nextSlide: '次のメインビジュアル',
    selectSlide: (index) => `スライド${index + 1}を表示`,
    slideStatus: (index, total, title) =>
      `スライド${index + 1}/${total}：${title}`,
    slideStatusTemplate: 'スライド__INDEX__/__TOTAL__：__TITLE__',
    emptyEyebrow: 'WRPM / HOME',
    emptyTitle: 'ホームページのコンテンツを準備中です',
    emptyDescription: '最新のコンテンツは後でもう一度ご確認ください。',
    footerRights: 'All rights reserved',
  },
}

export function getSanityLocaleKey(locale: Locale): SanityLocaleKey {
  return locale === 'zh-HK' ? 'zhHk' : locale
}

export function getLocalePath(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '/' : `/${locale}`
}

export function getLocaleCopy(locale: Locale): LocaleCopy {
  return localeCopies[locale]
}
