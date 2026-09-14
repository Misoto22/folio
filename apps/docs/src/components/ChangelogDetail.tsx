'use client'

import { useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@misoto22/folio'
import type { ReactNode } from 'react'

/**
 * The detail under one changelog headline, folded away until asked for.
 *
 * The entries in this repository carry their reasoning, which is the reason to
 * read them and the reason the page could not be scanned: a release ran to
 * two and a half thousand words, and the version a reader wanted to find was
 * eight screens down. Folding is the answer rather than cutting, because the
 * argument is the part worth keeping — a changelog that says only WHAT changed
 * is one every other library already has.
 *
 * The trigger counts what it hides. "Show 6 more" is a decision a reader can
 * make; "Detail" is one they have to make blind, and blind means opening every
 * one of them.
 *
 * `Collapsible` rather than a bare `<details>`: this is a design system, and a
 * site of its own that reaches past the package for a disclosure is the same
 * evidence of a gap that `CodeBlock` was. The cost is one client boundary
 * around the fold; the page around it stays server-rendered.
 */
export function ChangelogDetail({
  more,
  less,
  children,
}: {
  /** Trigger label while closed — already carries the count. */
  more: string
  /** Trigger label while open. */
  less: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="flex flex-col gap-2">
      <CollapsibleTrigger className="self-start mono-meta text-(--ink-3-aa) underline decoration-(--rule-2) underline-offset-4 transition-colors duration-(--duration-fast) hover:text-(--ink) hover:decoration-(--ink)">
        {open ? less : more}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-2">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}
