import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
}

/**
 * A key on a keyboard, set as one.
 *
 * Renders a `<kbd>`, which is the element that means this — a `<span>` styled
 * to look like a key tells a screen reader nothing. Sized in `em` so it tracks
 * whatever type it sits beside rather than fixing itself at one px value, which
 * is how the same shortcut ended up three different sizes across a page.
 *
 * Every dimension here tracked its context except the leading, which was a
 * literal `1.6` — the body's READING leading, on a chip that is never a
 * paragraph. Inside a control it therefore stood proud of the label beside it
 * and pushed the whole box past its own height token: the masthead's search
 * field measured 39px against a 36px `sm`, and it was this keycap doing it.
 * `--control-lh` is the leading a one-line box gets, and this is one.
 *
 * @example
 * Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open the palette.
 */
export function Kbd({ children, className, ...rest }: KbdProps) {
  return (
    <kbd
      className={cn(
        'inline-flex min-w-[1.6em] items-center justify-center rounded-(--radius-sm) border border-(--rule-2) px-(--space-chip-x) py-(--space-kbd-y) font-mono text-[0.8em] leading-(--control-lh) text-(--ink-2)',
        className,
      )}
      {...rest}
    >
      {children}
    </kbd>
  )
}

export default Kbd
