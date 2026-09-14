'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { warn } from './warn'

/** How long a copy control confirms before it returns to its resting label. */
export const COPIED_RESET_MS = 1600

export interface ClipboardCopy {
  /** True from an accepted write until the confirmation window closes. */
  copied: boolean
  /**
   * Writes the text and resolves `true` only once the browser accepted it.
   *
   * A function is read at activation rather than at render, for a host that
   * owns the rendered code; if it throws, that counts as a failed copy.
   */
  copy: (source: string | (() => string)) => Promise<boolean>
}

/**
 * The copy state every copy control in the package shares: CodeBlock's strip
 * button and the website ClipboardButton.
 *
 * Internal on purpose. It is not a public export, because the public contract
 * is the controls that use it, not a clipboard helper.
 *
 * A rejected write is handled, not swallowed: clipboard access is denied in an
 * insecure context and inside some embeds, and the only honest reaction the
 * control has is to stop claiming success. So a failure clears any confirmation
 * still showing from an earlier copy, resolves `false` for the caller, and says
 * why in development. The snippet stays selectable by hand, so there is nothing
 * further to recover, and an unhandled rejection would take the page with it.
 */
export function useClipboardCopy(component: string): ClipboardCopy {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = useCallback(
    async (source: string | (() => string)) => {
      clearTimeout(timer.current)
      try {
        await navigator.clipboard.writeText(typeof source === 'function' ? source() : source)
      } catch (error) {
        setCopied(false)
        warn({
          code: 'CLIPBOARD_WRITE_REJECTED',
          problem: `The browser refused the clipboard write (${error instanceof Error ? error.message : String(error)}), so ${component} kept its copy label instead of confirming.`,
          field: `${component}.copy`,
          fix: 'Serve the page from a secure context (HTTPS or localhost) and allow clipboard-write in any embedding iframe.',
          component,
        })
        return false
      }
      setCopied(true)
      // Restarted on every accepted write, so a second copy gets its own full
      // confirmation window rather than the remainder of the first.
      timer.current = setTimeout(() => setCopied(false), COPIED_RESET_MS)
      return true
    },
    [component],
  )

  return { copied, copy }
}
