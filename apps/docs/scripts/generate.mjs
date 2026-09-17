#!/usr/bin/env node
/**
 * Builds everything this site knows about the design package, from the design
 * package itself.
 *
 * Three inputs, three outputs, no hand-maintained duplicates:
 *
 *   packages/design/src/components/**    → src/generated/props.json
 *                                        → src/generated/component-registry.ts
 *   packages/design/dist/tokens.json     → src/generated/tokens.json
 *   packages/design/dist/agent/          → src/generated/catalog.ts
 *   apps/docs/src/examples/**            → src/generated/examples.json
 *
 * Examples are the interesting one. Each example is a real `.tsx` file that the
 * site IMPORTS and renders; this script reads the same file's text and stores
 * the displayed snippet. So the code block and the live preview are the same
 * source, and a preview cannot drift from the code printed beneath it — which
 * is the failure mode of every documentation site that keeps the two apart.
 *
 * Run by `predev` and `prebuild`; the output is gitignored.
 */
import { cpSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHighlighter } from 'shiki'
import { extractChangelog } from './extract-changelog.mjs'
import { HIGHLIGHT, WHITE_RESET_DARK, WHITE_RESET_LIGHT } from './shiki-theme.mjs'
import { createRenderer } from './render-markdown.mjs'
import { extractProps } from '../../../packages/design/scripts/extract-props.mjs'
import { ENTRY_POINTS } from '../../../packages/design/agent/catalog.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const DOCS = join(HERE, '..')
const DESIGN = join(DOCS, '..', '..', 'packages', 'design')
const OUT = join(DOCS, 'src', 'generated')

/**
 * This site's own furniture, which a reader must not be told to paste.
 *
 * `ExampleControls` moves an example's demo knobs into the canvas toolbar. The
 * knobs themselves ARE the lesson — wiring state to a prop is what several of
 * these examples are for — so the children stay and only the wrapper goes, the
 * same way `export function Example()` goes.
 */
const CONTROLS_WRAPPER = /^[ \t]*<ExampleControls>\n([\s\S]*?)\n[ \t]*<\/ExampleControls>[ \t]*$/gm

function unwrapControls(jsx) {
  return jsx.replace(CONTROLS_WRAPPER, (_, inner) =>
    inner
      .split('\n')
      // One level out, because the wrapper it sat in is gone.
      .map((line) => (line.startsWith('  ') ? line.slice(2) : line))
      .join('\n'),
  )
}

/**
 * Strips a snippet down to what a reader should copy: the imports come from the
 * package, not from a relative path inside this repository, and the file's
 * scaffolding (`export function Example()`) is not part of the lesson.
 */
function toSnippet(source) {
  const marker = source.indexOf('return (')
  if (marker === -1) {
    // A example that is a plain expression body rather than a block.
    return source.replace(/^import[\s\S]*?\n\n/, '').trim()
  }
  const body = source.slice(marker + 'return ('.length)
  const end = body.lastIndexOf('\n  )')
  const jsx = (end === -1 ? body : body.slice(0, end))
    .split('\n')
    // The JSX sits two levels in inside the example function; unindent it so the
    // snippet reads as something you would paste.
    .map((line) => (line.startsWith('    ') ? line.slice(4) : line))
    .join('\n')
    .trim()

  const imports = source
    .split('\n')
    .filter((line) => line.startsWith('import') && line.includes('@misoto22/folio'))
    .join('\n')

  const printed = unwrapControls(jsx)
  return imports ? `${imports}\n\n${printed}` : printed
}

/**
 * The doc block directly above `export function Example`, and nothing else.
 *
 * The inner group is forbidden from crossing a comment close, so a file that
 * opens with a header block of its own does not get swallowed into one match
 * reaching from the top of the file down to the export.
 */
const DOC_BLOCK = /\/\*\*((?:(?!\*\/)[\s\S])*)\*\/\s*(?=export function Example\b)/

