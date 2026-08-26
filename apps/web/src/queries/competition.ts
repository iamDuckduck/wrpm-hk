import {defineQuery} from 'groq'

const localizedCompetitionFields = `
  "title": coalesce(
    select(
      $locale == "en" => title.en,
      $locale == "ja" => title.ja,
      title.zhHk
    ),
    title.zhHk
  ),
  "slug": slug.current,
  "intro": coalesce(
    select(
      $locale == "en" => intro.en,
      $locale == "ja" => intro.ja,
      intro.zhHk
    ),
    intro.zhHk
  ),
  "description": coalesce(
    select(
      $locale == "en" => description.en,
      $locale == "ja" => description.ja,
      description.zhHk
    ),
    description.zhHk
  ),
`

const participantProjection = `
  "memberId": _id,
  "name": coalesce(
    select(
      $locale == "en" => name.en,
      $locale == "ja" => name.ja,
      name.zhHk
    ),
    name.zhHk
  ),
  "slug": slug.current,
  profileImage {
    asset,
    alt,
    crop,
    hotspot
  }
`

const seasonSummaryProjection = `
  _id,
  "title": coalesce(
    select(
      $locale == "en" => title.en,
      $locale == "ja" => title.ja,
      title.zhHk
    ),
    title.zhHk
  ),
  "slug": slug.current,
  status,
  startsAt,
  endsAt
`

const seasonProjection = `
  _id,
  "seasonId": _id,
  "seasonTitle": coalesce(
    select(
      $locale == "en" => title.en,
      $locale == "ja" => title.ja,
      title.zhHk
    ),
    title.zhHk
  ),
  "seasonSlug": slug.current,
  "seasonStatus": status,
  "seasonStartsAt": startsAt,
  "seasonEndsAt": endsAt,
  status,
  "competitionId": competition._ref,
  "participants": participants[]-> {
    ${participantProjection}
  },
  "matches": *[
    _type == "match" &&
    season._ref == ^._id &&
    status == "completed"
  ] | order(round asc, scheduledAt asc, _createdAt asc) {
    _id,
    round,
    scheduledAt,
    "results": results[] {
      "memberId": member->_id,
      score
    }
  },
  "seasons": *[
    _type == "competitionSeason" &&
    competition._ref == ^.competition._ref &&
    defined(slug.current)
  ] | order(startsAt desc, _createdAt desc) {
    ${seasonSummaryProjection}
  }
`

const competitionProjection = `
  _id,
  "competitionId": _id,
  ${localizedCompetitionFields}
  "season": *[
    _type == "competitionSeason" &&
    competition._ref == ^._id
  ] | order(
    select(status == "ongoing" => 1, 0) desc,
    startsAt desc,
    _createdAt desc
  )[0] {
    ${seasonProjection}
  },
  "seasons": *[
    _type == "competitionSeason" &&
    competition._ref == ^._id &&
    defined(slug.current)
  ] | order(startsAt desc, _createdAt desc) {
    ${seasonSummaryProjection}
  }
`

export const COMPETITION_NAVIGATION_QUERY = defineQuery(/* groq */ `
  *[_type == "competition" && defined(slug.current)]
    | order(title.zhHk asc, _createdAt asc) {
    _id,
    "title": coalesce(
      select(
        $locale == "en" => title.en,
        $locale == "ja" => title.ja,
        title.zhHk
      ),
      title.zhHk
    ),
    "slug": slug.current
  }
`)

export const COMPETITION_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "competition" && defined(slug.current)]
    | order(slug.current asc, _createdAt asc) {
    _id,
    "slug": slug.current
  }
`)

export const COMPETITION_SEASON_SLUGS_QUERY = defineQuery(/* groq */ `
  *[
    _type == "competitionSeason" &&
    defined(slug.current) &&
    defined(competition._ref) &&
    defined(competition->slug.current)
  ] | order(competition->slug.current asc, startsAt desc, _createdAt desc) {
    _id,
    "competitionSlug": competition->slug.current,
    "seasonSlug": slug.current,
    "title": coalesce(
      select(
        $locale == "en" => title.en,
        $locale == "ja" => title.ja,
        title.zhHk
      ),
      title.zhHk
    ),
    status,
    startsAt,
    endsAt
  }
`)

export const CURRENT_COMPETITION_QUERY = defineQuery(/* groq */ `
  *[
    _type == "competition" &&
    slug.current == $competitionSlug &&
    defined(slug.current)
  ][0] {
    ${competitionProjection}
  }
`)

export const COMPETITION_SEASON_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[
    _type == "competition" &&
    slug.current == $competitionSlug &&
    defined(slug.current)
  ][0] {
    _id,
    "competitionId": _id,
    ${localizedCompetitionFields}
    "season": *[
      _type == "competitionSeason" &&
      competition._ref == ^._id &&
      slug.current == $seasonSlug
    ][0] {
      ${seasonProjection}
    },
    "seasons": *[
      _type == "competitionSeason" &&
      competition._ref == ^._id &&
      defined(slug.current)
    ] | order(startsAt desc, _createdAt desc) {
      ${seasonSummaryProjection}
    }
  }
`)

export type CompetitionNavigationItem = {
  _id: string
  title: string | null
  slug: string
}

export type CompetitionSlug = {
  _id: string
  slug: string
}

export type CompetitionSeasonSlug = {
  _id: string
  competitionSlug: string
  seasonSlug: string
  title: string | null
  status: 'upcoming' | 'ongoing' | 'completed'
  startsAt: string
  endsAt: string | null
}

export type CompetitionParticipant = {
  memberId: string
  name: string | null
  slug: string
  profileImage: {
    asset: {_ref: string; _type: 'reference'} | null
    alt: string | null
    crop: {
      _type: 'sanity.imageCrop'
      top: number
      bottom: number
      left: number
      right: number
    } | null
    hotspot: {
      _type: 'sanity.imageHotspot'
      x: number
      y: number
      height: number
      width: number
    } | null
  } | null
}

export type CompetitionMatch = {
  _id: string
  round: number
  scheduledAt: string
  results: Array<{
    memberId: string
    score: number
  }> | null
}

export type CompetitionSeasonSummary = {
  _id: string
  title: string | null
  slug: string
  status: 'upcoming' | 'ongoing' | 'completed'
  startsAt: string
  endsAt: string | null
}

export type CompetitionSeason = {
  _id: string
  seasonId: string
  seasonTitle: string | null
  seasonSlug: string
  seasonStatus: 'upcoming' | 'ongoing' | 'completed'
  seasonStartsAt: string
  seasonEndsAt: string | null
  status: 'upcoming' | 'ongoing' | 'completed'
  competitionId: string
  participants: CompetitionParticipant[] | null
  matches: CompetitionMatch[] | null
  seasons: CompetitionSeasonSummary[] | null
}

export type CompetitionPageData = {
  _id: string
  competitionId: string
  title: string | null
  slug: string
  intro: string | null
  description: string | null
  season: CompetitionSeason | null
  seasons: CompetitionSeasonSummary[] | null
}
