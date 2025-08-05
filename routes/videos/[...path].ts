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
    const file = await Deno.open(filePath, { read: true })
    const fileSize = stat.size

    if (range) {
      // Parse Range header, e.g. "bytes=0-1023"
      const match = range.match(/bytes=(\d+)-(\d*)/)
      if (!match) return new Response('Invalid range', { status: 416 })

      const start = parseInt(match[1], 10)
      const end = match[2] ? parseInt(match[2], 10) : fileSize - 1
      if (start >= fileSize || end >= fileSize) {
        file.close()
        return new Response('Range Not Satisfiable', { status: 416 })
      }

      const chunkSize = end - start + 1
      await file.seek(start, Deno.SeekMode.Start)
      const chunk = new Uint8Array(chunkSize)
      await file.read(chunk)
      file.close()

      return new Response(chunk, {
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
      const data = await Deno.readFile(filePath)
      file.close()
      return new Response(data, {
        status: 200,
        headers: {
          'Content-Length': fileSize.toString(),
          'Content-Type': getMimeType(filePath),
          'Accept-Ranges': 'bytes',
        },
      })
    }
  } catch (err) {
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
