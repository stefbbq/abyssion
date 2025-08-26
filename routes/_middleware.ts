import { MiddlewareHandlerContext } from '$fresh/server.ts'
import { getCookies } from '$std/http/cookie.ts'
import pagesConfig from '@data/pages.json' with { type: 'json' }
import type { PagesConfig } from '@data/types.ts'
import { DEBUG_COOKIE_NAME, DEBUG_QUERY_PARAM } from '@lib/debug/constants.ts'

export async function handler(req: Request, ctx: MiddlewareHandlerContext) {
  const url = new URL(req.url)
  const pagePath = url.pathname
  const config = (pagesConfig as PagesConfig)[pagePath] || {}

  // set long cache headers for static images and videos, and remove ETag to prevent revalidation
  if (
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/static/images/') ||
    url.pathname.startsWith('/media/images/') ||
    url.pathname.startsWith('/videos/') ||
    url.pathname.startsWith('/static/videos/') ||
    url.pathname.startsWith('/media/videos/')
  ) {
    const resp = await ctx.next()
    resp.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    resp.headers.delete('ETag')
    return resp
  }

  if (config.debugOnly) {
    const cookies = getCookies(req.headers)
    const hasDebugQuery = url.searchParams.has(DEBUG_QUERY_PARAM)
    const hasDebugCookie = cookies[DEBUG_COOKIE_NAME] === 'true'
    const isUserInDebugMode = hasDebugQuery || hasDebugCookie

    if (!isUserInDebugMode) {
      // Redirect to homepage if not in debug mode
      return Response.redirect(new URL('/', url), 307)
    }
  }

  const resp = await ctx.next()
  return resp
}
