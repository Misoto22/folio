import type { HTMLAttributes, ReactNode, TableHTMLAttributes } from 'react'
import { Tag } from '../../components/Tag/Tag'
import { cn } from '../../lib/cn'
import { STEP_RAIL_LIST_CLASS, StepRailItem } from '../../lib/step-rail'

export interface SequenceStep {
  n: string
  label: string
  note?: string
  anchor?: boolean
  tags?: string[]
}

export interface StepSequenceSpec {
  steps: SequenceStep[]
  caption?: string
  label?: string
}

export interface StepSequenceProps extends HTMLAttributes<HTMLElement> {
  spec: StepSequenceSpec
}

/** A process rail whose source order, counters and annotations belong to the host. */
export function StepSequence({ spec, className, ...rest }: StepSequenceProps) {
  return (
    <figure className={cn('m22-step-sequence', className)} role="group" aria-label={spec.label ?? spec.caption} {...rest}>
      {/* The core rail, carried as ARIA roles rather than <ol>/<li>: inside
          article prose a real list takes the article's indent and item spacing.
          The anchor is filled but not announced as `aria-current` \u2014 hosts use it
          for emphasis (a terminal step, a preflight), not for progress. */}
      <div role="list" className={STEP_RAIL_LIST_CLASS}>
        {spec.steps.map((step, index) => (
          <StepRailItem
            as="div"
            role="listitem"
            key={step.n}
            data-anchor={step.anchor || undefined}
            className="m22-sequence-step"
            filled={step.anchor}
            last={index === spec.steps.length - 1}
            marker={step.n}
            markerClassName="m22-sequence-counter"
            title={step.label}
            note={step.note ?? '\u00a0'}
          >
            {step.tags && step.tags.length > 0 && <span className="m22-sequence-tags">{step.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</span>}
          </StepRailItem>
        ))}
      </div>
      {spec.caption && <div className="m22-sequence-caption">{spec.caption}</div>}
    </figure>
  )
}

export type ContentTableProps = TableHTMLAttributes<HTMLTableElement>

/** Keeps a rendered article table intact inside a keyboard-scrollable region. */
export function ContentTable({ children, ...props }: ContentTableProps) {
  return <div className="m22-content-table" tabIndex={0}><table {...props}>{children}</table></div>
}

export interface ExternalLinkMarkProps {
  children?: ReactNode
}

export function ExternalLinkMark({ children = '↗' }: ExternalLinkMarkProps) {
  return <span className="m22-external-link-mark" aria-hidden="true">{children}</span>
}
