/**
 * Removes all keys from an object whose values are null or undefined.
 * @param object - the object to filter
 * @returns a new object with only non-nullish values
 */
export const filterNullishValues = <T extends Record<string, unknown>>(object: T): Partial<T> =>
  Object.fromEntries(Object.entries(object).filter(([_, value]) => value != null)) as Partial<T>
