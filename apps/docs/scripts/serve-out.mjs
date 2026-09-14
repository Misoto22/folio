#!/usr/bin/env node
/**
 * Serves the static export the way Cloudflare Pages does, for the end-to-end
 * suite.
 *
 * Deliberately serves `out/` rather than running `next dev`: the dev server
 * renders through a different pipeline, so a bug in the exported artifact — a
 * missing asset, a page that only works with the dev overlay present — would
 * pass the suite and then reach production. This tests the thing that ships.
 *
 * No dependency: a directory server that resolves `/x/` to `/x/index.html` and
 * falls back to `404.html` is thirty lines, and a dependency here would be
 * thirty lines plus a supply chain.
 *
 * It honours the export's `_redirects` too, through the same reader the unit
 * test uses, so a retired address is followed here the way Pages follows it.
 */
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { dirname, extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseRedirects, redirectFor } from './redirects.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'out')
const PORT = Number(process.env.PORT ?? 4024)
const REDIRECTS = join(ROOT, '_redirects')
const RULES = existsSync(REDIRECTS) ? parseRedirects(readFileSync(REDIRECTS, 'utf8')) : []

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
}

/** Resolves a URL path to a file, or undefined. Never escapes the root. */
function resolve(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '')
  const candidates = [
    join(ROOT, clean),
    join(ROOT, clean, 'index.html'),
    join(ROOT, `${clean.replace(/\/$/, '')}.html`),
  ]
  return candidates.find((file) => file.startsWith(ROOT) && existsSync(file) && statSync(file).isFile())
}

createServer((request, response) => {
  // Before the file lookup, as on Pages: a redirect is followed whether or not
  // an asset matches the request.
  const redirect = redirectFor(RULES, (request.url ?? '/').split('?')[0])
  if (redirect) {
    response.writeHead(redirect.status, { location: redirect.location })
    return response.end()
  }
  const file = resolve(request.url ?? '/')
  if (!file) {
    const notFound = join(ROOT, '404.html')
    response.writeHead(404, { 'content-type': TYPES['.html'] })
    if (existsSync(notFound)) return createReadStream(notFound).pipe(response)
    return response.end('Not found')
  }
  response.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' })
  createReadStream(file).pipe(response)
}).listen(PORT, () => {
  console.log(`serving out/ on http://127.0.0.1:${PORT}`)
})
