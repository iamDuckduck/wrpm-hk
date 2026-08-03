import {defineQuery} from 'groq'

export const HOME_PAGE_QUERY = defineQuery(/* groq */ `
  {
    "siteSettings": *[_id == "siteSettings"][0] {
      _id,
      "organizationName": organizationName.zhHk,
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
        "title": title.zhHk,
        "description": description.zhHk
      },
      "aboutHeading": aboutHeading.zhHk,
      "aboutText": aboutText.zhHk
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
