'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { RiArrowDownSLine, RiArrowUpSLine, RiCheckLine } from '@remixicon/react'
import { useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { warnBlankName } from '../../lib/warn'
import { useOverlayContainer } from '../../lib/overlay-container'
import { useFieldControl } from '../Field/field-control'
import { CONTROL_BASE, CONTROL_BORDER, isInvalid } from '../../lib/control'

/** Radix Select root, group and label, as typed passthroughs. */
export const SelectRoot = SelectPrimitive.Root
export const SelectGroup = SelectPrimitive.Group

export interface SelectProps extends ComponentProps<typeof SelectPrimitive.Root> {
  /**
   * Classes for the option PANEL, not the trigger.
   *
   * `className` styles the trigger, which is the common case. This exists for
   * the uncommon one: a select inside a bounded surface, where the default
   * 18rem of list would cover the thing the reader is choosing for — a year
   * picker over its own calendar, say.
   */
  contentClassName?: string
  /**
   * Names the control. Required — the trigger shows a value, and a value is not
   * a name.
   *
   * It is announced together with the value, not instead of it: the trigger is
   * named by the label and by its own text, so a reader hears "Region,
   * Australia". Inside a `Field` with a label, that label is used and this one
   * is not repeated.
   */
  label: string
  placeholder?: string
  /** Paints the resting border with `--danger` and reflects `aria-invalid`. */
  invalid?: boolean
  disabled?: boolean
  className?: string
  /** The TRIGGER's id — the element a label points at. A `Field` sets it. */
  id?: string
  /** Ids of the copy describing the control. A `Field` sets it from hint, error and description. */
  'aria-describedby'?: string
  /** The spelling a form library sets; read together with `invalid`. */
  'aria-invalid'?: boolean | 'true' | 'false'
  /** Announced on the trigger. A `Field` sets it from `required`. */
  'aria-required'?: boolean
  /** `SelectItem`s, optionally wrapped in `SelectGroup` with a `SelectLabel`. */
  children: ReactNode
}

/**
 * A choice from a list, styled the whole way down.
 *
 * The option list is ours — drawn from the same tokens as everything else, so
 * it does not change typeface, spacing and selection colour the moment it
 * opens. That is the whole reason this replaced the native control as the
 * default: a design system whose most common form control stops being part of
 * the system on click is not a design system, it is a stylesheet for closed
 * states.
 *
 * The keyboard contract is Radix's, which means it is the platform's: typeahead
 * works, the arrows move, Home and End reach the ends, and Escape closes
 * without choosing. That was the one genuine argument for staying native, and
 * it is answered.
 *
 * Past roughly a dozen options, reach for `Combobox` — a list nobody can filter
 * is worse than one they can type into. Where the platform picker is genuinely
 * better — a phone, or a form that must survive without JavaScript — reach for
 * `NativeSelect`.
 *
 * @example
 * <Field label="Region">
 *   <Select label="Region" defaultValue="au">
 *     <SelectItem value="au">Australia</SelectItem>
 *     <SelectItem value="nz">New Zealand</SelectItem>
 *   </Select>
 * </Field>
 */
export function Select({
  label,
  placeholder = 'Select…',
  invalid,
  disabled,
  className,
  contentClassName,
  children,
  id,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  'aria-required': ariaRequired,
  ...props
}: SelectProps) {
  warnBlankName('Select', 'label', label, 'the trigger is announced with no name')
  const bad = isInvalid(invalid, ariaInvalid)

  const field = useFieldControl()
  const generated = useId()
  // The id belongs on the TRIGGER: Radix's root renders no DOM node at all, so
  // an id handed to it lands nowhere and the label above points at nothing.
  const triggerId = id ?? generated
  const valueId = `${triggerId}-value`
  const nameId = field?.labelId ?? `${triggerId}-name`

  const container = useOverlayContainer()

  return (
    <SelectPrimitive.Root disabled={disabled} {...props}>
      <SelectPrimitive.Trigger
        id={triggerId}
        // Named by the label AND by its own value, in that order. `aria-label`
        // outranks name-from-content, so naming it "Region" told a reader the
        // noun and never the answer — and the answer is the only thing on the
        // trigger.
        aria-labelledby={`${nameId} ${valueId}`}
        aria-describedby={describedBy}
        aria-required={ariaRequired}
        aria-invalid={bad || undefined}
        className={cn(
          CONTROL_BASE,
          'group flex cursor-pointer items-center justify-between gap-2 text-start data-[placeholder]:text-(--ink-3-aa)',
          bad ? CONTROL_BORDER.invalid : CONTROL_BORDER.resting,
          className,
        )}
      >
        {field?.labelId == null && (
          <span id={nameId} className="sr-only">
            {label}
          </span>
        )}
        {/* Wrapped rather than styled directly: Radix's Value drops className.
            The wrapper is also what `aria-labelledby` points at, so the name
            picks up the value and not the chevron. */}
        <span id={valueId} className="truncate">
          <SelectPrimitive.Value placeholder={placeholder} />
        </span>
        <SelectPrimitive.Icon asChild>
          <RiArrowDownSLine
            size={16}
            aria-hidden
            className="shrink-0 text-(--ink-3-aa) transition-transform duration-(--duration-fast) group-data-[state=open]:rotate-180"
          />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal container={container ?? undefined}>
        <SelectPrimitive.Content
        collisionBoundary={container ?? undefined}
        collisionPadding={8}
          position="popper"
          sideOffset={6}
          data-folio-animated
          className={cn(
            'z-(--z-dropdown) max-h-72 min-w-(--radix-select-trigger-width) overflow-hidden rounded-(--radius-lg) border border-(--panel-border) bg-(--panel-bg) shadow-(--panel-lift) panel-blur',
            contentClassName,
            'data-[state=open]:animate-[folio-pop-in_var(--duration-fast)_var(--ease-out-expo)] data-[state=closed]:animate-[folio-pop-out_var(--duration-fast)_var(--ease)] origin-(--radix-popper-transform-origin)',
          )}
        >
          <SelectPrimitive.ScrollUpButton className="flex h-6 items-center justify-center text-(--ink-3-aa)">
            <RiArrowUpSLine size={14} aria-hidden />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="p-1.5">{children}</SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="flex h-6 items-center justify-center text-(--ink-3-aa)">
            <RiArrowDownSLine size={14} aria-hidden />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}

export type SelectItemProps = ComponentProps<typeof SelectPrimitive.Item>

/** One option. The tick marks the chosen one; the fill marks the highlighted one. */
export function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      className={cn(
        'flex cursor-pointer select-none items-center gap-2.5 rounded-(--radius-row) px-2.5 py-2 text-sm text-(--ink-2) outline-none transition-colors duration-(--duration-fast) data-[highlighted]:bg-(--stone) data-[highlighted]:text-(--ink) data-[disabled]:pointer-events-none data-[disabled]:opacity-(--disabled-opacity)',
        className,
      )}
      {...props}
    >
      {/* The box is always there and only the tick inside it appears, so
          choosing an option does not shunt every label sideways. */}
      <span className="grid size-3.5 shrink-0 place-items-center">
        <SelectPrimitive.ItemIndicator asChild>
          <RiCheckLine size={14} aria-hidden />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

/**
 * Mono eyebrow heading for a group of options.
 *
 * Must sit inside a `SelectGroup` — Radix throws otherwise, because a heading
 * with no group is a heading for nothing, and assistive tech would announce it
 * as an option.
 */
export function SelectLabel({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cn('px-2.5 py-1.5 eyebrow text-(--ink-3-aa)', className)}
      {...props}
    />
  )
}

/** Hairline divider between groups. */
export function SelectSeparator({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator className={cn('my-1 h-px bg-(--rule)', className)} {...props} />
  )
}

export default Select
