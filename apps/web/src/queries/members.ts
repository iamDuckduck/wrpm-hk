import {defineQuery} from 'groq'

const MEMBER_FIELDS = /* groq */ `
  _id,
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
  },
  "intro": coalesce(
    select(
      $locale == "en" => intro.en,
      $locale == "ja" => intro.ja,
      intro.zhHk
    ),
    intro.zhHk
  )
`

export const MEMBERS_PAGE_QUERY = defineQuery(/* groq */ `
  *[_id == "membersPage"][0] {
    _id,
    "title": coalesce(
      select(
        $locale == "en" => title.en,
        $locale == "ja" => title.ja,
        title.zhHk
      ),
      title.zhHk
    ),
    "description": coalesce(
      select(
        $locale == "en" => description.en,
        $locale == "ja" => description.ja,
        description.zhHk
      ),
      description.zhHk
    )
  }
`)

export const MEMBER_LIST_QUERY = defineQuery(/* groq */ `
  *[_type == "member" && status == "active"] | order(name.zhHk asc) {
    ${MEMBER_FIELDS}
  }
`)

export const MEMBER_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "member" && status == "active" && defined(slug.current)] {
    "slug": slug.current
  }
`)

export const MEMBER_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "member" && status == "active" && slug.current == $slug][0] {
    ${MEMBER_FIELDS},
    mediaLinks[] {
      _key,
      label,
      url
    }
  }
`)

export type MembersPage = {
  _id: string
  title: string | null
  description: string | null
}

export type MemberListItem = {
  _id: string
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
  intro: string | null
}

export type MemberSlug = {
  slug: string
}

export type MemberDetail = MemberListItem & {
  mediaLinks: Array<{
    _key: string
    label: string
    url: string
  }> | null
}
