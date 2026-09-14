'use client'

import { Accordion, AccordionItem } from '@misoto22/folio'

/**
 * An FAQ: type single with collapsible, so the row the reader opened can be
 * closed again. Without collapsible there is no empty value to return to, and
 * the first row they open is a row they can never close. The marker is a plus
 * rather than a chevron, deliberately — a plus says this opens, a chevron says
 * there is more below, and in a stack of rows that decides whether the reader
 * expects expansion or navigation. Key each row by something stable rather than
 * by its position: Radix tracks the open one by value, so filtering or
 * re-ordering the list leaves whatever now sits in that slot standing open.
 */
export function Example() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="install" title="How do I install it?">
        <code className="font-mono text-xs">pnpm add @misoto22/folio</code>, then import the stylesheet once
        at your app root.
      </AccordionItem>
      <AccordionItem value="tailwind" title="Do I need Tailwind?">
        No. The compiled stylesheet is self-contained. If you already compile Tailwind, import the token
        layers instead and skip the second copy of the utilities.
      </AccordionItem>
      <AccordionItem value="router" title="Which router does it assume?">
        None. Components that navigate take <code className="font-mono text-xs">asChild</code>, so you hand
        them your own Link.
      </AccordionItem>
    </Accordion>
  )
}
