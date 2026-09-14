'use client'

import { RiCheckLine, RiFileCopyLine } from '@remixicon/react'
import { cn } from '../../lib/cn'
import { useClipboardCopy } from '../../lib/useClipboardCopy'
import { Button } from '../Button/Button'

/**
 * What a language id is CALLED, for the handful where the id is not a label.
 *
 * Shiki's ids are identifiers, not words: `tsx` and `bash` read fine in upper
 * case, `md` and `ts` do not, and nobody reads `sh` as "shell". Anything absent
 * falls through to the id upper-cased, which is right far more often than it is
 * wrong — and a wrong label here is a label, not a crash.
 */
const LANGUAGE_LABEL: Record<string, string> = {
  bash: 'Shell',
  css: 'CSS',
  html: 'HTML',
  js: 'JavaScript',
  json: 'JSON',
  jsx: 'JSX',
  md: 'Markdown',
  sh: 'Shell',
  ts: 'TypeScript',
  tsx: 'TSX',
}

interface CommonProps {
  /**
   * The snippet, verbatim.
   *
   * Required even when `html` is supplied, and that is the point: this is what
   * the copy button puts on the clipboard. A block that copies its own rendered
   * markup hands the reader a wall of `<span>`s, and one that copies
   * `textContent` scraped back out of the DOM is a single non-breaking space
   * away from pasting something that does not run.
   */
  code: string
  /** A filename or a caption, printed at the start of the strip. */
  title?: string
  /**
   * The language, printed at the end of the strip.
   *
   * Optional, and the omission is visible rather than silent: a block with no
   * language gets no label instead of claiming a wrong one. A code block that
   * does not say what it is written in makes the reader infer it from the
   * syntax, which is the one thing they came to the block to learn.
   */
  lang?: string
  /**
   * Caps the block's height and scrolls past it.
   *
   * A number is pixels; a string is any CSS length (`'24rem'`, `'50vh'`). The
   * body scrolls in both axes and is focusable, so what is past the fold stays
   * reachable with a keyboard rather than merely present in the DOM.
   */
  maxHeight?: number | string
  /** Drops the copy button, for a block nobody is meant to run. */
  copyable?: boolean
  /** Accessible copy action, supplied by the host locale. */
  copyLabel?: string
  /** Accessible confirmation after copying. */
  copiedLabel?: string
  /**
   * Names the scrollable body for a screen reader. Defaults to `title`, and to
   * "Code" when there is not one.
   */
  label?: string
  className?: string
}

/**
 * The two forms, and why they are two.
 *
 * `html` is pre-highlighted markup for the SAME snippet. The package does not
 * highlight, and will not: a highlighter is a few hundred kilobytes of grammar
 * and a build-time job. The documentation site runs Shiki inside its generator
 * and hands the result here, which is the shape that half exists for. Without
 * `html` the block renders `code` as text, which is what a template, a README
 * or an agent's answer has and all it needs.
 *
 * `lineNumbers` and `highlightLines` belong to the plain form only, and that is
 * enforced in the TYPE rather than left to a note. They are a per-LINE
 * structure, and `html` is one opaque string this component is not going to
 * start parsing. Typed apart, passing both is a compile error at the call site;
 * typed together it is a prop that renders nothing and says nothing.
 *
 * The plain form is written first because the emitted prop table reads the
 * first arm of a union: this way `lineNumbers` documents as `boolean` rather
 * than as the `never` the other arm gives it.
 */
type WithPlainSource = CommonProps & {
  /**
   * Absent on this form; `string` on the other.
   *
   * Pass pre-highlighted markup — Shiki's output, run at build time over this
   * same `code` — and the block renders that instead of the plain text. Doing
   * so takes `lineNumbers` and `highlightLines` away with it.
   */
  html?: undefined
  /** Numbers every line, counting from one. */
  lineNumbers?: boolean
  /**
   * Lines to band, counting from one. A number past the end of the snippet is
   * ignored rather than throwing — the usual cause is a snippet that got
   * shorter while the annotation did not.
   */
  highlightLines?: number[]
}

type WithHighlightedHtml = CommonProps & {
  html: string
  /** Not available alongside `html`, which the component does not parse. */
  lineNumbers?: never
  /** Not available alongside `html`, which the component does not parse. */
  highlightLines?: never
}

export type CodeBlockProps = WithPlainSource | WithHighlightedHtml

/**
 * The caller's `<pre>`, normalised to ours.
 *
 * Shiki emits a `<pre>` of its own with a background and padding baked in, so
 * the highlighted path would otherwise draw a second plate a shade off the one
 * it is sitting on, at a size that does not match the plain path.
 */
const HIGHLIGHTED =
  '[&_pre]:m-0 [&_pre]:min-w-max [&_pre]:bg-transparent [&_pre]:p-0 [&_pre]:font-mono [&_pre]:text-[13px] [&_pre]:leading-[1.7] [&_code]:bg-transparent'

