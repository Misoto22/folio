'use client'

import * as Design from '@misoto22/folio'
import { cn } from '@misoto22/folio'
import * as Icons from '@remixicon/react'
import { useEffect, useRef, useState } from 'react'
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live'

/**
 * Everything a snippet can reach without importing it.
 *
 * The whole package plus Remix Icon and React's own hooks — which is the set the
 * examples on this site already use, so a reader who edits one and reaches for
 * a neighbouring component finds it there rather than hitting "X is not
 * defined". The import lines are stripped before evaluation for the same
 * reason: a snippet that has to be import-complete to run is a snippet nobody
 * edits.
 *
 * The package spreads LAST. Remix Icon prefixes every export with `Ri`, so
 * nothing it ships can collide with a component name — but lucide shipped
 * `Badge`, `Table`, `Command` and `Dialog`, and a reader who edited the Badge
 * example and typed `<Badge>` got a small grey outline with no error to explain
 * it. The playground belongs to the package, so the package still wins.
 */
const SCOPE = { ...Icons, ...Design }

export interface PlaygroundProps {
  /** The snippet, exactly as the code block shows it. */
  code: string
  className?: string
}

/**
 * Strips what react-live cannot evaluate and leaves what the reader is meant
 * to change.
 *
 * The imports go because the scope already provides them, and the `'use client'`
 * banner goes because there is no server here — both are noise in an editor
 * whose whole point is that the JSX is one keystroke from being different.
 */
function toEditable(code: string): string {
  return code
    .replace(/^'use client'\n+/, '')
    .replace(/^import[^\n]*\n/gm, '')
    .trim()
}

/**
 * The code, editable, rendering as you type.
 *
 * This is the difference between documentation you read and documentation you
 * use. A prop table tells you `variant` accepts four values; an editor lets you
 * find out what `variant="ghost"` looks like beside a `danger` in your own
 * arrangement, which is the question someone actually has.
 *
 * Mounted only when the reader asks for it. react-live carries a transpiler,
 * and every visitor should not download one to look at a button.
 */
export function Playground({ code, className }: PlaygroundProps) {
  const [source, setSource] = useState(() => toEditable(code))
  const editorRef = useRef<HTMLDivElement>(null)

  // Reset when the surrounding example changes, so switching examples does not
  // leave someone else's edit in the box.
  useEffect(() => setSource(toEditable(code)), [code])

  useEffect(() => {
    // react-live renders a bare `<pre contenteditable="plaintext-only">` and
    // forwards neither a role nor a label to it, so a screen reader meets an
    // editable region with no name and no announced type. The library gives no
    // prop for this, so the attributes are set on the node it produced — which
    // is worth doing rather than shipping an unnamed text field, and worth a
    // comment rather than looking like a mistake.
    const editor = editorRef.current?.querySelector('pre[contenteditable]')
    if (!editor) return
    editor.setAttribute('role', 'textbox')
    editor.setAttribute('aria-multiline', 'true')
    editor.setAttribute('aria-label', 'Editable example source')
  }, [])

  return (
    <LiveProvider code={source} scope={SCOPE} noInline={false}>
      <div className={cn('flex flex-col', className)}>
        {/* Named, because the editor below shows the same words: without a
            handle there is no way to ask whether the RENDERED half followed. */}
        <div
          data-playground-preview
          className="flex min-h-32 items-center justify-center border-b border-(--rule) p-8"
        >
          <LivePreview />
        </div>
        <div ref={editorRef}>
          <LiveEditor
            onChange={setSource}
            // The font and colours are ours, so the editor matches the
            // read-only blocks beside it rather than arriving in the library's
            // own theme.
            className="!bg-(--paper-2) !font-mono !text-[12.5px] !leading-[1.75]"
          />
        </div>
        {/* A live region, so the message is announced when the code stops
            compiling rather than only appearing. `polite`: the reader is
            mid-keystroke, and interrupting them to say the half-typed line does
            not parse yet would be worse than useless. */}
        <div role="status" aria-live="polite" aria-label="Example errors">
          <LiveError className="m-0 border-t border-(--danger) bg-(--danger-soft) px-4 py-3 font-mono text-xs text-(--danger)" />
        </div>
      </div>
    </LiveProvider>
  )
}

export default Playground
