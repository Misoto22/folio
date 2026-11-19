import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface CodeProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
}

/**
 * A function name, a flag, a filename — inside a sentence.
 *
 * Renders a `<code>`, which is the element that means this. A `<span>` in a
 * mono face looks identical and tells a screen reader nothing, and "pass
 * dash dash force" is not what the sentence said.
 *
 * Sized in `em` rather than in pixels, so the chip tracks whatever type it sits
 * beside — the same rule `Kbd` follows, and for the same reason: fixed at one
 * value, the identical token came out three different sizes on one page
 * depending on whether it landed in body copy, a caption or a table cell.
 *
 * The block form is `CodeBlock`. This one is inline by construction: it draws
 * no plate, keeps no whitespace, and a multi-line string handed to it collapses
 * into one run.
 *
 * @example
 * Pass <Code>--force</Code> to overwrite the existing file.
 * @example
 * The helper lives in <Code>src/lib/cn.ts</Code>.
 */
export function Code({ children, className, ...rest }: CodeProps) {
  return (
    <code
      className={cn(
        'rounded-(--radius-sm) bg-(--stone) px-(--space-chip-x) py-(--space-code-y) font-mono text-[0.85em] text-(--ink)',
        className,
      )}
      {...rest}
    >
      {children}
    </code>
  )
}

export default Code
