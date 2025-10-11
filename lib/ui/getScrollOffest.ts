import { DESKTOP_SCROLL_OFFSET, MOBILE_BREAKPOINT_PX, MOBILE_SCROLL_OFFSET } from './constants.ts'

/**
 * shared scroll offset for smooth scrolling behavior
 */
export const getScrollOffset = () => globalThis.innerWidth < MOBILE_BREAKPOINT_PX ? MOBILE_SCROLL_OFFSET : DESKTOP_SCROLL_OFFSET
