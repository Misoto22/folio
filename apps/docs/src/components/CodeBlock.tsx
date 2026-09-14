'use client'

import { Button, cn } from '@misoto22/folio'
import { RiCheckLine, RiFileCopyLine } from '@remixicon/react'
import { useEffect, useState } from 'react'

/**
 * What a language id is called on the block.
 *
 * Shiki's ids are not labels — `tsx` and `bash` are, `md` and `ts` are not, and
 * nobody reads `sh` as "shell". Anything absent falls through to the id in
 * upper case, which is right far more often than it is wrong.
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

export interface CodeBlockProps {
  /** Shiki output, highlighted at build time. */
  html: string
  /** The raw text, for the copy button. */
  source: string
  /**
   * The language the block is written in — printed on the block itself.
   *
   * Optional, and the omission is visible rather than silent: a block with no
   * language simply has no label, instead of claiming a wrong one.
   */
  lang?: string
  /** A filename or title, shown in place of the language when both would fit. */
  title?: string
  /** Names the scroll region. Defaults to something generic; pass better. */
  label?: string
  className?: string
}

/**
 * A highlighted snippet with a copy control.
 *
 * The markup is produced by Shiki during `generate.mjs`, not in the browser: a
 * highlighter is a few hundred kilobytes of grammar, and shipping it to
 * re-derive spans that never change would be the largest thing on the page.
 *
 * The strip along the top carries the language and the copy button. Both used
 * to be missing — the language entirely, and the button until the pointer
 * happened to be over the block, which on a touch screen is never. A code block
 * that does not say what language it is in makes the reader infer it from the
 * syntax, which is the one thing they came to the block to learn.
 */
export function CodeBlock({ html, source, lang, title, label = 'Code', className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(source)
      setCopied(true)
    } catch {
      // Clipboard access is denied in some embedded contexts. The snippet is
      // still selectable, so there is nothing to recover — and a thrown error
      // here would take the page down with it.
    }
  }

  const caption = title ?? (lang ? (LANGUAGE_LABEL[lang] ?? lang.toUpperCase()) : undefined)

  const copyButton = (
    <Button
      iconOnly
      size="sm"
      variant="ghost"
      onClick={copy}
      aria-label={copied ? 'Copied' : 'Copy the snippet'}
      className={cn(
        'shrink-0 pointer-coarse:min-h-11 pointer-coarse:min-w-11',
        // With no strip to sit in, the button floats over the code and appears
        // on hover. That is the fallback, not the default — and on a touch
        // screen it is not a fallback at all: a control that only appears on
        // hover does not exist on a phone, so it stays put there.
        !caption &&
          'absolute end-2 top-2 z-1 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100',
      )}
    >
      {copied ? (
        <RiCheckLine size={14} aria-hidden />
      ) : (
        <RiFileCopyLine size={14} aria-hidden />
      )}
    </Button>
  )

  return (
    <div
      className={cn(
        // `min-w-0` is what lets the scroller inside actually scroll. A grid or
        // flex item defaults to `min-width: auto`, so without it the block grew
        // to the min-content width of its longest line — an unbroken install
        // command — and pushed the whole page sideways on a phone.
        'group relative flex min-w-0 flex-col overflow-hidden rounded-(--radius-lg) border border-(--rule) bg-(--paper-2)',
        className,
      )}
    >
      {caption ? (
        <div className="flex items-center justify-between gap-3 border-b border-(--rule) py-1.5 ps-4 pe-1.5">
          <span className="mono-meta truncate text-(--ink-3-aa)">{caption}</span>
          {copyButton}
        </div>
      ) : (
        copyButton
      )}
      {/* Focusable, because a snippet that scrolls sideways and contains
          nothing focusable is unreachable by keyboard — there is no element to
          Tab to, so the right-hand half of a long line does not exist for
          anyone not using a mouse. */}
      <div
        tabIndex={0}
        role="region"
        aria-label={label}
        className="overflow-x-auto px-4 py-3.5 scroll-slim [&_pre]:m-0 [&_pre]:bg-transparent"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
