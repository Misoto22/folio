'use client'

import { Button, Tooltip, TooltipProvider } from '@misoto22/folio'
import { RiBold, RiDoubleQuotesL, RiItalic, RiLinkM, RiListUnordered } from '@remixicon/react'

const TOOLS = [
  { name: 'Bold', icon: RiBold },
  { name: 'Italic', icon: RiItalic },
  { name: 'Quote', icon: RiDoubleQuotesL },
  { name: 'Bulleted list', icon: RiListUnordered },
  { name: 'Link', icon: RiLinkM },
]

/**
 * One Provider around the whole toolbar, which is where it belongs: it holds
 * the shared 700ms open delay and the 300ms skip window, so moving along the
 * row opens the next tip immediately instead of flashing a separate one at
 * every button. Radix throws without a Provider, and a Provider per tooltip
 * throws away exactly that shared timing. Do not set delayDuration on a single
 * Tooltip to speed one up — it overrides the provider for that trigger alone,
 * and one instant tip beside neighbours at 700ms reads as lag rather than as
 * emphasis. Zero is worse still: the state becomes instant-open, and the fade
 * is keyed to delayed-open, so the tip appears with no transition at all.
 */
export function Example() {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 rounded-(--radius) border border-(--rule) p-1">
        {TOOLS.map((tool) => (
          <Tooltip key={tool.name} content={tool.name}>
            <Button iconOnly aria-label={tool.name} variant="ghost" size="sm">
              <tool.icon size={16} aria-hidden />
            </Button>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
