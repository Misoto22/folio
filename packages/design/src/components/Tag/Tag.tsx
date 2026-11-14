import { X as XIcon } from '../../icons'
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface TagBase extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  children: ReactNode
  /**
   * Renders the pressed/selected look, and declares the chip a toggle.
   *
   * An interactive chip reads `aria-pressed` off this same value, so the accent
   * fill and the state a screen reader hears cannot drift apart. Leave it off
   * for a chip whose `onClick` navigates or opens something: a control that is
   * neither pressed nor unpressed is better announced as neither than as
   * "not pressed".
   */
  active?: boolean
  /**
   * Makes the chip ITSELF the filter control.
   *
   * This prop exists because the alternative did not survive contact with
   * `onRemove`. The advice used to be to wrap the tag in a button at the call
   * site, which is fine on its own and invalid the moment the chip is also
   * removable: the remove control is a real `<button>`, so the wrapper puts a
   * button inside a button — markup the parser splits into siblings, leaving a
   * DOM neither the author nor the accessibility tree expects.
   *
   * With this the wrapper is never written. The chip carries the click, the
   * focus ring and the pressed state on the element that draws them, and a
   * removable filter chip renders its two controls side by side instead of one
   * inside the other.
   */
  onClick?: () => void
}

/**
 * The removable form: a chip for one thing the reader has already chosen.
 *
 * `removeLabel` is required alongside `onRemove` and not optional with a
 * default, because "Remove" repeated down a row of filters is eight controls a
 * screen reader cannot tell apart. Write the subject into it — "Remove
 * TypeScript filter".
 */
interface TagRemovable {
  /** Called when the reader dismisses the chip. */
  onRemove: () => void
  /** The remove button's accessible name. Name the subject, not the action. */
  removeLabel: string
}

interface TagStatic {
  onRemove?: never
  removeLabel?: never
}

export type TagProps = TagBase & (TagRemovable | TagStatic)

/**
 * A subject label — a topic, a technology, a filter facet — that can filter
 * with `onClick` and be dismissed with `onRemove`.
 *
 * Distinct from `Badge`, which carries a state or a count. A tag names what
 * something is ABOUT, so several sit together in a row and the reader scans
 * them; a badge is one fact about one record.
 *
 * This is where a `Token` component would have gone. It was not built: a token
 * is a tag with a remove button, and the difference between the two is one
 * prop, not one component. The system already ships three things that look
 * alike — `Badge`, `Tag`, `StatusPill` — and a fourth whose whole distinction
 * is an X on the end would be the one a call site picks by coin toss.
 *
 * Presentational until it is given a handler, and the component owns both
 * interactive cases rather than leaving one to a wrapper at the call site.
 * That is not a convenience: a wrapping `<button>` around a chip that already
 * holds the remove `<button>` is a button inside a button, which no parser
 * keeps and no accessibility tree reports the way it was written. Given both,
 * the chip renders the label and the X as SIBLING buttons — the label takes
 * the leading padding with it, so it is the whole of the chip up to the X
 * rather than the words with dead padding around them.
 *
 * @example
 * <Tag>TypeScript</Tag>
 * @example
 * <Tag active={on} onClick={toggle}>Rust</Tag>
 * @example
 * <Tag onRemove={() => drop('rust')} removeLabel="Remove Rust filter">Rust</Tag>
 * @example
 * // Both: a filter the reader can toggle and also take out of the row.
 * <Tag active={on} onClick={toggle} onRemove={drop} removeLabel="Remove Rust filter">Rust</Tag>
 */
export function Tag({ children, active, onClick, onRemove, removeLabel, className, ...rest }: TagProps) {
  // Two controls cannot nest, so a chip that is both a filter and a selection
  // splits its label out into a button of its own beside the remove button.
  const split = Boolean(onClick && onRemove)

  const chip = cn(
    'inline-flex items-center rounded-(--radius-sm) font-(family-name:--label-font) text-xs tracking-[calc(0.025em*var(--label-tracking-scale))] transition-colors duration-(--duration-fast)',
    active ? 'bg-(--action) text-(--action-foreground)' : 'bg-(--stone) text-(--ink-3-aa)',
    onRemove ? 'gap-1 pe-1.5' : 'pe-2.5',
    // Handed to the label button in the split form, so the padding is part of
    // the target rather than a ring of dead space around it.
    !split && 'py-1 ps-2.5',
    className,
  )

  const remove = onRemove ? (
    <button
      type="button"
      onClick={onRemove}
      aria-label={removeLabel}
      className={cn(
        // The drawn box is 16px, which is under the 24px minimum a pointer
        // target has to clear (WCAG 2.5.8). The inset pseudo-element takes
        // the hit area out to 24 without changing what is drawn or pushing
        // the chips apart — the 44px floor is for a standalone control, and
        // a chip is 24 tall to begin with.
        'relative inline-flex size-4 shrink-0 items-center justify-center rounded-(--radius-xs)',
        "before:absolute before:inset-[-4px] before:content-['']",
        'opacity-60 transition-opacity duration-(--duration-fast) hover:opacity-100 focus-visible:opacity-100',
      )}
    >
      <XIcon size={12} aria-hidden />
    </button>
  ) : null

  if (split) {
    return (
      <span className={chip} {...rest}>
        <button
          type="button"
          onClick={onClick}
          aria-pressed={active}
          className="rounded-(--radius-sm) py-1 ps-2.5 font-(family-name:--label-font) text-xs tracking-[calc(0.025em*var(--label-tracking-scale))]"
        >
          {children}
        </button>
        {remove}
      </span>
    )
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-pressed={active} className={chip} {...rest}>
        {children}
      </button>
    )
  }

  return (
    <span className={chip} {...rest}>
      {children}
      {remove}
    </span>
  )
}

export default Tag
