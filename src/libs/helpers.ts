
export function excludeSelect<
  S extends Readonly<string[]>,
  E extends S[number],
>(selectFields: S, excludeFields: E[]) {
  const subsetSet = new Set(excludeFields)
  return selectFields.filter(item => !subsetSet.has(item as any)) as Exclude<
    S[number],
    E
  >[]
}
