export type SortableMember = {
  _id: string
  name: string | null
  englishName: string | null
}

const collator = new Intl.Collator('en', {sensitivity: 'base', numeric: true})

function normalized(value: string | null | undefined) {
  return value?.trim() ?? ''
}

export function compareMembersByEnglishName(left: SortableMember, right: SortableMember) {
  const leftEnglish = normalized(left.englishName)
  const rightEnglish = normalized(right.englishName)

  if (leftEnglish && !rightEnglish) return -1
  if (!leftEnglish && rightEnglish) return 1

  return (
    collator.compare(leftEnglish, rightEnglish) ||
    collator.compare(normalized(left.name), normalized(right.name)) ||
    left._id.localeCompare(right._id)
  )
}