/**
 * A multi-line snippet, on a plate, with a way to take it away.
 *
 * A labelled block has a strip for its title, language and copy button.
 * Without a label, copying sits beside the code in the same row. It is deliberately
 * not a hover affordance: a control that appears on hover does not exist on a
 * touch screen, which is where a reader is most likely to want the snippet and
 * least able to select it by hand.
 *
 * Line numbers live INSIDE their own line's row rather than in a parallel gutter
 * column. Two columns sharing a line-height align right up until one of them
 * wraps, ships a different font, or scrolls on its own; a number that is a child
 * of the line it numbers cannot come apart from it. The cost is that a number
 * scrolls away with its line: it is inside the scrolling box, not in a gutter
 * beside it. A gutter that stayed put would be a second column to keep in sync,
 * which is the failure this avoids.
 *
 * The body is a focusable, named `role="group"`, and both halves of that are
 * load-bearing. Focusable, because a scrollable box whose contents are not
 * themselves focusable is unreachable by keyboard — there is nothing to Tab to
 * and therefore no way to press an arrow key at it, so the right-hand half of a
 * long line does not exist for anyone not using a mouse. Named, because a tab
 * stop that announces nothing lands the reader in an anonymous box and leaves
 * them to work out what they have arrived in.
 *
 * `group` rather than `region`, and that is the deliberate half. A region is a
 * LANDMARK — one of the handful of major sections a reader navigates a whole
 * page by — and a snippet is not one of those. Three fenced blocks in one
 * article would put three landmarks called "Code" into that map, which is
 * exactly the noise the `landmark-unique` rule exists to catch, and it would
 * push the page's real landmarks down a list nobody can now skim. `group`
 * carries the same accessible name to the same reader on the way in, and
 * carries it nowhere else.
 *
 * For a function name inside a sentence, reach for `Code`.
 *
 * @example
 * <CodeBlock code="pnpm add @misoto22/folio" lang="bash" />
 * @example
 * <CodeBlock
 *   title="cn.ts"
 *   lang="ts"
 *   lineNumbers
 *   highlightLines={[2]}
 *   maxHeight="24rem"
 *   code={source}
 * />
 * @example
 * // Highlighted at build time by the site's own Shiki pass.
 * <CodeBlock code={source} html={highlighted} lang="tsx" />
 */
export function CodeBlock({
  code,
  html,
  title,
  lang,
  maxHeight,
  copyable = true,
  copyLabel = 'Copy the snippet',
  copiedLabel = 'Copied',
  label,
  className,
  lineNumbers = false,
  highlightLines,
}: CodeBlockProps) {
  // Shared with the website ClipboardButton, including what a refused write does.
  const { copied, copy } = useClipboardCopy('CodeBlock')

  const languageLabel = lang ? (LANGUAGE_LABEL[lang] ?? lang.toUpperCase()) : undefined
  const banded = new Set(highlightLines ?? [])

  return (
    <div
      className={cn(
        // `min-w-0` is what lets the body below actually scroll: a grid or flex
        // item defaults to `min-width: auto`, so without it the block grows to
        // the min-content width of its longest line — an unbroken install
        // command — and pushes the whole page sideways on a phone.
        'min-w-0 overflow-hidden rounded-(--radius-md) border border-(--rule) bg-(--paper-2)',
        title || languageLabel ? 'flex flex-col' : 'grid grid-cols-[minmax(0,1fr)_auto] items-center',
        className,
      )}
    >
      {title || languageLabel || copyable ? (
        <div className={cn('flex items-center gap-3', title || languageLabel ? 'border-b border-(--rule) py-1.5 ps-4 pe-1.5' : 'col-start-2 row-start-1 p-1.5')}>
          {title ? <span className="mono-meta truncate text-(--ink-2)">{title}</span> : null}
          {languageLabel ? (
            <span className="mono-meta shrink-0 text-(--ink-3-aa)">{languageLabel}</span>
          ) : null}
          {copyable ? (
            <Button
              iconOnly
              size="sm"
              variant="ghost"
              onClick={() => void copy(code)}
              aria-label={copied ? copiedLabel : copyLabel}
              // `sm` is 36px, under the 44px a finger needs. The bump is gated
              // on a coarse pointer so a mouse-driven page keeps the compact
              // strip (WCAG 2.5.5).
              className="ms-auto shrink-0 pointer-coarse:min-h-11 pointer-coarse:min-w-11"
            >
              {copied ? (
                <RiCheckLine size={14} aria-hidden />
              ) : (
                <RiFileCopyLine size={14} aria-hidden />
              )}
            </Button>
          ) : null}
        </div>
      ) : null}

      <div
        tabIndex={0}
        // A named group, not a landmark: see the note above the component.
        role="group"
        aria-label={label ?? title ?? 'Code'}
        style={maxHeight === undefined ? undefined : { maxHeight }}
        className={cn('overflow-auto px-4 py-3.5 scroll-slim', !title && !languageLabel && 'col-start-1 row-start-1')}
      >
        {html === undefined ? (
          <pre className="m-0 min-w-max bg-transparent p-0 font-mono text-[13px] leading-[1.7]">
            <code className="block">
              {code.split('\n').map((line, index) => (
                <span
                  key={index}
                  data-line={index + 1}
                  data-highlighted={banded.has(index + 1) ? '' : undefined}
                  // The transparent border is carried by EVERY row, banded or
                  // not. On the banded ones alone it would shift them two pixels
                  // along the inline axis — which is the exact misalignment a
                  // highlight is there to help the reader see past.
                  //
                  // `min-h` is what keeps a blank line a line: an empty block
                  // has no line box and would otherwise collapse to nothing,
                  // taking every number below it out of step with its code.
                  className={cn(
                    'block min-h-[1.7em] border-s-2 border-transparent ps-2',
                    banded.has(index + 1) && 'border-(--accent) bg-(--stone)',
                  )}
                >
                  {lineNumbers ? (
                    <span
                      aria-hidden
                      className="inline-block w-8 shrink-0 select-none pe-3 text-end tabular-nums text-(--ink-3-aa)"
                    >
                      {index + 1}
                    </span>
                  ) : null}
                  {line}
                </span>
              ))}
            </code>
          </pre>
        ) : (
          // Trusted markup only: the output of the caller's own highlighter, run
          // over the caller's own `code`. It is not a place to put anything a
          // reader wrote — hand that to `code` and let the block render it as
          // text, which it cannot mis-execute.
          <div className={HIGHLIGHTED} dangerouslySetInnerHTML={{ __html: html }} />
        )}
      </div>
    </div>
  )
}

export default CodeBlock
