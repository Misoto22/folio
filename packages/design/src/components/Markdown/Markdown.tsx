import { Fragment, type ReactNode } from 'react'
import { Code } from '../Code/Code'
import { CodeBlock } from '../CodeBlock/CodeBlock'
import { Heading } from '../Heading/Heading'
import { LinkArrow } from '../LinkArrow/LinkArrow'
import { Separator } from '../Separator/Separator'
import { Text } from '../Text/Text'
import { isOutbound } from './inline'
import type { MarkdownHeadingLevel, MarkdownInline, MarkdownNode } from './nodes'
import { parseMarkdown } from './parse'
import { slugify } from './slug'

export type { MarkdownHeadingLevel, MarkdownInline, MarkdownNode } from './nodes'
export { parseMarkdown } from './parse'
export { slugify } from './slug'

/** The plain text of an inline run — what a heading's id is derived from. */
function textOf(nodes: MarkdownInline[]): string {
  return nodes
    .map((node) => {
      if (node.type === 'text' || node.type === 'code') return node.value
      if (node.type === 'image') return node.alt
      return textOf(node.children)
    })
    .join('')
}

interface RenderContext {
  headingLevelStart: MarkdownHeadingLevel
  idPrefix?: string
  markExternalLinks: boolean
  /** How many headings have already claimed each slug, for the `-2` suffix. */
  taken: Map<string, number>
}

function headingId(text: string, context: RenderContext): string {
  const base = slugify(text) || 'section'
  const seen = (context.taken.get(base) ?? 0) + 1
  context.taken.set(base, seen)
  const id = seen === 1 ? base : `${base}-${seen}`
  return context.idPrefix ? `${context.idPrefix}-${id}` : id
}

function renderInline(node: MarkdownInline, key: number, context: RenderContext): ReactNode {
  switch (node.type) {
    case 'text':
      return node.value
    case 'code':
      return <Code key={key}>{node.value}</Code>
    case 'strong':
      return (
        <strong key={key} className="font-medium text-(--ink)">
          {node.children.map((child, index) => renderInline(child, index, context))}
        </strong>
      )
    case 'emphasis':
      return (
        <em key={key} className="italic">
          {node.children.map((child, index) => renderInline(child, index, context))}
        </em>
      )
    case 'image':
      return (
        <img
          key={key}
          src={node.src}
          alt={node.alt}
          loading="lazy"
          className="h-auto max-w-full rounded-(--radius)"
        />
      )
    case 'link': {
      // Refusing `javascript:` keeps the link from EXECUTING; `rel` keeps it
      // from spending the page's reputation and its reader's location. The
      // author of this href is the untrusted party the component exists for,
      // so an outbound link they wrote passes no ranking on (`nofollow`) and
      // hands the destination no `Referer` to read the current URL out of
      // (`noreferrer`). A relative href cannot leave, so it is left alone.
      const outbound = isOutbound(node.href)
      return (
        <a
          key={key}
          href={node.href}
          rel={outbound ? 'noreferrer nofollow' : undefined}
          className="text-(--ink) underline decoration-[var(--rule-2)] underline-offset-4 transition-[text-decoration-color] duration-(--duration-fast) hover:decoration-[var(--ink)]"
        >
          {node.children.map((child, index) => renderInline(child, index, context))}
          {outbound && context.markExternalLinks ? <LinkArrow /> : null}
        </a>
      )
    }
  }
}

/**
 * A list item's blocks, unwrapped when there is only prose in it.
 *
 * A one-paragraph item renders its inline content directly, so a tight list
 * does not put a `<p>` inside every `<li>` — which is what Markdown means by a
 * tight list, and what keeps the item's line spacing the list's rather than the
 * paragraph's.
 */
function renderItem(blocks: MarkdownNode[], key: number, context: RenderContext): ReactNode {
  const first = blocks[0]
  const only = blocks.length === 1 && first?.type === 'paragraph' ? first : undefined
  return (
    <li key={key} className="relative">
      {only
        ? only.children.map((child, i) => renderInline(child, i, context))
        : blocks.map((block, i) => renderBlock(block, i, context))}
    </li>
  )
}

