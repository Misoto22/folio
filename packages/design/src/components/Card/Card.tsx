import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { SURFACE_FEATURE } from '../../lib/surface'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * `outline` is a hairline box on the page ground — the default, and correct
   * for a card sitting among other cards. `plate` fills with the one reversed
   * surface and is for a card that IS the point of its band; use at most one
   * per screen. `flat` drops the border entirely, for a card whose grid already
   * draws the rules between cells.
   */
  variant?: 'outline' | 'plate' | 'flat'
}

const VARIANT = {
  outline: 'border border-(--rule) bg-(--paper)',
  plate:
    `border border-(--feature-surface) ${SURFACE_FEATURE} [--card-title:var(--on-feature)]`,
  flat: 'border border-transparent bg-transparent',
} as const

/**
 * A bounded surface.
 *
 * No shadow, by law: depth in this system is a hairline and a change of ground,
 * never a blur. A card that needs to read as raised is a `plate`, which
 * separates by reversal instead.
 *
 * It clips to its own corner. A card that rounds and does not clip lays a
 * full-bleed image's square corners over its round ones at all four corners,
 * and the same goes for a filled first child — a defect that is invisible until
 * the first card with an image at the top of it. Pass `overflow-visible` for
 * the rarer card that deliberately overhangs.
 *
 * Compose with the named sub-parts, or drop children straight in when the card
 * has no header or footer to speak of.
 *
 * @example
 * <Card>
 *   <CardHeader><CardTitle>Recent deploys</CardTitle><Badge>12</Badge></CardHeader>
 *   <CardBody>…</CardBody>
 *   <CardFooter>Updated just now</CardFooter>
 * </Card>
 */
export function Card({ variant = 'outline', className, children, ...rest }: CardProps) {
  return (
    <div className={cn('overflow-hidden rounded-(--radius-lg)', VARIANT[variant], className)} {...rest}>
      {children}
    </div>
  )
}

/** Header row — title on the left, an action or marker on the right. */
export function CardHeader({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 border-b border-(--rule) px-5 py-4',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * The card's title, in the editorial serif.
 *
 * An `<h3>` by default, which is right inside a section with its own `<h2>` and
 * wrong nearly everywhere else — pass `as` rather than leaving a page with a
 * heading order that jumps.
 */
export function CardTitle({
  as: Comp = 'h3',
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLHeadingElement> & { as?: 'h2' | 'h3' | 'h4' }) {
  return (
    <Comp
      // Reads the card's own title colour rather than --ink directly. A plate
      // is a reversed surface, and a hardcoded ink title on it came out at
      // 1.25:1 — invisible, and invisible only on the one variant whose whole
      // job is to be different.
      className={cn(
        'm-0 font-heading text-[length:var(--fs-item)] font-normal text-[var(--card-title,var(--ink))]',
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  )
}

/** The content well. */
export function CardBody({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5 text-sm leading-relaxed text-(--ink-2)', className)} {...rest}>
      {children}
    </div>
  )
}

/** A quiet strip for metadata or secondary actions. */
export function CardFooter({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('border-t border-(--rule) px-5 py-4 mono-meta text-(--ink-3-aa)', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

export default Card
