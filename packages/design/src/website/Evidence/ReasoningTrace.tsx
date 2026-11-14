'use client'

import { RiArrowRightSLine, RiCheckLine } from '@remixicon/react'
import { useState, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/Collapsible/Collapsible'
import { Spinner } from '../../components/Spinner/Spinner'
import { ActivityTrace, type ActivityTraceItem } from './Evidence'

export interface ReasoningTraceProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Names the list of steps for assistive tech. */
  label: string
  /** True while the work is still going: the title shimmers and the spinner turns. */
  running: boolean
  /** "Thinking" while running; a settled line such as "Thought for 1.5s" after. */
  title: ReactNode
  items: ActivityTraceItem[]
}

/**
 * One line that says the system is thinking, and what it did.
 *
 * While it runs the line shimmers beside a turning spinner and its steps are
 * open beneath it, so the reader watches the work arrive. When it finishes,
 * the line settles into a check and a duration and the steps fold away — the
 * answer is the point now — unless the reader has opened or closed them
 * themselves, which always wins. With no steps yet it is a plain status line,
 * not a control. Reduced motion stills the shimmer and the spinner.
 */
export function ReasoningTrace({ label, running, title, items, className, ...rest }: ReasoningTraceProps) {
  const [chosen, setChosen] = useState<boolean | null>(null)
  const line = <>
    <span className="folio-reasoning__icon" aria-hidden="true">{running ? <Spinner size="sm" label={null} /> : <RiCheckLine size={14} />}</span>
    <span className="folio-reasoning__title" data-running={running || undefined}>{title}</span>
  </>

  if (items.length === 0) {
    return <div role="status" aria-live="polite" className={cn('folio-reasoning', className)} {...rest}><span className="folio-reasoning__line">{line}</span></div>
  }

  return <Collapsible open={chosen ?? running} onOpenChange={setChosen} className={cn('folio-reasoning', className)} {...rest}>
    <div role={running ? 'status' : undefined} aria-live={running ? 'polite' : undefined}>
      <CollapsibleTrigger asChild>
        <button type="button" className="folio-reasoning__line">{line}<RiArrowRightSLine size={14} aria-hidden className="folio-reasoning__chevron" /></button>
      </CollapsibleTrigger>
    </div>
    <CollapsibleContent><ActivityTrace label={label} items={items} className="folio-reasoning__steps" /></CollapsibleContent>
  </Collapsible>
}
