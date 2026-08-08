import {defineQuery} from 'groq'

export const HOME_PAGE_QUERY = defineQuery(/* groq */ `
  {
    "siteSettings": *[_id == "siteSettings"][0] {
      _id,
      "organizationName": coalesce(
        select(
          $locale == "en" => organizationName.en,
          $locale == "ja" => organizationName.ja,
          organizationName.zhHk
        ),
        organizationName.zhHk
      ),
      logo {
        asset,
        alt,
        crop,
        hotspot
      }
    },
    "homePage": *[_id == "homePage"][0] {
      _id,
      heroSlides[] {
        _key,
        image {
          asset,
          alt,
          crop,
          hotspot
        },
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
      },
      "aboutHeading": coalesce(
        select(
          $locale == "en" => aboutHeading.en,
          $locale == "ja" => aboutHeading.ja,
          aboutHeading.zhHk
        ),
        aboutHeading.zhHk
      ),
      "aboutText": coalesce(
        select(
          $locale == "en" => aboutText.en,
          $locale == "ja" => aboutText.ja,
          aboutText.zhHk
        ),
        aboutText.zhHk
      )
    }
  }
`)

export type SanityImage = {
  asset: {
    _type: 'reference'
    _ref: string
  } | null
  alt: string | null
  crop:
    | {
        _type: 'sanity.imageCrop'
        top: number
        bottom: number
        left: number
        right: number
      }
    | null
  hotspot:
    | {
        _type: 'sanity.imageHotspot'
        x: number
        y: number
        height: number
        width: number
      }
    | null
}

export type SiteSettings = {
  _id: string
  organizationName: string | null
  logo: SanityImage | null
}

export type HeroSlide = {
  _key: string
  image: SanityImage | null
  title: string | null
  description: string | null
}

export type HomePage = {
  _id: string
  heroSlides: HeroSlide[] | null
  aboutHeading: string | null
  aboutText: string | null
}

export type HomePageQueryResult = {
  siteSettings: SiteSettings | null
  homePage: HomePage | null
}