function renderBlock(node: MarkdownNode, key: number, context: RenderContext): ReactNode {
  switch (node.type) {
    case 'heading': {
      // Clamped, not wrapped: a level past six has nowhere to go, and an <h7>
      // is a <span> as far as every screen reader is concerned.
      const level = Math.min(6, node.level + context.headingLevelStart - 1) as MarkdownHeadingLevel
      return (
        <Heading key={key} level={level} id={headingId(textOf(node.children), context)}>
          {node.children.map((child, index) => renderInline(child, index, context))}
        </Heading>
      )
    }
    case 'paragraph':
      return (
        <Text key={key}>{node.children.map((child, index) => renderInline(child, index, context))}</Text>
      )
    case 'code':
      return <CodeBlock key={key} code={node.value} lang={node.lang} />
    case 'rule':
      // Not decorative: a thematic break is a change of subject the author
      // wrote, so it is announced rather than drawn and hidden.
      return <Separator key={key} weight="edge" decorative={false} />
    case 'quote':
      return (
        <blockquote
          key={key}
          className="m-0 border-s-2 border-(--rule-hard) ps-(--space-quote) font-serif text-[length:var(--fs-item)] leading-[1.55] text-(--ink) [&>*+*]:mt-(--space-list-block)"
        >
          {node.children.map((child, i) => renderBlock(child, i, context))}
        </blockquote>
      )
    case 'list':
      return node.ordered ? (
        <ol
          key={key}
          className="m-0 list-decimal ps-(--space-list-ordered) text-(--ink-2) marker:text-(--ink-3-aa) [&>li+li]:mt-(--space-list-item)"
        >
          {node.items.map((item, i) => renderItem(item, i, context))}
        </ol>
      ) : (
        // The marker is a hairline dash drawn on `::before`, not a disc: the
        // system's only filled circle is a status dot. `article.css` draws the
        // same dash on the same pseudo-element, so markdown dropped into an
        // Article coincides with the stylesheet rather than doubling it.
        <ul
          key={key}
          className="m-0 list-none ps-(--space-list) text-(--ink-2) [&>li+li]:mt-(--space-list-item) [&>li]:before:absolute [&>li]:before:-start-(--space-list) [&>li]:before:top-(--space-list-marker-y) [&>li]:before:h-px [&>li]:before:w-(--space-list-marker-w) [&>li]:before:bg-(--rule-2) [&>li]:before:content-['']"
        >
          {node.items.map((item, i) => renderItem(item, i, context))}
        </ul>
      )
  }
}

export interface MarkdownProps {
  /** The Markdown source. A string — not nodes, not HTML. */
  children: string
  /**
   * The level the document's top heading renders at.
   *
   * Markdown is written as a document, so its `#` is an `<h1>`. Dropped into a
   * page that already has one — inside an `<h2>` section, in a card, under a
   * dialog's title — that produces two first-level headings and an outline a
   * screen reader cannot navigate. Set this to the level BELOW the heading the
   * content sits under, and every level in the document shifts with it.
   */
  headingLevelStart?: MarkdownHeadingLevel
  /**
   * Namespaces the generated heading ids.
   *
   * Two documents on one page both containing "Installation" would otherwise
   * both claim `#installation`, and a fragment link would land on whichever the
   * browser found first.
   */
  idPrefix?: string
  /**
   * Adds the system's outbound arrow to links that leave for another site.
   *
   * Off by default, and opt-in rather than automatic for two reasons. The mark
   * is an addition to a sentence the component did not write, which is a
   * different kind of act from styling one. And `Markdown` has no idea what
   * origin it is being rendered on, so "leaves for another site" can only mean
   * "carries an `http`/`https` scheme" — an absolute link back to your own
   * domain gets the arrow too. A caller who knows the shape of their content
   * turns it on; one who does not should not have it turned on for them.
   *
   * The `rel` on an outbound link is NOT opt-in and cannot be turned off: it
   * is the security half of the same boundary as the scheme check.
   */
  markExternalLinks?: boolean
  /**
   * Bring your own parser.
   *
   * Anything that turns the source into `MarkdownNode`s: markdown-it, remark,
   * or a pipeline that already has an AST and only needs mapping. The node
   * shapes are exported alongside the component as `MarkdownNode`,
   * `MarkdownInline` and `MarkdownHeadingLevel`. The built-in parser covers the
   * subset this system styles; this is the seam for tables, footnotes, task
   * lists and everything else.
   */
  parse?: (source: string) => MarkdownNode[]
}

