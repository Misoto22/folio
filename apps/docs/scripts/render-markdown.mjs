/**
 * Markdown → the blocks the article template renders.
 *
 * Everything happens HERE, at build time, and nothing ships to the browser: no
 * parser, no highlighter, no maths font. A statically exported documentation
 * site that shipped a Markdown pipeline to re-derive markup that never changes
 * would be paying for the same work on every page view, and the largest thing
 * on the page would be the thing nobody sees.
 *
 * Four decisions worth stating.
 *
 * MATHS IS MathML. KaTeX can emit MathML instead of its own span-and-CSS
 * arrangement, and MathML Core is in every current browser. That is a
 * stylesheet and four font files not shipped, and the formula is set in the
 * page's own face rather than in KaTeX's — which on a monochrome editorial
 * system is the difference between a formula and a foreign object.
 *
 * FIGURES ARE DATA. A ```diagram or ```steps fence holds JSON, rendered by the
 * package's own `Diagram` or `Steps` component. So a flow chart or a numbered
 * pipeline in a post is drawn from the same tokens as everything else,
 * server-renders, and is corrected by editing JSON — rather than pulling in a
 * diagramming library that arrives after hydration and draws in its own
 * palette.
 *
 * CODE IS SHIKI, with this system's own theme, so a fence in a post looks like
 * a fence anywhere else on the site.
 *
 * A TABLE IS ALLOWED TO SCROLL. It is wrapped in its own overflow box, because
 * a six-column table inside a 46rem measure either overflows the page or is
 * squeezed until the numbers wrap.
 */
import MarkdownIt from 'markdown-it'
import footnote from 'markdown-it-footnote'
import taskLists from 'markdown-it-task-lists'
import katex from 'katex'
import { HIGHLIGHT } from './shiki-theme.mjs'

