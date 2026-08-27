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
  navigation: string
  competitions: string
  competition: string
  competitionOverview: string
  competitionRanking: string
  competitionScore: string
  competitionMatchesPlayed: string
  competitionMatches: string
  competitionResults: string
  competitionBackToSeason: string
  competitionSelectedSeason: string
  competitionStageSchedule: string
  competitionStageSummary: (count: number) => string
  competitionRound: (round: number) => string
  competitionMatchDetails: string
  competitionMatchStatus: (status: 'scheduled' | 'completed' | 'cancelled') => string
  competitionMatchSequence: (sequence: number) => string
  competitionMatchTypeCount: (count: number) => string
  competitionResultsEmpty: string
  competitionSeasons: string
  competitionSeasonSelector: string
  competitionSeasonCurrent: string
  competitionStatus: (status: 'upcoming' | 'ongoing' | 'completed') => string
  competitionNotFound: string
  competitionNoRankings: string
  league: string
  leagueOverview: string
  leagueRanking: string
  leagueScore: string
  leagueMatchesPlayed: string
  leagueResults: string
  leagueRound: (round: number) => string
  leagueResultsEmpty: string
  leagueSeasons: string
  leagueSeasonSelector: string
  leagueSeasonCurrent: string
  leagueNotFound: string
  leagueNoRankings: string
  members: string
  memberListTitle: string
  memberListDescription: string
  memberListEmpty: string
  memberUnknown: string
  viewMember: (name: string) => string
  memberLinks: string
  memberNotFound: string
  backToMembers: string
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
    navigation: '網站導覽',
    competitions: '比賽',
    competition: '比賽',
    competitionOverview: '比賽概覽',
    competitionRanking: '排名',
    competitionScore: '總分',
    competitionMatchesPlayed: '完成場數',
    competitionMatches: '查看賽事結果',
    competitionResults: '賽事結果',
    competitionBackToSeason: '返回賽季總覽',
    competitionSelectedSeason: '已選賽季',
    competitionStageSchedule: '階段賽程',
    competitionStageSummary: (count) => `${count} 個階段 · 日期由新至舊`,
    competitionRound: (round) => `第 ${round} 輪`,
    competitionMatchDetails: '賽事詳情',
    competitionMatchStatus: (status) =>
      ({scheduled: '已排期', completed: '已完成', cancelled: '已取消'})[status],
    competitionMatchSequence: (sequence) => `賽事 ${String(sequence).padStart(2, '0')}`,
    competitionMatchTypeCount: (count) => `${count} 場賽事`,
    competitionResultsEmpty: '完成賽事後，結果將會顯示在這裡。',
    competitionSeasons: '比賽賽季',
    competitionSeasonSelector: '選擇比賽賽季',
    competitionSeasonCurrent: '目前賽季',
    competitionStatus: (status) =>
      ({upcoming: '即將開始', ongoing: '進行中', completed: '已完成'})[status],
    competitionNotFound: '目前沒有可用的比賽。',
    competitionNoRankings: '完成賽事後，排名將會顯示在這裡。',
    league: '聯賽',
    leagueOverview: '聯賽概覽',
    leagueRanking: '排名',
    leagueScore: '總分',
    leagueMatchesPlayed: '完成場數',
    leagueResults: '賽事結果',
    leagueRound: (round) => `第 ${round} 輪`,
    leagueResultsEmpty: '完成賽事後，結果將會顯示在這裡。',
    leagueSeasons: '聯賽賽季',
    leagueSeasonSelector: '選擇聯賽賽季',
    leagueSeasonCurrent: '目前賽季',
    leagueNotFound: '目前沒有進行中的聯賽。',
    leagueNoRankings: '完成賽事後，排名將會顯示在這裡。',
    members: '成員',
    memberListTitle: 'WRPM 成員',
    memberListDescription: '認識 WRPM 香港分部的成員。',
    memberListEmpty: '成員資料準備中。',
    memberUnknown: 'WRPM 成員',
    viewMember: (name) => `查看 ${name} 的成員資料`,
    memberLinks: '相關連結',
    memberNotFound: '找不到這位成員。',
    backToMembers: '返回成員列表',
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
    navigation: 'Site navigation',
    competitions: 'Competitions',
    competition: 'Competition',
    competitionOverview: 'Competition Overview',
    competitionRanking: 'Ranking',
    competitionScore: 'Total score',
    competitionMatchesPlayed: 'Matches played',
    competitionMatches: 'View match results',
    competitionResults: 'Match results',
    competitionBackToSeason: 'Back to season overview',
    competitionSelectedSeason: 'Selected season',
    competitionStageSchedule: 'Stage schedule',
    competitionStageSummary: (count) => `${count} stages · Newest first`,
    competitionRound: (round) => `Round ${round}`,
    competitionMatchDetails: 'Match details',
    competitionMatchStatus: (status) =>
      ({scheduled: 'Scheduled', completed: 'Completed', cancelled: 'Cancelled'})[status],
    competitionMatchSequence: (sequence) => `Match ${String(sequence).padStart(2, '0')}`,
    competitionMatchTypeCount: (count) => (count === 1 ? '1 match' : `${count} matches`),
    competitionResultsEmpty: 'Completed match results will appear here.',
    competitionSeasons: 'Competition seasons',
    competitionSeasonSelector: 'Choose a competition season',
    competitionSeasonCurrent: 'Current season',
    competitionStatus: (status) =>
      ({upcoming: 'Upcoming', ongoing: 'Ongoing', completed: 'Completed'})[status],
    competitionNotFound: 'There is no competition available at the moment.',
    competitionNoRankings: 'Rankings will appear here after completed matches.',
    league: 'League',
    leagueOverview: 'League Overview',
    leagueRanking: 'Ranking',
    leagueScore: 'Total score',
    leagueMatchesPlayed: 'Matches played',
    leagueResults: 'Match results',
    leagueRound: (round) => `Round ${round}`,
    leagueResultsEmpty: 'Completed match results will appear here.',
    leagueSeasons: 'League seasons',
    leagueSeasonSelector: 'Choose a league season',
    leagueSeasonCurrent: 'Current season',
    leagueNotFound: 'There is no ongoing league at the moment.',
    leagueNoRankings: 'Rankings will appear here after completed matches.',
    members: 'Members',
    memberListTitle: 'WRPM Members',
    memberListDescription: 'Meet the members of WRPM Hong Kong Branch.',
    memberListEmpty: 'Member profiles are being prepared.',
    memberUnknown: 'WRPM Member',
    viewMember: (name) => `View ${name}'s member profile`,
    memberLinks: 'Links',
    memberNotFound: 'This member could not be found.',
    backToMembers: 'Back to members',
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
    navigation: 'サイトナビゲーション',
    competitions: '大会',
    competition: '大会',
    competitionOverview: '大会概要',
    competitionRanking: 'ランキング',
    competitionScore: '合計スコア',
    competitionMatchesPlayed: '対戦数',
    competitionMatches: '試合結果を見る',
    competitionResults: '試合結果',
    competitionBackToSeason: 'シーズン概要に戻る',
    competitionSelectedSeason: '選択中のシーズン',
    competitionStageSchedule: 'ステージ日程',
    competitionStageSummary: (count) => `${count}ステージ・新しい順`,
    competitionRound: (round) => `第${round}ラウンド`,
    competitionMatchDetails: '試合詳細',
    competitionMatchStatus: (status) =>
      ({scheduled: '予定', completed: '完了', cancelled: '中止'})[status],
    competitionMatchSequence: (sequence) => `試合 ${String(sequence).padStart(2, '0')}`,
    competitionMatchTypeCount: (count) => `${count} 試合`,
    competitionResultsEmpty: '試合が完了すると結果が表示されます。',
    competitionSeasons: '大会シーズン',
    competitionSeasonSelector: '大会シーズンを選択',
    competitionSeasonCurrent: '現在のシーズン',
    competitionStatus: (status) =>
      ({upcoming: '開催予定', ongoing: '開催中', completed: '完了'})[status],
    competitionNotFound: '現在利用できる大会はありません。',
    competitionNoRankings: '試合が完了するとランキングが表示されます。',
    league: 'リーグ',
    leagueOverview: 'リーグ概要',
    leagueRanking: 'ランキング',
    leagueScore: '合計スコア',
    leagueMatchesPlayed: '対戦数',
    leagueResults: '試合結果',
    leagueRound: (round) => `第${round}ラウンド`,
    leagueResultsEmpty: '試合が完了すると結果が表示されます。',
    leagueSeasons: 'リーグシーズン',
    leagueSeasonSelector: 'リーグシーズンを選択',
    leagueSeasonCurrent: '現在のシーズン',
    leagueNotFound: '現在開催中のリーグはありません。',
    leagueNoRankings: '試合が完了するとランキングが表示されます。',
    members: 'メンバー',
    memberListTitle: 'WRPM メンバー',
    memberListDescription: 'WRPM 香港支部のメンバーをご紹介します。',
    memberListEmpty: 'メンバー情報を準備中です。',
    memberUnknown: 'WRPM メンバー',
    viewMember: (name) => `${name}のプロフィールを見る`,
    memberLinks: '関連リンク',
    memberNotFound: 'このメンバーは見つかりませんでした。',
    backToMembers: 'メンバー一覧へ戻る',
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

export function getLocalizedPath(locale: Locale, pathname: string): string {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  const localePath = getLocalePath(locale)

  return localePath === '/' ? normalizedPath : `${localePath}${normalizedPath}`
}

export function getLocaleCopy(locale: Locale): LocaleCopy {
  return localeCopies[locale]
}
