#!/usr/bin/env node
/**
 * Publishes the portable CSS layers next to the compiled Tailwind bundle.
 *
 * `dist/styles.css` is the self-contained stylesheet (Tailwind + tokens +
 * semantics + keyframes + the vendored @font-face rules appended). The three
 * layers are ALSO published on their own, because a consumer that already
 * compiles Tailwind wants the tokens without a second copy of Tailwind's
 * utilities — that is what the `./tokens.css` export is for.
 *
 * The font files are copied verbatim so the relative `url('./fonts/…')` in
 * both fonts.css and the appended tail resolves from dist/.
 */
import { cp, readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'src', 'styles')
const DIST = join(ROOT, 'dist')

const PORTABLE = [
  'tokens.css',
  'semantic.css',
  'themes.css',
  'article.css',
  'keyframes.css',
  'fonts.css',
  ...(await readdir(SRC)).filter(file => file.startsWith('website') && file.endsWith('.css')),
]

for (const file of PORTABLE) {
  await cp(join(SRC, file), join(DIST, file))
}
await cp(join(SRC, 'fonts'), join(DIST, 'fonts'), { recursive: true })

// Append the @font-face rules to the compiled bundle so a single
// `import '@misoto22/folio/styles.css'` also delivers the faces.
const fonts = await readFile(join(SRC, 'fonts.css'), 'utf8')
const bundle = await readFile(join(DIST, 'styles.css'), 'utf8')
await writeFile(join(DIST, 'styles.css'), `${bundle}\n${fonts}`)

console.log(`copy-portable-css: ${PORTABLE.join(', ')} + fonts/ → dist/`)