/** `# Heading` → `heading`, for anchors and the table of contents. */
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[`*_~[\]()]/g, '')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * A `$` that opens or closes a formula, rather than a price or a shell prompt.
 *
 * The rule is the one markdown-it-katex settled on: a delimiter may not have
 * whitespace on the inside, and a closing `$` may not be followed immediately
 * by a digit — which is what keeps `$5` and `costs $5.00` out of the parser.
 */
function canClose(state, position) {
  const previous = position > 0 ? state.src.charCodeAt(position - 1) : -1
  const next = position + 1 <= state.posMax ? state.src.charCodeAt(position + 1) : -1
  if (previous === 0x20 || previous === 0x09 || previous === 0x0a) return false
  if (next >= 0x30 && next <= 0x39) return false
  return true
}

/** `$…$` — inline maths. */
function mathInline(state, silent) {
  if (state.src[state.pos] !== '$') return false
  const start = state.pos + 1
  if (start > state.posMax) return false
  const opener = state.src.charCodeAt(start)
  if (opener === 0x20 || opener === 0x09 || opener === 0x0a) return false

  let match = start
  for (;;) {
    match = state.src.indexOf('$', match)
    if (match === -1) return false
    let escapes = match - 1
    while (state.src[escapes] === '\\') escapes -= 1
    if ((match - escapes) % 2 === 1) break
    match += 1
  }
  if (match === start) return false
  if (!canClose(state, match)) return false

  if (!silent) {
    const token = state.push('math_inline', 'math', 0)
    token.markup = '$'
    token.content = state.src.slice(start, match)
  }
  state.pos = match + 1
  return true
}

/** `$$…$$` on its own lines — display maths. */
function mathBlock(state, startLine, endLine, silent) {
  const start = state.bMarks[startLine] + state.tShift[startLine]
  const max = state.eMarks[startLine]
  if (start + 2 > max) return false
  if (state.src.slice(start, start + 2) !== '$$') return false

  let first = state.src.slice(start + 2, max).trim()
  let line = startLine
  let found = first.endsWith('$$') && first.length > 1
  if (found) first = first.slice(0, -2).trim()

  const body = found ? [first] : first ? [first] : []
  while (!found) {
    line += 1
    if (line >= endLine) break
    const from = state.bMarks[line] + state.tShift[line]
    const to = state.eMarks[line]
    const text = state.src.slice(from, to)
    if (text.trim().endsWith('$$')) {
      body.push(text.trim().slice(0, -2))
      found = true
      break
    }
    body.push(text)
  }
  if (!found) return false

  if (!silent) {
    const token = state.push('math_block', 'math', 0)
    token.block = true
    token.content = body.join('\n').trim()
    token.map = [startLine, line + 1]
    token.markup = '$$'
  }
  state.line = line + 1
  return true
}

const render = (tex, displayMode) => {
  const html = katex.renderToString(tex, {
    // MathML only — no KaTeX stylesheet, no KaTeX fonts, and the formula
    // inherits the page's own face.
    output: 'mathml',
    displayMode,
    throwOnError: false,
    strict: 'ignore',
  })
  // KaTeX wraps its output in an inline `<span>` whatever the mode. A display
  // formula that stays inline sits on the text baseline of an empty line and
  // takes none of the article's block rhythm, so the wrapper is swapped for a
  // real block element rather than talked out of being inline with CSS.
  if (!displayMode) return html
  return `<div class="folio-math">${html.replace(/^<span class="katex">/, '').replace(/<\/span>$/, '')}</div>`
}

/**
 * @param {object} options
 * @param {import('shiki').Highlighter} options.highlighter
 */
export function createRenderer({ highlighter }) {
  const md = new MarkdownIt({ html: true, linkify: true, breaks: false })
  md.use(footnote)
  // `- [x]` is a real checkbox, disabled: a task list in a published post
  // reports state, it does not collect it.
  md.use(taskLists, { enabled: false, label: true })

  md.inline.ruler.after('escape', 'math_inline', mathInline)
  md.block.ruler.after('blockquote', 'math_block', mathBlock, {
    alt: ['paragraph', 'reference', 'blockquote', 'list'],
  })
  md.renderer.rules.math_inline = (tokens, index) => render(tokens[index].content, false)
  md.renderer.rules.math_block = (tokens, index) => render(tokens[index].content, true)

  // Headings carry their own id, so a table of contents and an anchor link
  // agree without a second pass over the rendered HTML.
  const headings = []
  md.renderer.rules.heading_open = (tokens, index, options, env, self) => {
    const level = Number(tokens[index].tag.slice(1))
    const text = tokens[index + 1]?.content ?? ''
    const id = slugify(text)
    tokens[index].attrSet('id', id)
    if (level === 2 || level === 3) headings.push({ id, text, level })
    return self.renderToken(tokens, index, options)
  }

  // A wide table scrolls inside its own box rather than pushing the page.
  md.renderer.rules.table_open = () => '<div class="folio-table-scroll"><table>'
  md.renderer.rules.table_close = () => '</table></div>'

  /** The fences that are a COMPONENT rather than code, and what to call them. */
  const FIGURES = new Set(['diagram', 'steps'])
  /** Figure specs lifted out of the stream, in the order they appeared. */
  let figures = []
  md.renderer.rules.fence = (tokens, index) => {
    const token = tokens[index]
    const lang = (token.info ?? '').trim().split(/\s+/)[0] || 'text'
    if (FIGURES.has(lang)) {
      try {
        figures.push({ kind: lang, spec: JSON.parse(token.content) })
        // A marker rather than markup: the caller splits on it and renders the
        // real component in the gap.
        return `<!--folio-figure:${figures.length - 1}-->`
      } catch {
        // A malformed spec is a content bug, and it should be visible in the
        // page rather than swallowed into an empty gap.
        return `<pre><code>Invalid ${lang} spec\n${md.utils.escapeHtml(token.content)}</code></pre>`
      }
    }
    const known = highlighter.getLoadedLanguages().includes(lang)
    return highlighter.codeToHtml(token.content.replace(/\n$/, ''), {
      lang: known ? lang : 'text',
      ...HIGHLIGHT,
    })
  }

  /**
   * One Markdown file → `{ meta, blocks, toc }`.
   *
   * Blocks, not one string, because a figure is a React component and cannot
   * arrive as HTML. The prose either side of it stays HTML; the figure becomes
   * a spec the template hands to `Diagram` or `Steps`.
   */
  return function renderMarkdown(source) {
    headings.length = 0
    figures = []

    const { meta, body } = frontMatter(source)
    const html = md.render(body)

    const blocks = []
    let cursor = 0
    const pattern = /<!--folio-figure:(\d+)-->/g
    let match
    while ((match = pattern.exec(html)) !== null) {
      const before = html.slice(cursor, match.index).trim()
      if (before) blocks.push({ kind: 'html', html: before })
      blocks.push(figures[Number(match[1])])
      cursor = match.index + match[0].length
    }
    const tail = html.slice(cursor).trim()
    if (tail) blocks.push({ kind: 'html', html: tail })

    return {
      meta,
      blocks,
      toc: [...headings],
      // Two hundred words a minute, rounded up, which is the number every
      // reading-time library settles on and not worth a dependency.
      readingMinutes: Math.max(1, Math.round(body.split(/\s+/).length / 200)),
    }
  }
}

/**
 * The `---` block at the top of a post.
 *
 * A five-line parser rather than a YAML dependency, because the front matter
 * here is `key: value` and lists in `[a, b]` — and the moment it needs more
 * than that, the right answer is a real CMS rather than a bigger parser.
 */
function frontMatter(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source)
  if (!match) return { meta: {}, body: source }
  const meta = {}
  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':')
    if (separator === -1) continue
    const key = line.slice(0, separator).trim()
    const raw = line.slice(separator + 1).trim()
    meta[key] = raw.startsWith('[')
      ? raw
          .slice(1, -1)
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      : raw.replace(/^['"]|['"]$/g, '')
  }
  return { meta, body: source.slice(match[0].length) }
}
