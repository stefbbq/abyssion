import { DESKTOP_SCROLL_OFFSET, MOBILE_SCROLL_OFFSET } from './constants.ts'

/**
 * Shared scroll offset for smooth scrolling behavior
 *
 * @returns scroll offset based on screen width
 */
export const getScrollOffset = () => globalThis.innerWidth < MOBILE_SCROLL_OFFSET ? MOBILE_SCROLL_OFFSET : DESKTOP_SCROLL_OFFSET
