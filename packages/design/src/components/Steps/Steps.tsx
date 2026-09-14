import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { STEP_RAIL_LIST_CLASS, StepRailItem } from '../../lib/step-rail'

export interface Step {
  /** Stable key; also what a caller keys its own data by. */
  id?: string
  /** The step's name — a noun, not a sentence. */
  title: string
  /** The quiet line under it: what it is made of, what it costs, what it uses. */
  note?: ReactNode
  /**
   * The step being described, filled rather than outlined.
   *
   * At most one. It marks where the sequence has GOT to, which is a fact about
   * the process rather than a highlight — two filled markers say the reader is
   * in two places at once.
   */
  current?: boolean
}

export interface StepsProps extends Omit<HTMLAttributes<HTMLOListElement>, 'children'> {
  steps: Step[]
  /** Names the sequence for assistive tech when no heading does. */
  label?: string
  /**
   * How the marker is drawn.
   *
   * `number` counts from one and is right for a pipeline, a recipe, a
   * migration. `rule` drops the digit for a plain hairline node, which is what
   * a sequence of states wants — "queued, running, done" is an order, not a
   * numbered list.
   */
  marker?: 'number' | 'rule'
}

/**
 * A numbered sequence, as a rail.
 *
 * The shape a pipeline actually has: one thing after another, each with a name
 * and a line of detail, and a rule running through them so the eye reads them
 * as one process rather than as five unrelated rows. It is the figure a
 * technical post reaches for most often after a diagram, and it is NOT a
 * diagram — nothing branches, nothing points at anything, and drawing it with
 * boxes and arrows says otherwise.
 *
 * The connector is drawn on the ITEM rather than as a full-height line behind
 * the markers, so it starts under one and stops above the next instead of
 * running through both — and so the last step has no tail hanging off it. That
 * is the detail that separates a rail from a list with a border on it.
 *
 * An `<ol>`, because the order is the content. `aria-current="step"` marks the
 * filled one, which is the only thing here a screen reader could not otherwise
 * infer from the order it is read in.
 *
 * @example
 * <Steps
 *   label="How an answer is built"
 *   steps={[
 *     { title: 'Corpus', note: 'Blog MDX · project database' },
 *     { title: 'Chunking', note: 'By heading · 300–800 tokens' },
 *     { title: 'Answer', note: 'Live citation panel', current: true },
 *   ]}
 * />
 */
export function Steps({ steps, label, marker = 'number', className, ...rest }: StepsProps) {
  if (steps.length === 0) return null

  return (
    <ol aria-label={label} className={cn(STEP_RAIL_LIST_CLASS, className)} {...rest}>
      {steps.map((step, index) => (
        <StepRailItem
          key={step.id ?? `${step.title}-${index}`}
          aria-current={step.current ? 'step' : undefined}
          filled={step.current}
          last={index === steps.length - 1}
          marker={marker === 'number' ? index + 1 : ''}
          markerClassName={marker === 'rule' ? 'text-[0px]' : undefined}
          title={step.title}
          note={step.note}
        />
      ))}
    </ol>
  )
}

export default Steps
