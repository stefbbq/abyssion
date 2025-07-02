/**
 * Returns the appropriate filter CSS class for a given element type
 * @param elementType - The type of element to get filter for
 * @returns CSS class name for the filter effect
 */
export const getFilterClass = (elementType: 'main' | 'header' | 'nav'): string => {
  const filterMap = {
    main: 'filter-main',
    header: 'filter-header',
    nav: 'filter-nav',
  }

  return filterMap[elementType]
}

/**
 * Returns multiple filter classes for an array of element types
 * @param elementTypes - Array of element types to get filters for
 * @returns Space-separated CSS class names
 */
export const getFilterClasses = (elementTypes: Array<'main' | 'header' | 'nav'>): string => elementTypes.map(getFilterClass).join(' ')

/**
 * Returns the appropriate themed border radius class
 * @param size - The border radius size
 * @returns CSS class name for the border radius
 */
export const getBorderRadiusClass = (size: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'): string => `rounded-theme-${size}`
