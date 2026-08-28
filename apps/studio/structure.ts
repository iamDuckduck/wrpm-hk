import type {StructureBuilder, StructureResolver} from 'sanity/structure'

export const singletonTypes = new Set(['siteSettings', 'homePage'])
export const nestedDeskTypes = new Set(['competition', 'competitionSeason', 'matchStage', 'match'])

function singletonListItem(S: StructureBuilder, schemaType: string, title: string) {
  return S.listItem()
    .id(schemaType)
    .title(title)
    .child(S.document().schemaType(schemaType).documentId(schemaType).title(title))
}

function documentEditor(S: StructureBuilder, schemaType: string, documentId: string, title: string) {
  return S.document().schemaType(schemaType).documentId(documentId).title(title)
}

function matchList(S: StructureBuilder, stageId: string) {
  return S.documentTypeList('match')
    .title('Matches')
    .filter('_type == "match" && stage._ref == $stageId')
    .params({stageId})
    .defaultOrdering([{field: 'sequence', direction: 'asc'}])
    .initialValueTemplates([S.initialValueTemplateItem('match-from-stage', {stageId})])
}

function stageChild(S: StructureBuilder, stageId: string) {
  return S.list()
    .title('Stage')
    .items([
      S.listItem()
        .id('details')
        .title('Details')
        .schemaType('matchStage')
        .child(documentEditor(S, 'matchStage', stageId, 'Details')),
      S.listItem().id('matches').title('Matches').schemaType('match').child(matchList(S, stageId)),
    ])
}

function stageList(S: StructureBuilder, seasonId: string) {
  return S.documentTypeList('matchStage')
    .title('Stages')
    .filter('_type == "matchStage" && season._ref == $seasonId')
    .params({seasonId})
    .initialValueTemplates([S.initialValueTemplateItem('stage-from-season', {seasonId})])
    .child((stageId) => stageChild(S, stageId))
}

function seasonChild(S: StructureBuilder, seasonId: string) {
  return S.list()
    .title('Season')
    .items([
      S.listItem()
        .id('details')
        .title('Details')
        .schemaType('competitionSeason')
        .child(documentEditor(S, 'competitionSeason', seasonId, 'Details')),
      S.listItem()
        .id('stages')
        .title('Stages')
        .schemaType('matchStage')
        .child(stageList(S, seasonId)),
    ])
}

function seasonList(S: StructureBuilder, competitionId: string) {
  return S.documentTypeList('competitionSeason')
    .title('Seasons')
    .filter('_type == "competitionSeason" && competition._ref == $competitionId')
    .params({competitionId})
    .initialValueTemplates([
      S.initialValueTemplateItem('season-from-competition', {competitionId}),
    ])
    .child((seasonId) => seasonChild(S, seasonId))
}

function competitionChild(S: StructureBuilder, competitionId: string) {
  return S.list()
    .title('Competition')
    .items([
      S.listItem()
        .id('details')
        .title('Details')
        .schemaType('competition')
        .child(documentEditor(S, 'competition', competitionId, 'Details')),
      S.listItem()
        .id('seasons')
        .title('Seasons')
        .schemaType('competitionSeason')
        .child(seasonList(S, competitionId)),
    ])
}

function competitionsListItem(S: StructureBuilder) {
  return S.listItem()
    .id('competitions')
    .title('Competitions')
    .schemaType('competition')
    .child(
      S.documentTypeList('competition')
        .title('Competitions')
        .child((competitionId) => competitionChild(S, competitionId)),
    )
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Website Content')
    .items([
      singletonListItem(S, 'siteSettings', 'Site Settings'),
      singletonListItem(S, 'homePage', 'Home Page'),
      S.divider(),
      competitionsListItem(S),
      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId() as string
        return !singletonTypes.has(id) && !nestedDeskTypes.has(id)
      }),
    ])
