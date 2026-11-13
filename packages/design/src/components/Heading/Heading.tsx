import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

/**
 * A step on the type ladder, named for the thing it heads.
 *
 * `title` is the top and there is nothing above it — a page has exactly one
 * thing larger than its own records. `label` is not on the size ladder at all:
 * it is the mono kicker, which is what a fifth-level heading should look like,
 * because a serif heading three steps down is indistinguishable from bold body
 * copy.
 */
export type HeadingSize = 'title' | 'lead' | 'heading' | 'sub' | 'item' | 'label'

const SIZE: Record<HeadingSize, string> = {
  title: 'text-[length:var(--fs-title)] leading-[1.1] tracking-[-0.02em]',
  lead: 'text-[length:var(--fs-lead)] leading-[1.15] tracking-[-0.015em]',
  heading: 'text-[length:var(--fs-heading)] leading-[1.2]',
  sub: 'text-[length:var(--fs-sub)] leading-[1.25]',
  item: 'text-[length:var(--fs-item)] leading-[1.3]',
  // Spelled out rather than reaching for the `eyebrow` utility: it and
  // `font-heading` both set font-family, and a custom utility is invisible to
  // tailwind-merge — so the two would land in the same cascade layer at the
  // same specificity and source order would pick the winner.
  label: 'font-(family-name:--label-font) text-[11px] [text-transform:var(--label-case)] leading-[1.6] tracking-[calc(0.2em*var(--label-tracking-scale))] text-(--ink-3-aa)',
}

/**
 * What each level looks like when nobody says otherwise — and the reason this
 * component exists rather than six styled tags.
 *
 * Read the gaps. `1 → title` then `2 → heading` SKIPS `lead`, because the
 * ladder's steps sit close together on purpose: it separates records of the
 * same kind, not a heading from its own sub-heading. `--fs-lead` over
 * `--fs-heading` is a ratio of 1.14 and reads as a rendering accident;
 * `--fs-title` over `--fs-heading` is 1.86 and reads as a hierarchy.
 *
 * So the correct pairing is what a caller gets for free, and stepping off the
 * ladder costs a prop and is visible in review. This is the same map
 * `article.css` applies to rendered Markdown, which is what makes a component
 * page and a post read as one publication.
 */
const LADDER: Record<HeadingLevel, HeadingSize> = {
  1: 'title',
  2: 'heading',
  3: 'sub',
  4: 'item',
  5: 'label',
  6: 'label',
}

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode
  /**
   * The element: `1` renders `<h1>`, `6` renders `<h6>`.
   *
   * This is the document outline and nothing else — it is what a screen reader
   * navigates by, so it follows the section the heading opens, never the size
   * it wants to be. A heading two levels down inside an `<h2>` section is an
   * `<h3>` even when the design calls for something enormous.
   */
  level: HeadingLevel
  /**
   * The size, when the outline and the design genuinely disagree.
   *
   * Defaults from `level` through the ladder above, which is the answer nearly
   * always. Reach for this when a semantically-correct `h3` opens a page and
   * has to look like one — not to squeeze a fourth step between two that are
   * already only 14% apart.
   */
  size?: HeadingSize
}

/**
 * A heading, with its element and its size decided separately.
 *
 * Every heading component that takes one number gets this wrong in one of two
 * directions: either the outline is bent to reach a size (an `<h1>` in the
 * middle of a page because the design wanted big type), or the size is bent to
 * keep the outline (a section title set at 20px because it is the fourth level
 * down). Both are one prop away from being right, so there are two.
 *
 * `level` is the document. `size` is the page. The default binds them through
 * the system's ladder, so writing only `level` is correct — and the moment they
 * come apart, the call site says so.
 *
 * Set in the editorial serif at weight 400, like every heading in the system.
 * It also carries `scroll-margin-top`, so a heading given an `id` and linked
 * from a table of contents comes to rest below the masthead rather than under
 * it.
 *
 * @example
 * <Heading level={1}>The White Reset</Heading>
 * @example
 * // Third level in the outline, page-title sized.
 * <Heading level={3} size="title">Colour</Heading>
 */
export function Heading({ children, level, size, className, ...rest }: HeadingProps) {
  const Comp = `h${level}` as const
  const step = size ?? LADDER[level]

  return (
    <Comp
      className={cn(
        'm-0 scroll-mt-[var(--scroll-offset)] font-heading font-normal text-(--ink)',
        SIZE[step],
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  )
}

export default Heading