/**
 * A Markdown string, rendered as this system's components.
 *
 * The gap it fills is content nobody on this side wrote: a comment, a README, a
 * model's answer, a description out of a database. `Article` cannot take those
 * — it renders HTML through `dangerouslySetInnerHTML` and is documented as
 * trusted-input-only — and until now the alternative was a `<pre>` or a
 * sanitiser bolted onto a styling primitive.
 *
 * IT IS NOT AN `Article`, and the two do not merge. `Markdown` turns a string
 * into nodes; `Article` is the reading column those nodes can sit in. It
 * renders a FRAGMENT rather than a wrapper, which is what makes that nesting
 * work — `Article`'s rhythm is a direct-child combinator, so any element
 * between the two, `display: contents` included, would cost every paragraph
 * its spacing.
 *
 * ── It brings type and colour, and no vertical rhythm ──
 *
 * The nodes carry the system's faces and inks on their own, so one of these
 * looks right in isolation. It is not SPACED in isolation: every node renders
 * `m-0`, and a fragment has no box of its own to put a gap in. Nor does a
 * uniform `gap` on a container reproduce it, because prose spacing is not
 * uniform — `article.css` gives a heading 2.25em above and 0.75em below, which
 * is what sits a heading with the paragraph it introduces rather than midway
 * between two. For anything longer than a sentence — a comment, an answer, a
 * README — put it in `<Article as="div">` and get the real rhythm for the cost
 * of one element.
 *
 * ── A fenced code block brings a client component with it ──
 *
 * The renderer is plain functions and has no state, but a fenced block renders
 * `CodeBlock`, which is `'use client'` and arrives with `useState`,
 * `useEffect` and two icons. That is correct — the copy button is the reason
 * the block exists — but "server-rendered" only holds for content with no code
 * in it, which is worth knowing before this goes into a route that has no
 * client bundle yet.
 *
 * ── Why there is no parser in `dependencies` ──
 *
 * Three options, and the decision is written here because it is the one a
 * reader will want to argue with.
 *
 *  1. BUNDLE A PARSER. markdown-it is the obvious pick, and the documentation
 *     site already depends on it — but the site is an app and this is a
 *     library, where the dependency list is part of the contract every consumer
 *     signs. Measured with the same esbuild pass `check:size` uses, markdown-it
 *     is 110.7 kB minified against the 38.9 kB this package had left under its
 *     bundle budget. It is not close, and "we will raise the budget" is how a
 *     design system becomes the largest thing on a page.
 *  2. TAKE PRE-PARSED HTML, the way `Article` does. Cheapest, and wrong for the
 *     case this exists for: HTML from an untrusted author is the input this is
 *     supposed to make safe, and it cannot carry `headingLevelStart` or stable
 *     heading ids without the component parsing markup back apart to find them.
 *  3. PARSE THE SUBSET WE STYLE, and take a `parse` function for the rest.
 *     Chosen. The block grammar is line-based and small (see `parse.ts`), it
 *     emits React elements rather than markup — so there is no
 *     `dangerouslySetInnerHTML` in this path at all, no sanitiser to configure
 *     and no sanitiser to get wrong — and a consumer who needs tables,
 *     footnotes or task lists passes `parse` and keeps every other promise the
 *     component makes.
 *
 * Headings carry an `id` slugged from their own text and deduplicated within
 * the document, so a table of contents can link to them without the caller
 * post-processing the DOM to find out where they went.
 *
 * A link in the source is validated here, at the boundary: a scheme that is not
 * `http`, `https`, `mailto` or `tel` never becomes a link, and one that leaves
 * for another site carries `rel="noreferrer nofollow"` — so an author the page
 * does not trust cannot spend its ranking or read its URL out of the `Referer`.
 *
 * @example
 * // A comment body or an answer: the reading column is what spaces it.
 * <Article as="div">
 *   <Markdown headingLevelStart={3} idPrefix="answer">{answer}</Markdown>
 * </Article>
 * @example
 * // A whole document, in the column it was written for.
 * <Article><Markdown>{readme}</Markdown></Article>
 * @example
 * // Tables and footnotes, via the consumer's own pipeline.
 * <Markdown parse={(source) => toMarkdownNodes(md.parse(source, {}))}>{post}</Markdown>
 */
export function Markdown({
  children,
  headingLevelStart = 1,
  idPrefix,
  markExternalLinks = false,
  parse = parseMarkdown,
}: MarkdownProps) {
  const context: RenderContext = { headingLevelStart, idPrefix, markExternalLinks, taken: new Map() }
  const nodes = typeof children === 'string' ? parse(children) : []

  return <Fragment>{nodes.map((node, index) => renderBlock(node, index, context))}</Fragment>
}

export default Markdown
