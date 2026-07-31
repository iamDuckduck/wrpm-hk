import type {StructureBuilder, StructureResolver} from 'sanity/structure'

export const singletonTypes = new Set(['siteSettings', 'homePage'])

function singletonListItem(S: StructureBuilder, schemaType: string, title: string) {
  return S.listItem()
    .id(schemaType)
    .title(title)
    .child(S.document().schemaType(schemaType).documentId(schemaType).title(title))
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Website Content')
    .items([
      singletonListItem(S, 'siteSettings', 'Site Settings'),
      singletonListItem(S, 'homePage', 'Home Page'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !singletonTypes.has(listItem.getId() as string),
      ),
    ])
