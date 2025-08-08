import { HandlerContext } from '$fresh/server.ts'
import { extname, join } from 'https://deno.land/std@0.224.0/path/mod.ts'

const VIDEO_DIR = './media/videos'

export const handler = async (req: Request, ctx: HandlerContext) => {
  const { path } = ctx.params
  const filePath = join(VIDEO_DIR, Array.isArray(path) ? path.join('/') : path)
  try {
    const stat = await Deno.stat(filePath)
    if (!stat.isFile) return new Response('Not found', { status: 404 })

    const range = req.headers.get('range')
    const fileSize = stat.size

    if (range) {
      // Parse Range header, e.g. "bytes=0-1023"
      const match = range.match(/bytes=(\d+)-(\d*)/)
      if (!match) return new Response('Invalid range', { status: 416 })

      const start = parseInt(match[1], 10)
      const end = match[2] ? parseInt(match[2], 10) : fileSize - 1
      if (start >= fileSize || end >= fileSize) {
        return new Response('Range Not Satisfiable', { status: 416 })
      }

      const chunkSize = end - start + 1

      const file = await Deno.open(filePath, { read: true })
      await file.seek(start, Deno.SeekMode.Start)

      // Stream the requested range to handle partial reads reliably
      let remaining = chunkSize
      const stream = new ReadableStream<Uint8Array>({
        async pull(controller) {
          if (remaining <= 0) {
            controller.close()
            try {
              file.close()
            } catch (_) {
              // ignore closing errors on stream completion
            }
            return
          }
          const toRead = Math.min(64 * 1024, remaining)
          const buf = new Uint8Array(toRead)
          const n = await file.read(buf)
          if (!n || n <= 0) {
            controller.close()
            try {
              file.close()
            } catch (_) {
              // ignore closing errors on stream completion
            }
            return
          }
          remaining -= n
          controller.enqueue(n === buf.length ? buf : buf.subarray(0, n))
          if (remaining <= 0) {
            controller.close()
            try {
              file.close()
            } catch (_) {
              // ignore closing errors on stream completion
            }
          }
        },
        cancel() {
          try {
            file.close()
          } catch (_) {
            // ignore closing errors on cancel
          }
        },
      })

      return new Response(stream, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': getMimeType(filePath),
        },
      })
    } else {
      // No range: serve whole file
      const file = await Deno.open(filePath, { read: true })
      const stream = new ReadableStream<Uint8Array>({
        async pull(controller) {
          const buf = new Uint8Array(64 * 1024)
          const n = await file.read(buf)
          if (!n || n <= 0) {
            controller.close()
            try {
              file.close()
            } catch (_) {
              // ignore closing errors on stream completion
            }
            return
          }
          controller.enqueue(n === buf.length ? buf : buf.subarray(0, n))
        },
        cancel() {
          try {
            file.close()
          } catch (_) {
            // ignore closing errors on cancel
          }
        },
      })

      return new Response(stream, {
        status: 200,
        headers: {
          'Content-Length': fileSize.toString(),
          'Content-Type': getMimeType(filePath),
          'Accept-Ranges': 'bytes',
        },
      })
    }
  } catch (_err) {
    return new Response('Not found', { status: 404 })
  }
}

function getMimeType(filePath: string) {
  const ext = extname(filePath).toLowerCase()
  if (ext === '.mp4') return 'video/mp4'
  if (ext === '.webm') return 'video/webm'
  // add more as needed
  return 'application/octet-stream'
}
