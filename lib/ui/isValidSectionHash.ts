import { getSectionIDs } from './getSectionIDs.ts'

/**
 * check if a hash is a valid section
 */
export const isValidSectionHash = (hash: string): boolean => {
  const sectionId = hash.replace('#', '')
  return getSectionIDs().includes(sectionId)
}