/**
 * The sentence an example says about itself: what it shows, and when to reach
 * for it.
 *
 * Authored in the example file rather than in a table here, for the same reason
 * the snippet is read from the file instead of being retyped beside it — a
 * description kept anywhere else is a second copy that the code can move out
 * from under, and the stale one is the one a reader believes.
 *
 * Reflowed to a single line, because the block is wrapped to the file's column
 * and the page sets its own measure; the author's line breaks are not content.
 * Absent rather than empty when there is no block: most examples do not carry
 * one yet, and a heading with nothing under it is the section as it reads today.
 */
function readDescription(source) {
  const block = DOC_BLOCK.exec(source)
  if (!block) return undefined
  const text = block[1]
    .split('\n')
    .map((line) => line.replace(/^\s*\*? ?/, '').trim())
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text || undefined
}

async function main() {
  mkdirSync(OUT, { recursive: true })

  // ─── Fonts ───
  // The package vendors its faces next to its CSS, with relative URLs that only
  // resolve from inside the package. A statically exported Next app serves from
  // `public/`, so the files are copied there and the rules rewritten to
  // absolute paths — one generated file rather than a second hand-kept copy of
  // the weight list.
  const fontsOut = join(DOCS, 'public', 'fonts')
  mkdirSync(fontsOut, { recursive: true })
  cpSync(join(DESIGN, 'src', 'styles', 'fonts'), fontsOut, { recursive: true })
  writeFileSync(
    join(OUT, 'fonts.css'),
    readFileSync(join(DESIGN, 'src', 'styles', 'fonts.css'), 'utf8').replaceAll("'./fonts/", "'/fonts/"),
  )

  // ─── Props ───
  // One map over every entry point the package declares. A reader does not care
  // which barrel a thing came out of, and keying them together is what makes
  // the registry test's "documents everything the package ships" cover all of
  // them. Derived from ENTRY_POINTS rather than listed here, so the next entry
  // is one line in the catalog and nothing in this file.
  const propsByEntry = Object.fromEntries(
    Object.entries(ENTRY_POINTS).map(([specifier, folder]) => [
      specifier,
      extractProps(join(DESIGN, 'src', folder)),
    ]),
  )
  const props = Object.assign({}, ...Object.values(propsByEntry))
  // Placed after the highlighter exists, below — see `highlightTypes`.
  writeFileSync(join(OUT, 'props.json'), JSON.stringify(props, null, 2))

  // A static map from export name to the component itself, for the properties
  // panel's live preview. The same trick as the example registry below, and for
  // the same two reasons: a statically exported app cannot resolve a component
  // from a string at runtime, and React cannot pass a function from a server
  // component into a client one — so the panel looks its subject up on the
  // client side of the boundary rather than being handed it.
  //
  // PascalCase only. `extract-props.mjs` documents exported CONSTANTS beside the
  // components — `ERROR_ACTION_CLASS`, `EXTERNAL_LINK_ARROW` — and a string is
  // not something `createElement` can render.
  //
  // One namespace per entry point, and each name looked up in the one it
  // actually ships from: `charts` and `diagrams` are separate barrels, and
  // `design.AreaChart` is not a blank preview — it is undefined, which React
  // throws on. The namespace identifier is the specifier's last segment, so a
  // fourth entry point needs nothing here either.
  const namespaceOf = (specifier) => specifier.split('/').pop()
  const previewable = new Map()
  for (const [specifier, sources] of Object.entries(propsByEntry)) {
    for (const source of Object.values(sources)) {
      for (const entry of source.components) {
        if (!/^[A-Z][A-Za-z0-9]*$/.test(entry.name)) continue
        if (!previewable.has(entry.name)) previewable.set(entry.name, specifier)
      }
    }
  }
  const namespaceImports = Object.keys(ENTRY_POINTS)
    .map((specifier) => `import * as ${namespaceOf(specifier)} from '${specifier}'`)
    .join('\n')
  writeFileSync(
    join(OUT, 'component-registry.ts'),
    `/* GENERATED by scripts/generate.mjs — do not edit. */\n` +
      `import type { ComponentType } from 'react'\n` +
      `${namespaceImports}\n\n` +
      `export const COMPONENTS = {\n` +
      [...previewable.keys()]
        .sort()
        .map((name) => `  ${name}: ${namespaceOf(previewable.get(name))}.${name},`)
        .join('\n') +
      `\n} as unknown as Record<string, ComponentType<Record<string, unknown>>>\n`,
  )

  // ─── Tokens ───
  // Read from the package's own emitted artifact, not parsed here. The parser
  // used to live in this app, which meant the site and the package could
  // disagree about what a token was — and the site would have been the one
  // people believed. `pnpm build:design` produces this file; the docs build
  // depends on it having run.
  const tokens = JSON.parse(readFileSync(join(DESIGN, 'dist', 'tokens.json'), 'utf8'))
  writeFileSync(join(OUT, 'tokens.json'), JSON.stringify(tokens, null, 2))

  // ─── Catalog ───
  // What each component IS — group, summary, when to reach for it, the
  // accessibility promises and the keyboard contract. Authored in the package
  // (`agent/catalog.mjs`) for the same reason the tokens are: it describes the
  // components, so a copy kept here would be a second answer to a question the
  // package already answers, and this one would be the one people read.
  const catalog = JSON.parse(readFileSync(join(DESIGN, 'dist', 'agent', 'catalog.json'), 'utf8'))
  // Emitted as a module rather than as JSON, like the example registry beside
  // it. `registry.ts` is imported by the Playwright specs as well as by the
  // app, and a bare JSON import is a runtime error under Node's own ESM loader
  // — it wants an import attribute Next and Vitest do not need.
  writeFileSync(
    join(OUT, 'catalog.ts'),
    `/* GENERATED by scripts/generate.mjs from packages/design/dist/agent/catalog.json — do not edit. */\n` +
      `export default ${JSON.stringify(catalog, null, 2)}\n`,
  )

  // ─── Examples ───
  const highlighter = await createHighlighter({
    // The system's own pair, not GitHub's. See `shiki-theme.mjs`: structure is
    // carried by weight, and the only two hues are the two the system already
    // spends on status. A published theme put seven of them on a page whose
    // argument is that it has none.
    //
    // Two themes because the site has two: Shiki emits both as CSS variables on
    // one markup pass, so switching mode does not re-highlight anything.
    themes: [WHITE_RESET_LIGHT, WHITE_RESET_DARK],
    langs: ['tsx', 'ts', 'css', 'bash', 'json', 'html', 'md'],
  })

  const examplesDir = join(DOCS, 'src', 'examples')
  const examples = {}
  for (const entry of readdirSync(examplesDir).sort()) {
    const dir = join(examplesDir, entry)
    if (!statSync(dir).isDirectory()) continue
    examples[entry] = readdirSync(dir)
      .filter((file) => file.endsWith('.tsx'))
      .sort()
      .map((file) => {
        const source = readFileSync(join(dir, file), 'utf8')
        const description = readDescription(source)
        // Stripped before the snippet is cut: the page prints the sentence
        // above the canvas, and a reader who opens the code to copy it wants
        // the JSX, not the paragraph they have just read.
        const snippet = toSnippet(source.replace(DOC_BLOCK, ''))
        const id = file.replace(/\.tsx$/, '')
        return {
          id,
          // The leading digits order the files on disk and are not part of the
          // heading — putting the order in the filename keeps it visible in a
          // directory listing instead of hidden in a second registry.
          title: id.replace(/^\d+-/, '').replace(/-/g, ' '),
          // Spread rather than set, so an example with no block stays absent
          // from the JSON rather than carrying an empty string every consumer
          // would then have to tell apart from a real one.
          ...(description ? { description } : {}),
          snippet,
          lang: 'tsx',
          html: highlighter.codeToHtml(snippet, { lang: 'tsx', ...HIGHLIGHT }),
        }
      })
  }
  writeFileSync(join(OUT, 'examples.json'), JSON.stringify(examples, null, 2))

  // A static import map, because a statically exported Next app cannot resolve
  // a component from a string at runtime. Generated rather than hand-kept: a
  // new example file must appear in the site without anyone editing a barrel,
  // and a deleted one must not leave a dangling import behind.
  const imports = []
  const rows = []
  let index = 0
  for (const [dir, list] of Object.entries(examples)) {
    for (const example of list) {
      const binding = `Example${index}`
      imports.push(`import { Example as ${binding} } from '../examples/${dir}/${example.id}'`)
      rows.push(`  '${dir}/${example.id}': ${binding},`)
      index += 1
    }
  }
  writeFileSync(
    join(OUT, 'example-registry.ts'),
    `/* GENERATED by scripts/generate.mjs — do not edit. */\n` +
      `import type { ComponentType } from 'react'\n` +
      `${imports.join('\n')}\n\n` +
      `export const EXAMPLES: Record<string, ComponentType> = {\n${rows.join('\n')}\n}\n`,
  )

  // ─── Templates ───
  // Same trick as the examples: the page RENDERS the module and the code block
  // is read from the same file, so a template cannot drift from the source
  // printed under it. Templates are long, so only the highlighted markup is
  // stored — the raw text is read back from disk by the copy button's snippet.
  const templatesDir = join(DOCS, 'src', 'templates')
  const templates = {}
  for (const file of readdirSync(templatesDir).filter((name) => name.endsWith('.tsx')).sort()) {
    const source = readFileSync(join(templatesDir, file), 'utf8')
    const id = file.replace(/\.tsx$/, '')
    templates[id] = {
      source,
      lang: 'tsx',
      html: highlighter.codeToHtml(source, { lang: 'tsx', ...HIGHLIGHT }),
    }
  }
  writeFileSync(join(OUT, 'templates.json'), JSON.stringify(templates, null, 2))

  // Static imports, for the same reason the examples need them: a statically
  // exported app cannot resolve a component from a string at runtime.
  writeFileSync(
    join(OUT, 'template-registry.ts'),
    `/* GENERATED by scripts/generate.mjs — do not edit. */\n` +
      `import type { ComponentType } from 'react'\n` +
      Object.keys(templates)
        .map((id) => `import { ${id} } from '../templates/${id}'`)
        .join('\n') +
      `\n\nexport const TEMPLATE_COMPONENTS: Record<string, ComponentType> = {\n` +
      Object.keys(templates)
        .map((id) => `  ${id},`)
        .join('\n') +
      `\n}\n`,
  )

  // ─── Posts ───
  // Markdown rendered here rather than in the browser: a parser, a highlighter
  // and a maths renderer are a few hundred kilobytes to re-derive markup that
  // never changes. What ships is blocks — HTML for the prose, a spec for each
  // diagram, because a diagram is a component and cannot arrive as a string.
  const renderMarkdown = createRenderer({ highlighter })
  const postsDir = join(DOCS, 'src', 'content', 'posts')
  const posts = {}
  for (const file of readdirSync(postsDir).filter((name) => name.endsWith('.md')).sort()) {
    const slug = file.replace(/\.md$/, '')
    posts[slug] = { slug, ...renderMarkdown(readFileSync(join(postsDir, file), 'utf8')) }
  }
  writeFileSync(join(OUT, 'posts.json'), JSON.stringify(posts, null, 2))

  // ─── Changelog ───
  // The PACKAGE's file first — that is the one release-please writes, and the
  // one that ships to npm — then the repository root's, which holds the
  // hand-written pre-1.0 history and nothing since. Reading only the root is
  // what froze this page at 0.1.0 while two releases went out.
  writeFileSync(
    join(OUT, 'changelog.json'),
    JSON.stringify(
      extractChangelog([join(DESIGN, 'CHANGELOG.md'), join(DESIGN, '..', '..', 'CHANGELOG.md')]),
      null,
      2,
    ),
  )

  // ─── Search ───
  // One flat index over everything a reader might type. Built here rather than
  // matched at runtime over three separate shapes, so the sidebar's filter and
  // any future search UI ask the same question of the same text.
  const searchIndex = Object.entries(examples).flatMap(([dir, list]) =>
    list.map((example) => ({ dir, id: example.id, snippet: example.snippet })),
  )
  writeFileSync(join(OUT, 'search.json'), JSON.stringify(searchIndex, null, 2))

  // ─── Standalone snippets (installation, usage) ───
  const snippets = {}
  const snippetsFile = join(DOCS, 'src', 'content', 'snippets.json')
  for (const [id, snippet] of Object.entries(JSON.parse(readFileSync(snippetsFile, 'utf8')))) {
    // The language travels with the markup. A code block that does not say what
    // language it is in makes the reader infer it from the syntax, which is the
    // one thing they came to the block to learn.
    snippets[id] = {
      lang: snippet.lang,
      source: snippet.code,
      html: highlighter.codeToHtml(snippet.code, { lang: snippet.lang, ...HIGHLIGHT }),
    }
  }
  writeFileSync(join(OUT, 'snippets.json'), JSON.stringify(snippets, null, 2))

  // ─── Exported type declarations, highlighted ───
  // A component page prints its public type aliases verbatim. They are code, so
  // they get the same treatment as every other snippet rather than a hand-built
  // <pre> that renders in one flat colour.
  const types = {}
  for (const [dir, source] of Object.entries(props)) {
    if (source.exportedTypes.length === 0) continue
    const code = source.exportedTypes
      .map((type) => `export type ${type.name} = ${type.definition}`)
      .join('\n')
    types[dir] = {
      source: code,
      lang: 'tsx',
      html: highlighter.codeToHtml(code, { lang: 'tsx', ...HIGHLIGHT }),
    }
  }
  writeFileSync(join(OUT, 'types.json'), JSON.stringify(types, null, 2))

  // ─── The stack, with the versions this repository actually resolved ───
  // The landing page names what this is built on, and a hand-typed version
  // number on a landing page is wrong within a release. Read the two manifests
  // instead, so the strip is a fact about the build rather than a claim
  // somebody has to remember to update. Radix carries no version: it is two
  // dozen independently versioned packages and there is no one number to print.
  //
  // Names, not links. The strip is a credibility line under the two calls to
  // action, and five 13px anchors there are five tab stops before the page
  // starts and five hit targets under the pointer floor — paid for a
  // destination the reader can reach by typing the name they just read.
  const designPkg = JSON.parse(readFileSync(join(DESIGN, 'package.json'), 'utf8'))
  const docsPkg = JSON.parse(readFileSync(join(DOCS, 'package.json'), 'utf8'))
  const declared = (name) =>
    docsPkg.dependencies?.[name] ??
    docsPkg.devDependencies?.[name] ??
    designPkg.dependencies?.[name] ??
    designPkg.peerDependencies?.[name] ??
    designPkg.devDependencies?.[name]
  const stack = [
    { name: 'React', pkg: 'react' },
    { name: 'TypeScript', pkg: 'typescript' },
    { name: 'Tailwind CSS', pkg: 'tailwindcss' },
    { name: 'Radix UI' },
    { name: 'Remix Icon', pkg: '@remixicon/react' },
  ].map(({ pkg, ...row }) => {
    if (!pkg) return row
    const range = declared(pkg)
    if (!range) throw new Error(`generate: no version declared for ${pkg}`)
    return { ...row, version: range.replace(/^[\^~]/, '') }
  })
  writeFileSync(join(OUT, 'stack.json'), JSON.stringify(stack, null, 2))

  const templateCount = Object.keys(templates).length
  const componentCount = Object.keys(props).length
  const exampleCount = Object.values(examples).reduce((n, list) => n + list.length, 0)
  console.log(
    `generate: ${componentCount} components, ${exampleCount} examples, ` +
      `${templateCount} templates, ${Object.keys(posts).length} posts, ` +
      `${Object.keys(tokens).length} tokens → src/generated/`,
  )
}

await main()
