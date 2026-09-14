'use client'

import { Button, Tooltip, TooltipProvider } from '@misoto22/folio'
import { RiCheckLine, RiFileCopyLine, RiShareLine } from '@remixicon/react'
import { useEffect, useState } from 'react'

/**
 * A tip on a control that carries a glyph and no word. The tip text, the icon
 * and the button's own accessible name all change together, because a copy
 * control that looks identical before and after leaves the reader clicking it
 * twice to be sure. Match the tip to the aria-label word for word: two
 * different names for one control is the label-in-name failure (WCAG 2.5.3),
 * and a voice-control user says the words they can see. The tip is not the
 * name, either — Radix returns early on a touch pointer, so on a phone it never
 * opens at all and an icon button without its own aria-label is unnamed.
 */
export function Example() {
  const [copied, setCopied] = useState(false)
  const label = copied ? 'Copied' : 'Copy to clipboard'

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  return (
    <TooltipProvider>
      <div className="flex items-center gap-3">
        {/* One string for the tip and the name, so the two cannot drift apart
            — and both change with the icon, because a copy control that looks
            identical before and after leaves the reader clicking it twice. */}
        <Tooltip content={label}>
          <Button iconOnly aria-label={label} variant="secondary" onClick={() => setCopied(true)}>
            {copied ? (
              <RiCheckLine size={16} className="text-(--ok)" aria-hidden />
            ) : (
              <RiFileCopyLine size={16} aria-hidden />
            )}
          </Button>
        </Tooltip>

        <Tooltip content="Share this frame" side="bottom">
          <Button iconOnly aria-label="Share this frame" variant="secondary">
            <RiShareLine size={16} aria-hidden />
          </Button>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
