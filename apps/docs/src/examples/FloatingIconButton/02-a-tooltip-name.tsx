'use client'

import { FloatingIconButton, Tooltip, TooltipProvider } from '@misoto22/folio'
import { RiNodeTree } from '@remixicon/react'

/**
 * label is aria-label and nothing else: it names the control for a screen
 * reader and for nobody else, so a glyph that is not universal needs the word
 * on screen too. A Tooltip is how, with one caveat that matters here more than
 * anywhere — Radix returns early on a touch pointer, so the tip never opens on
 * a phone, which is exactly where a floating control is most often the only
 * affordance in view. The tip and the label are one string, so the two cannot
 * drift apart (WCAG 2.5.3).
 */
export function Example() {
  const name = 'On this page'

  return (
    <TooltipProvider>
      <div className="relative h-32 w-full overflow-hidden rounded-(--radius) border border-(--rule) [&>button]:absolute">
        <Tooltip content={name} side="top">
          <FloatingIconButton position="end" label={name}>
            <RiNodeTree size={16} aria-hidden />
          </FloatingIconButton>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
