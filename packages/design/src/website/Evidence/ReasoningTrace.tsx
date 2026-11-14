'use client'

import { useId, useState, type HTMLAttributes, type ReactNode } from 'react'
import { ChevronRight } from '../../icons'
import { cn } from '../../lib/cn'
import { ActivityTrace, type ActivityTraceItem } from './Evidence'

export interface ReasoningTraceProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Names the list of steps for assistive tech. */
  label: string
  /** True while the work is still going: the title shimmers and the spinner turns. */
  running: boolean
  /** "Thinking" while running; a settled line such as "Thought for 1.5s" after. */
  title: ReactNode
  items: ActivityTraceItem[]
  /** A quiet figure after the title — the seconds while it runs, the step count after. */
  meta?: ReactNode
  /** The work ended without an answer: the mark crosses out and the steps stay shut. Outranks `running`. */
  failed?: boolean
}

/** The three marks, stacked and cross-faded in place: a turning ring, a check that draws itself, a cross. */
function ReasoningMark({ mark }: { mark: 'spin' | 'check' | 'fail' }) {
  return <span className="folio-reasoning__icon" data-mark={mark} aria-hidden="true">
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className="folio-reasoning__spin"><circle cx="8" cy="8" r="6" className="folio-reasoning__track" /><path d="M14 8a6 6 0 0 0-6-6" /></svg>
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="folio-reasoning__check"><path d="M3 8.5l3.2 3.2L13 5" /></svg>
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className="folio-reasoning__fail"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" /></svg>
  </span>
}

/**
 * One line that says the system is thinking, and what it did.
 *
 * It never swaps for a different component: its mark and its words change in
 * place. While it runs the title shimmers beside a turning ring and the steps
 * are open beneath it, so the reader watches the work arrive. When it finishes
 * the ring cross-fades into a check that draws itself, the line settles into a
 * duration, and the steps fold away — the answer is the point now — unless the
 * reader has opened or closed them, which always wins. A failure crosses the
 * mark out and keeps the steps shut. With no steps it is a plain status line,
 * not a control. Reduced motion stills the shimmer, the ring and the drawing.
 */
export function ReasoningTrace({ label, running, title, items, meta, failed, className, ...rest }: ReasoningTraceProps) {
  const [chosen, setChosen] = useState<boolean | null>(null)
  const stepsId = useId()
  const mark = failed ? 'fail' : running ? 'spin' : 'check'
  const line = <>
    <ReasoningMark mark={mark} />
    <span className="folio-reasoning__title" data-running={(running && !failed) || undefined}>{title}</span>
    {meta != null && <span className="folio-reasoning__meta">{meta}</span>}
  </>

  if (items.length === 0 || failed) {
    return <div role="status" aria-live="polite" className={cn('folio-reasoning', className)} data-mark={mark} {...rest}><span className="folio-reasoning__line">{line}</span></div>
  }

  const open = chosen ?? running
  return <div className={cn('folio-reasoning', className)} data-mark={mark} {...rest}>
    <div role={running ? 'status' : undefined} aria-live={running ? 'polite' : undefined}>
      <button type="button" className="folio-reasoning__line" aria-expanded={open} aria-controls={stepsId} onClick={() => setChosen(!open)}>
        {line}<ChevronRight size={14} aria-hidden className="folio-reasoning__chevron" />
      </button>
    </div>
    <div id={stepsId} className="folio-reasoning__fold" data-open={open} inert={!open}>
      <div><ActivityTrace label={label} items={items} className="folio-reasoning__steps" /></div>
    </div>
  </div>
}
