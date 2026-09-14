'use client'

import { Button, cn } from '@misoto22/folio'
import { RiCheckLine, RiFileCopyLine } from '@remixicon/react'
import { useEffect, useState } from 'react'

export interface CommandBlockProps {
  /** The command, exactly as it should be pasted. Comments and all. */
  source: string
  /** Printed on the strip, where a highlighted block prints its language. */
  label: string
  className?: string
}

/**
 * A command you copy, printed as typed.
 *
 * Not `CodeBlock`. That one renders Shiki markup produced during
 * `generate.mjs` from `content/snippets.json`, which is the right shape for a
 * TSX example and the wrong shape for `npx folio-design docs Button` — a
 * shell line has almost no syntax to colour, and routing it through a second
 * file and a build step is how a command ends up not being written down at all.
 *
 * The chrome matches `CodeBlock` deliberately: same strip, same copy control in
 * the same corner, same behaviour on a touch screen. A reader should not have
 * to work out that these two blocks are different kinds of thing, because for
 * their purposes they are not.
 */
export function CommandBlock({ source, label, className }: CommandBlockProps) {
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
      // Denied in some embedded contexts. The text is still selectable, so
      // there is nothing to recover — and throwing here takes the page down.
    }
  }

  return (
    <div
      className={cn(
        // `min-w-0` is what lets the scroller inside actually scroll: a flex or
        // grid item defaults to `min-width: auto` and would otherwise grow to
        // the width of its longest unbroken line.
        'flex min-w-0 flex-col overflow-hidden rounded-(--radius-lg) border border-(--rule) bg-(--paper-2)',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-(--rule) py-1.5 ps-4 pe-1.5">
        <span className="mono-meta truncate text-(--ink-3-aa)">{label}</span>
        <Button
          iconOnly
          size="sm"
          variant="ghost"
          onClick={copy}
          aria-label={copied ? 'Copied' : 'Copy the command'}
          className="shrink-0 pointer-coarse:min-h-11 pointer-coarse:min-w-11"
        >
          {copied ? (
            <RiCheckLine size={14} aria-hidden />
          ) : (
            <RiFileCopyLine size={14} aria-hidden />
          )}
        </Button>
      </div>
      {/* Focusable, because a block that scrolls sideways and contains nothing
          focusable is unreachable by keyboard — there is no element to Tab to,
          so the right-hand half of a long line does not exist for anyone not
          using a mouse. */}
      <div
        tabIndex={0}
        role="region"
        aria-label={label}
        className="overflow-x-auto px-4 py-3.5 scroll-slim"
      >
        <pre className="m-0 bg-transparent font-mono text-[12.5px] leading-[1.75] text-(--ink-2)">
          {source}
        </pre>
      </div>
    </div>
  )
}
