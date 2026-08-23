import {defineQuery} from 'groq'

const localizedLeagueFields = `
    "title": coalesce(
      select(
        $locale == "en" => league->title.en,
        $locale == "ja" => league->title.ja,
        league->title.zhHk
      ),
      league->title.zhHk
    ),
    "slug": league->slug.current,
    "intro": coalesce(
      select(
        $locale == "en" => league->intro.en,
        $locale == "ja" => league->intro.ja,
        league->intro.zhHk
      ),
      league->intro.zhHk
    ),
    "description": coalesce(
      select(
        $locale == "en" => league->description.en,
        $locale == "ja" => league->description.ja,
        league->description.zhHk
      ),
      league->description.zhHk
    ),
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
    ${localizedLeagueFields}
    status,
    "participants": participants[]-> {
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
    },
    "matches": *[_type == "match" && season._ref == ^._id && status == "completed"] | order(round asc, scheduledAt asc) {
      _id,
      round,
      scheduledAt,
      "results": results[] {
        "memberId": member->_id,
        score
      }
    },
    "seasons": *[_type == "leagueSeason" && league._ref == ^.league._ref] | order(startsAt desc, _createdAt desc) {
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
    }
`

export const CURRENT_LEAGUE_QUERY = defineQuery(/* groq */ `
  *[_type == "leagueSeason"]
    | order(select(status == "ongoing" => 1, 0) desc, startsAt desc, _createdAt desc)[0] {
    ${seasonProjection}
  }
`)

export const LEAGUE_SEASON_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "leagueSeason" && slug.current == $seasonSlug][0] {
    ${seasonProjection}
  }
`)

export const LEAGUE_SEASON_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "leagueSeason"] | order(startsAt desc, _createdAt desc) {
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
    "leagueSlug": league->slug.current,
    status,
    startsAt,
    endsAt
  }
`)

export type LeagueParticipant = {
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

export type LeagueMatch = {
  _id: string
  round: number
  scheduledAt: string
  results: Array<{
    memberId: string
    score: number
  }> | null
}

export type LeagueSeasonSummary = {
  _id: string
  title: string | null
  slug: string
  status: 'upcoming' | 'ongoing' | 'completed'
  startsAt: string
  endsAt: string | null
}

export type CurrentLeague = {
  _id: string
  title: string | null
  slug: string
  intro: string | null
  description: string | null
  status: 'upcoming' | 'ongoing' | 'completed'
  seasonId: string
  seasonTitle: string | null
  seasonSlug: string
  seasonStatus: 'upcoming' | 'ongoing' | 'completed'
  seasonStartsAt: string
  seasonEndsAt: string | null
  participants: LeagueParticipant[] | null
  matches: LeagueMatch[] | null
  seasons: LeagueSeasonSummary[] | null
}
