import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

/** The glyph itself, exported so a non-React surface can use the same mark. */
export const EXTERNAL_LINK_ARROW = '↗'

export type LinkArrowProps = HTMLAttributes<HTMLSpanElement>

/**
 * The mark on a link that leaves the page — outbound, or on to a full index.
 *
 * Call sites used to write a bare `↗` inside the link text, which inherited the
 * link's own size (a 17px arrow beside a 17px word, competing with it) and was
 * read aloud as "north east arrow" because nothing hid it.
 *
 * `inline-block` is load-bearing twice over: it stops an underlined parent
 * drawing its rule through the glyph, and it is what `align` is measured
 * against. Sized in `em`, so it tracks whatever type it sits beside; coloured
 * against paper, so a call site on a reversed plate passes its own colour.
 *
 * @example
 * <a href="https://example.com">Read the paper<LinkArrow /></a>
 */
export function LinkArrow({ className, ...rest }: LinkArrowProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'ms-(--space-arrow) inline-block align-[0.28em] font-mono text-[0.68em] leading-none text-(--ink-3-aa)',
        className,
      )}
      {...rest}
    >
      {EXTERNAL_LINK_ARROW}
    </span>
  )
}

export default LinkArrow
