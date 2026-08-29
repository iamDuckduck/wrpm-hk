import {homePage} from './documents/home-page'
import {integrationTest} from './documents/integration-test'
import {competition} from './documents/competition'
import {competitionSeason} from './documents/competition-season'
import {match} from './documents/match'
import {matchStage} from './documents/match-stage'
import {matchType} from './documents/match-type'
import {member} from './documents/member'
import {memberCategory} from './documents/member-category'
import {membersPage} from './documents/members-page'
import {siteSettings} from './documents/site-settings'
import {heroSlide} from './objects/hero-slide'
import {localizedString} from './objects/localized-string'
import {localizedText} from './objects/localized-text'
import {matchPlayer} from './objects/match-player'
import {memberLink} from './objects/member-link'

export const schemaTypes = [
  localizedString,
  localizedText,
  heroSlide,
  memberLink,
  matchPlayer,
  siteSettings,
  homePage,
  membersPage,
  memberCategory,
  member,
  competition,
  competitionSeason,
  matchStage,
  matchType,
  match,
  integrationTest,
]
