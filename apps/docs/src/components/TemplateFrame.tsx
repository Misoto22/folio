'use client'

import { ToggleGroup, ToggleGroupItem } from '@misoto22/design'
import { RiComputerLine, RiSmartphoneLine, RiTabletLine } from '@remixicon/react'
import { useState } from 'react'
import { TEMPLATE_COMPONENTS } from '@/generated/template-registry'

const WIDTHS = {
  mobile: { label: 'Mobile', width: 390, icon: RiSmartphoneLine },
  tablet: { label: 'Tablet', width: 768, icon: RiTabletLine },
  desktop: { label: 'Desktop', width: 0, icon: RiComputerLine },
} as const

type Size = keyof typeof WIDTHS

export interface TemplateFrameProps {
  templateId: string
  name: string
}

/**
 * A template at a chosen width.
 *
 * Rendered inline rather than in an iframe, so it inherits the reader's own
 * theme, accent and density — the whole point being that these screens are made
 * of the same tokens as the page around them, and an iframe would quietly prove
 * the opposite by needing its own copy of everything.
 *
 * The width is set with `max-width` on a centred wrapper rather than by resizing
 * anything, and that wrapper is the query container: the templates are written
 * with `@2xl:` / `@3xl:` / `@5xl:` rather than `sm:` / `md:` / `lg:`, so they
 * answer the frame's width.
 *
 * They used to use the viewport breakpoints, which never changed — picking
 * "Mobile" on a desktop left a two-column dashboard crushed into 390px.
 */
export function TemplateFrame({ templateId, name }: TemplateFrameProps) {
  const [size, setSize] = useState<Size>('desktop')
  const Template = TEMPLATE_COMPONENTS[templateId]

  if (!Template) {
    return (
      <p className="m-0 rounded-(--radius) border border-(--danger) p-4 text-sm text-(--danger)">
        No template is registered for <code className="font-mono text-xs">{templateId}</code>.
      </p>
    )
  }

  return (
    // A whole page rendered inside a frame: its headings belong to the template
    // being shown, not to the documentation page showing it.
    <div data-toc-skip="" className="overflow-hidden rounded-(--radius-frame) border border-(--rule)">
      {/* The system's own segmented control rather than three ghost buttons.
          They collapse to icons on a phone, where "which one is on" was a
          change of ink colour between three near-identical glyphs; the strip
          moves a filled pill instead. */}
      <div className="flex justify-end border-b border-(--rule) bg-(--paper-2) px-2 py-1.5">
        <ToggleGroup
          type="single"
          value={size}
          aria-label={`${name} width`}
          onValueChange={(next) => setSize((next as Size) || 'desktop')}
        >
          {(Object.keys(WIDTHS) as Size[]).map((key) => {
            const option = WIDTHS[key]
            const Icon = option.icon
            return (
              <ToggleGroupItem key={key} value={key} aria-label={option.label} className="gap-2">
                <Icon size={14} aria-hidden />
                <span className="max-sm:sr-only">{option.label}</span>
              </ToggleGroupItem>
            )
          })}
        </ToggleGroup>
      </div>

      <div className="bg-(--paper-2) p-4">
        <div
          // A named region, so the preview is one thing a reader can skip past
          // rather than an unannounced pile of controls in the middle of a
          // documentation page.
          role="region"
          aria-label={`${name} preview`}
          // `contain-layout` so anything `fixed` in a template pins to this
          // frame rather than to the window and the masthead above it. Being a
          // query container does not do that: `container-type` applies size and
          // style containment, not layout.
          className="@container mx-auto overflow-hidden contain-layout rounded-(--radius-lg) border border-(--rule) bg-(--paper) transition-[max-width] duration-(--duration-slow) ease-(--ease-out-expo)"
          style={{ maxWidth: WIDTHS[size].width || undefined }}
        >
          {/* Inside the container, not on it: a container query unit resolves
              against an ancestor container, so the element that re-bases the
              fluid ramp cannot be the one declaring the container. */}
          <div data-fluid-frame className="[--fluid:1cqi]">
            <Template />
          </div>
        </div>
      </div>
    </div>
  )
}
