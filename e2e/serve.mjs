/*
  Serves the export the way the Worker's asset handler does, which
  `python3 -m http.server` does not: `next export` writes `console.html`, not
  `console/index.html`, so a bare `/console` 404s under a plain file server and the
  suite could only ever reach `/`. Eight of nine pages were untestable.

  Three rules, in the order the Worker applies them: an exact file, then
  `<path>.html`, then `<path>/index.html`. Anything else is the 404 page, with the
  404 status — a soft 404 that answers 200 is how a broken link ships.
*/
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const ROOT = new URL('../out/', import.meta.url).pathname
const PORT = Number(process.env.PORT ?? 3000)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
}

async function read(p) {
  try {
    return await readFile(p)
  } catch {
    return null
  }
}

createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '')
  const base = join(ROOT, path)
  const candidates = extname(path)
    ? [base]
    : [base, `${base.replace(/\/$/, '')}.html`, join(base, 'index.html')]

  for (const c of candidates) {
    const body = await read(c)
    if (body) {
      res.writeHead(200, { 'Content-Type': TYPES[extname(c)] ?? 'application/octet-stream' })
      return res.end(body)
    }
  }
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end((await read(join(ROOT, '404.html'))) ?? 'Not found')
}).listen(PORT)
