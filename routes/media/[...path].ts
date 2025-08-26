import { extname, join } from 'https://deno.land/std@0.224.0/path/mod.ts'

// search order for media assets; prefer /media, fallback to /static for legacy assets
const MEDIA_DIRS = ['./media', './static'] as const

export const handler = async (req: Request, ctx: HandlerContext) => {
  const { path } = ctx.params
  const relPath = Array.isArray(path) ? path.join('/') : path
  const filePath = await resolveExistingFile(relPath)
  const url = new URL(req.url)

  try {
    const stat = await Deno.stat(filePath)
    if (!stat.isFile) return new Response('Not found', { status: 404 })

    // HEAD request: headers only
    if (req.method === 'HEAD') {
      const headers = new Headers()
      headers.set('Content-Length', stat.size.toString())
      headers.set('Content-Type', getMimeType(filePath))
      setCacheHeaders(headers, url)
      return new Response(null, { status: 200, headers })
    }

    const range = req.headers.get('range')
    const fileSize = stat.size

    // stream videos and other large assets when Range present
    if (range) {
      const match = range.match(/bytes=(\d+)-(\d*)/)
      if (!match) return new Response('Invalid range', { status: 416 })

      let start = parseInt(match[1], 10)
      let end = match[2] ? parseInt(match[2], 10) : fileSize - 1
      if (Number.isNaN(start)) start = 0
      if (Number.isNaN(end) || end >= fileSize) end = fileSize - 1
      if (start > end || start >= fileSize) return new Response('Range Not Satisfiable', { status: 416 })

      const chunkSize = end - start + 1
      const file = await Deno.open(filePath, { read: true })
      await file.seek(start, Deno.SeekMode.Start)

      let remaining = chunkSize
      const stream = new ReadableStream<Uint8Array>({
        async pull(controller) {
          if (remaining <= 0) {
            controller.close()
            try {
              file.close()
            } catch (_) { /* ignore */ }
            return
          }
          const toRead = Math.min(64 * 1024, remaining)
          const buf = new Uint8Array(toRead)
          const n = await file.read(buf)
          if (!n || n <= 0) {
            controller.close()
            try {
              file.close()
            } catch (_) { /* ignore */ }
            return
          }
          remaining -= n
          controller.enqueue(n === buf.length ? buf : buf.subarray(0, n))
          if (remaining <= 0) {
            controller.close()
            try {
              file.close()
            } catch (_) { /* ignore */ }
          }
        },
        cancel() {
          try {
            file.close()
          } catch (_) { /* ignore */ }
        },
      })

      const headers = new Headers({
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize.toString(),
        'Content-Type': getMimeType(filePath),
      })
      setCacheHeaders(headers, url)
      return new Response(stream, { status: 206, headers })
    }

    // full file stream
    const file = await Deno.open(filePath, { read: true })
    const stream = new ReadableStream<Uint8Array>({
      async pull(controller) {
        const buf = new Uint8Array(64 * 1024)
        const n = await file.read(buf)
        if (!n || n <= 0) {
          controller.close()
          try {
            file.close()
          } catch (_) { /* ignore */ }
          return
        }
        controller.enqueue(n === buf.length ? buf : buf.subarray(0, n))
      },
      cancel() {
        try {
          file.close()
        } catch (_) { /* ignore */ }
      },
    })

    const headers = new Headers({
      'Content-Length': fileSize.toString(),
      'Content-Type': getMimeType(filePath),
      'Accept-Ranges': 'bytes',
    })
    setCacheHeaders(headers, url)
    return new Response(stream, { status: 200, headers })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}

function getMimeType(filePath: string) {
  const ext = extname(filePath).toLowerCase()
  if (ext === '.mp4') return 'video/mp4'
  if (ext === '.webm') return 'video/webm'
  if (ext === '.png') return 'image/png'
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.webp') return 'image/webp'
  if (ext === '.gif') return 'image/gif'
  return 'application/octet-stream'
}

function setCacheHeaders(headers: Headers, _url: URL) {
  // long cache for all media; immutable since filenames are content-addressed/versioned by deploys
  headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  headers.delete('ETag')
}

async function resolveExistingFile(relPath: string) {
  for (const base of MEDIA_DIRS) {
    const candidate = join(base, relPath)
    try {
      const stat = await Deno.stat(candidate)
      if (stat.isFile) return candidate
    } catch (_) {
      // continue
    }
  }
  return join(MEDIA_DIRS[0], relPath)
}
