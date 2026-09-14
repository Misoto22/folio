import { CodeBlock } from '@misoto22/folio'

const SOURCE = `import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}`

/**
 * The plain path: no highlighter, a title, a language label, numbered lines and
 * one banded line. The number lives inside its own line's row rather than in a
 * parallel gutter column — two columns sharing a line-height align right up
 * until one of them wraps. The copy button copies the code string, never the
 * rendered markup, and the strip is always there rather than appearing on
 * hover, which on a touch screen means never.
 */
export function Example() {
  return (
    <CodeBlock
      title="cn.ts"
      lang="ts"
      lineNumbers
      highlightLines={[5]}
      maxHeight="18rem"
      code={SOURCE}
    />
  )
}
