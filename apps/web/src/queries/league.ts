import {defineQuery} from 'groq'

export const CURRENT_LEAGUE_QUERY = defineQuery(/* groq */ `
  *[_type == "league" && status == "ongoing"] | order(_createdAt desc)[0] {
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
      "slug": slug.current
    },
    "matches": *[_type == "match" && league._ref == ^._id && status == "completed"] | order(round asc, scheduledAt asc) {
      _id,
      round,
      scheduledAt,
      "results": results[] {
        "memberId": member->_id,
        score
      }
    }
  }
`)

export type LeagueParticipant = {
  memberId: string
  name: string | null
  slug: string
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

export type CurrentLeague = {
  _id: string
  title: string | null
  slug: string
  intro: string | null
  description: string | null
  status: 'ongoing'
  participants: LeagueParticipant[] | null
  matches: LeagueMatch[] | null
}
