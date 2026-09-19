import {at, defineMigration, setIfMissing} from 'sanity/migrate'
import {buildRichTextPatches} from './content'

export default defineMigration({
  title: 'Convert descriptive text to localized rich text',
  documentTypes: ['member', 'membersPage', 'competition', 'homePage'],
  migrate: {
    document(document) {
      return buildRichTextPatches(document).map(({path, value}) => at(path, setIfMissing(value)))
    },
  },
})
