'use client'

import type { ReactNode } from 'react'
import { X } from '../../icons'
import { cn } from '../../lib/cn'

/** One fact about the selected thing: a short label and its value. */
export interface InspectorFact {
  label: string
  value: ReactNode
  /** Sets the value in mono — an id, a path, a version, a port. */
  mono?: boolean
}

/** A relationship the selected thing takes part in. */
export interface InspectorLink {
  id?: string
  /** Which way it runs, relative to the selected node. */
  direction: 'in' | 'out'
  label: string
  /** What sits at the other end. */
  peer: string
  onSelect?: () => void
}

export interface DiagramInspectorProps {
  /** The kicker over the title — what KIND of thing this panel is showing. */
  eyebrow?: string
  title: string
  description?: ReactNode
  facts?: InspectorFact[]
  links?: InspectorLink[]
  /** Buttons under the facts — copy a link, open the source. */
  actions?: ReactNode
  onClose?: () => void
  className?: string
  /** Renders as a floating panel over the surface rather than in the flow. */
  floating?: boolean
}

/**
 * What the reader just picked, written out.
 *
 * A diagram can hold about eight words per node before it stops being a diagram
 * and starts being a document with lines drawn on it. Everything past those
 * eight — the port, the owning team, the file it was read out of, the six
 * relationships it takes part in — belongs beside the picture rather than
 * inside it, and this is that place.
 *
 * NOT A DIALOG, and that is deliberate. An inspector is a REGION that changes
 * with the selection, not a modal. Giving it `role="dialog"` would trap focus
 * and demand dismissal for something the reader never opened — they clicked a
 * node, and the panel followed. So it is a labelled region with
 * `aria-live="polite"`, which is what makes a screen reader announce the new
 * selection without stealing the cursor from whatever the reader was doing.
 *
 * The relationships are real buttons when they carry `onSelect`, which is how
 * the diagram becomes navigable from the keyboard: a reader can walk the graph
 * peer by peer without ever touching the picture.
 *
 * @example
 * <DiagramInspector
 *   eyebrow="Service"
 *   title="API Server"
 *   description="FastAPI, behind the load balancer."
 *   facts={[
 *     { label: 'Port', value: '8000', mono: true },
 *     { label: 'Id', value: 'api', mono: true },
 *   ]}
 *   links={[{ direction: 'out', label: 'SQL', peer: 'PostgreSQL' }]}
 *   onClose={() => setSelected(null)}
 * />
 */
export function DiagramInspector({
  eyebrow,
  title,
  description,
  facts = [],
  links = [],
  actions,
  onClose,
  className,
  floating,
}: DiagramInspectorProps) {
  return (
    <section
      aria-label={`${title} details`}
      aria-live="polite"
      className={cn(
        'flex flex-col gap-3 rounded-(--radius-lg) border border-(--rule-2) bg-(--panel-bg) p-4',
        floating && 'absolute bottom-3 start-3 z-(--z-sticky) w-72 max-w-[calc(100%-1.5rem)]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          {eyebrow && <span className="eyebrow text-(--ink-3-aa)">{eyebrow}</span>}
          <h3 className="m-0 font-sans text-[15px] leading-tight font-normal text-(--ink)">
            {title}
          </h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Clear the selection"
            className="-me-1 -mt-1 flex size-7 shrink-0 items-center justify-center rounded-(--radius-xs) text-(--ink-3-aa) transition-colors duration-(--duration-fast) hover:bg-(--stone) hover:text-(--ink) focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--ring)"
          >
            <X size={14} aria-hidden />
          </button>
        )}
      </div>

      {description && (
        <p className="m-0 text-[13px] leading-[1.55] text-(--ink-2)">{description}</p>
      )}

      {facts.length > 0 && (
        // A definition list, because that is what this is: each row is a term
        // and its value, and a grid of divs tells a screen reader nothing about
        // which value belongs to which label.
        <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
          {/* Keyed by position, not by the label: two rows named "Source" is a
              specification a caller is entitled to write — a node read out of
              two files — and keying by the label made the second one collide
              with the first rather than appear under it. */}
          {facts.map((fact, index) => (
            <div key={index} className="contents">
              <dt className="mono-meta text-(--ink-3-aa)">{fact.label}</dt>
              <dd
                className={cn(
                  'm-0 min-w-0 break-words text-[13px] leading-snug text-(--ink)',
                  fact.mono && 'font-mono text-[12px]',
                )}
              >
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {links.length > 0 && (
        <div className="flex flex-col gap-1 border-t border-(--rule) pt-3">
          <span className="eyebrow text-(--ink-3-aa)">Relationships</span>
          <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
            {links.map((link, index) => {
              const body = (
                <>
                  {/* The arrow is hidden from assistive tech and the direction
                      spelled out instead: a screen reader reading "→" aloud is
                      either silence or the word "arrow", and neither says which
                      way the relationship runs. */}
                  <span aria-hidden className="font-mono text-[12px] text-(--ink-3-aa)">
                    {link.direction === 'out' ? '→' : '←'}
                  </span>
                  <span className="sr-only">
                    {link.direction === 'out' ? 'to' : 'from'}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[13px] text-(--ink)">
                    {link.peer}
                  </span>
                  {link.label && (
                    <span className="mono-meta shrink-0 text-(--ink-3-aa)">{link.label}</span>
                  )}
                </>
              )

              const row = 'flex w-full items-baseline gap-2 rounded-(--radius-xs) px-1 py-1 text-start'

              return (
                <li key={link.id ?? index}>
                  {link.onSelect ? (
                    <button
                      type="button"
                      onClick={link.onSelect}
                      className={cn(
                        row,
                        'transition-colors duration-(--duration-fast) hover:bg-(--stone) focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--ring)',
                      )}
                    >
                      {body}
                    </button>
                  ) : (
                    <span className={row}>{body}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {actions && <div className="flex flex-wrap items-center gap-2 pt-1">{actions}</div>}
    </section>
  )
}

export default DiagramInspector
