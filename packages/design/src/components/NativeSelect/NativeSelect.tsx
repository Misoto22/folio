import { ChevronDown } from '../../icons'
import type { Ref, SelectHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { CONTROL_BASE, CONTROL_BORDER, isInvalid } from '../../lib/control'

export interface NativeSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Paints the resting border with `--danger` and reflects `aria-invalid`. */
  invalid?: boolean
  ref?: Ref<HTMLSelectElement>
}

/**
 * A native `<select>`, restyled.
 *
 * The escape hatch, not the default — `Select` is the styled one. Reach for
 * this where the platform's own picker is genuinely better: a very long list on
 * a phone, a form that must work without JavaScript, a page where the last
 * kilobyte matters. The browser gives typeahead and the mobile wheel for free,
 * and those are real.
 *
 * What it cannot do is look like the rest of the system once open. The option
 * list is drawn by the operating system, so it carries none of these tokens —
 * which is exactly why it stopped being the default.
 *
 * `className` sizes the WRAPPER, not the `<select>` inside it. This is the one
 * control here that renders two elements, and the chevron is pinned to the
 * wrapper's end edge: a width on the select alone narrowed the box and left the
 * arrow floating at the far side of the row. The select fills whatever the
 * wrapper is.
 *
 * @example
 * <NativeSelect defaultValue="au"><option value="au">Australia</option></NativeSelect>
 */
export function NativeSelect({
  invalid,
  className,
  ref,
  children,
  'aria-invalid': ariaInvalid,
  ...rest
}: NativeSelectProps) {
  const bad = isInvalid(invalid, ariaInvalid)
  return (
    <div className={cn('relative', className)}>
      <select
        ref={ref}
        aria-invalid={ariaInvalid ?? (invalid ? true : undefined)}
        className={cn(
          CONTROL_BASE,
          'cursor-pointer appearance-none pe-9',
          bad ? CONTROL_BORDER.invalid : CONTROL_BORDER.resting,
        )}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-(--ink-3-aa)"
        aria-hidden
      />
    </div>
  )
}

export default NativeSelect
