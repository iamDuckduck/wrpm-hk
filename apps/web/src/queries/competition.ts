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

const localizedString = `
  coalesce(
    select(
      $locale == "en" => title.en,
      $locale == "ja" => title.ja,
      title.zhHk
    ),
    title.zhHk
  )
`

const seasonProjection = `
  _id,
  "seasonId": _id,
  "seasonTitle": ${localizedString},
  "seasonSlug": slug.current,
  "seasonStatus": status,
  "seasonStartsAt": startsAt,
  "seasonEndsAt": endsAt,
  status,
  "competitionId": competition._ref,
  "participants": participants[]-> {
    ${participantProjection}
  },
  "stages": *[
    _type == "matchStage" &&
    season._ref == ^._id
  ] | order(startsOn desc, _createdAt desc) {
    _id,
    "title": ${localizedString},
    startsOn,
    endsOn,
    "matches": *[
      _type == "match" &&
      stage._ref == ^._id
    ] | order(_createdAt asc) {
      _id,
      sequence,
      status,
      "matchType": matchType->{
        _id,
        "title": ${localizedString},
        "slug": slug.current
      },
      ...select(
        status == "completed" => {
          "detailsUrl": detailsUrl,
          "players": players[] {
            "memberId": member->_id,
            "memberName": coalesce(
              select(
                $locale == "en" => member->name.en,
                $locale == "ja" => member->name.ja,
                member->name.zhHk
              ),
              member->name.zhHk
            ),
            score
          }
        },
        {
          "players": players[] {
            "memberId": member->_id
          }
        }
      )
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

export type MatchStatus = 'scheduled' | 'completed' | 'cancelled'

export type CompetitionMatchType = {
  _id: string
  title: string | null
  slug: string
}

export type CompetitionCompletedMatchPlayer = {
  memberId: string
  memberName: string | null
  score: number
}

export type CompetitionPendingMatchPlayer = {
  memberId: string
}

type CompetitionMatchBase = {
  _id: string
  sequence: number
  matchType: CompetitionMatchType
}

export type CompetitionCompletedMatch = CompetitionMatchBase & {
  status: 'completed'
  detailsUrl: string
  players: CompetitionCompletedMatchPlayer[]
}

export type CompetitionPendingMatch = CompetitionMatchBase & {
  status: 'scheduled' | 'cancelled'
  players: CompetitionPendingMatchPlayer[]
}

export type CompetitionMatch = CompetitionCompletedMatch | CompetitionPendingMatch

export type CompetitionMatchPlayer =
  | CompetitionCompletedMatchPlayer
  | CompetitionPendingMatchPlayer

export type CompetitionMatchStage = {
  _id: string
  title: string | null
  startsOn: string
  endsOn: string | null
  matches: CompetitionMatch[] | null
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
  stages: CompetitionMatchStage[] | null
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
