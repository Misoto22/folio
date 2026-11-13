import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

/**
 * A rung of the type scale, named for what it is FOR rather than for a pixel
 * value. `base` is body copy; `lead` is the standfirst that carries a piece and
 * is the only step here that touches the heading ladder (`--fs-item`, its
 * bottom rung). Nothing above that: a paragraph larger than a record title is a
 * heading that forgot to be one.
 */
export type TextSize = 'xs' | 'sm' | 'base' | 'lead'

/**
 * A rung of the ink ladder. Three, because the ladder has three.
 *
 * `muted` is `--ink-3-aa` and never `--ink-3`. The two look identical on paper
 * and are not the same token: `--ink-3` is a translucent tint that inherits
 * whatever is under it, so it clears AA on the page ground and quietly fails on
 * a card, a plate, or a code block.
 */
export type TextTone = 'body' | 'strong' | 'muted'

export type TextElement = 'p' | 'span' | 'div' | 'li' | 'figcaption'

/**
 * Weight travels with the size, deliberately.
 *
 * The system sets long-form copy at 300 — it is what gives a page of prose its
 * air. At 12 and 14px that same weight is a hairline: the strokes thin out
 * below the point where a light face is a choice and turn into a legibility
 * bug. So the two small steps step back up to 400, and a caller never has to
 * know that the trade exists.
 */
const SIZE: Record<TextSize, string> = {
  xs: 'text-xs leading-[1.6]',
  sm: 'text-sm leading-[1.65]',
  base: 'text-base [font-weight:var(--body-weight)] leading-[1.75]',
  lead: 'text-[length:var(--fs-item)] [font-weight:var(--body-weight)] leading-[1.6]',
}

const TONE: Record<TextTone, string> = {
  body: 'text-(--ink-2)',
  strong: 'text-(--ink)',
  muted: 'text-(--ink-3-aa)',
}

export interface TextProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode
  /** Which rung of the type scale. See {@link TextSize}. */
  size?: TextSize
  /** Which rung of the ink ladder. See {@link TextTone}. */
  tone?: TextTone
  /**
   * The element, and ONLY the element.
   *
   * Changing it changes what the markup means — a `span` inside a sentence, an
   * `li` inside a list someone else opened — and changes nothing about the
   * look. That separation is the whole point: the alternative is a `<p>` nested
   * inside a `<p>`, which the HTML parser silently splits into two, or a
   * paragraph faked out of a `<div>` because the real element brought a size
   * with it.
   */
  as?: TextElement
}

/**
 * A paragraph, or a run of text that wants the system's voice.
 *
 * The step between `Article` and raw JSX. `Article` styles a whole reading
 * column from element selectors and is the right answer for a post; this is for
 * the single paragraph that is NOT in a column — a card's description, a
 * dialog's explanation, the line under an empty state.
 *
 * The default tone is `body` (`--ink-2`), not `--ink`. A page whose paragraphs
 * are all full-strength ink has spent the top of the ladder on its body copy
 * and has nothing left for the headings, which is the single most common way a
 * monochrome page loses its hierarchy.
 *
 * @example
 * <Text>Twelve releases this quarter, none rolled back.</Text>
 * @example
 * <Text size="lead" tone="strong">A monochrome system for software and writing.</Text>
 * @example
 * <Text as="span" size="sm" tone="muted">Updated just now</Text>
 */
export function Text({
  children,
  size = 'base',
  tone = 'body',
  as = 'p',
  className,
  ...rest
}: TextProps) {
  const Comp = as as ElementType

  return (
    <Comp className={cn('m-0', SIZE[size], TONE[tone], className)} {...rest}>
      {children}
    </Comp>
  )
}

export default Text
