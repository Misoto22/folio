import { CodeBlock } from '@misoto22/folio'

/**
 * The smallest useful block: one line, a language, and the copy button. The
 * strip is not a hover affordance and never has been — a control that appears
 * on hover does not exist on a touch screen, which is exactly where a reader is
 * least able to select a wrapped command by hand. What it copies is the code
 * string, so nothing about the rendering can end up on the clipboard.
 *
 * label rather than title, because the block stays bare: the name is for
 * the scroll region, not for a header strip. Two blocks side by side both fall
 * back to "Code" without it, and two regions sharing one name are two landmarks
 * a reader cannot tell apart.
 */
export function Example() {
  return (
    <div className="flex w-full flex-col gap-3">
      <CodeBlock code="pnpm add @misoto22/folio" lang="bash" label="Install command" />
      <CodeBlock code="pnpm --filter @misoto22/folio build" lang="bash" label="Build command" />
    </div>
  )
}
