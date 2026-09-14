'use client'

import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { createContext, useContext, useState, type ComponentProps } from 'react'
import { cn } from '../../lib/cn'
import { useFieldControl } from '../Field/field-control'
import { useSelectionIndicator } from '../../lib/useSelectionIndicator'

export type ToggleGroupProps = ComponentProps<typeof ToggleGroupPrimitive.Root>

/** Lets an item know whether the group tracks one value or several. */
const SingleValueContext = createContext<string | null>(null)

/**
 * A segmented control: several options, one strip.
 *
 * `type="single"` is a choice — Radix gives it radio semantics, and it is the
 * right shape for a view switcher or a density setting. `type="multiple"` is a
 * set of independent toggles, which is a different thing announced differently;
 * choosing the wrong one is how a "filter by tag" control ends up telling a
 * screen reader that picking one tag unpicks the others.
 *
 * The two look different on purpose. A single-value strip moves ONE filled pill
 * between its options, so the eye follows a thing travelling; a multiple-value
 * strip fills each pressed option separately, because there is no single
 * selection to travel. Two people looking at a screenshot should be able to
 * tell which kind they are looking at, and before this they could not.
 *
 * Distinct from `Tabs`, which switches PANELS and owns a tabpanel relationship.
 * A toggle group changes a value.
 *
 * Inside a `Field` the strip takes its name from that label, by pointing back at
 * it — the root is a div, and `<label for>` does not bind to one, so the words
 * above it do not click through. Standing alone it still needs its own
 * `aria-label`.
 *
 * @example
 * <ToggleGroup type="single" defaultValue="grid" aria-label="Layout">
 *   <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
 *   <ToggleGroupItem value="list">List</ToggleGroupItem>
 * </ToggleGroup>
 */
export function ToggleGroup({
  className,
  children,
  'aria-required': ariaRequired,
  ...props
}: ToggleGroupProps) {
  const field = useFieldControl()
  const named = props['aria-label'] != null || props['aria-labelledby'] != null

  // Tracked here rather than left to Radix alone, because the sliding pill has
  // to know which item to measure — and an uncontrolled group never tells
  // anyone what it picked.
  const single = props.type === 'single'
  const [uncontrolled, setUncontrolled] = useState<string>(
    (single ? (props.defaultValue as string | undefined) : undefined) ?? '',
  )
  const value = single ? ((props.value as string | undefined) ?? uncontrolled) : null
  const [ref, indicator] = useSelectionIndicator<HTMLDivElement>(value)

  const root = (
    <ToggleGroupPrimitive.Root
      ref={ref}
      aria-labelledby={named ? undefined : field?.labelId}
      // Only on the single-value strip. Radix gives that one role="radiogroup",
      // which takes aria-required; a multiple-value strip is a role="toolbar",
      // where the attribute is not allowed at all — so a Field's `required`
      // reaches one shape of this control and not the other.
      aria-required={props.type === 'single' ? ariaRequired : undefined}
      className={cn(
        // `w-fit` as well as `inline-flex`: a flex or grid parent stretches its
        // children to the track by default, and `inline-flex` does not opt out
        // of that. Without it the strip grew to whatever the widest sibling was
        // — a label above it — and left dead space after the last segment.
        'relative inline-flex w-fit items-center gap-1 rounded-(--radius-pill) border border-(--rule-2) p-1',
        className,
      )}
      {...props}
      onValueChange={(next: never) => {
        if (single) setUncontrolled((next as string) ?? '')
        ;(props.onValueChange as ((v: never) => void) | undefined)?.(next)
      }}
    >
      {single && indicator.ready && (
        <span
          aria-hidden
          data-folio-animated
          className="absolute rounded-(--radius-pill) bg-(--accent) transition-[transform,width] duration-(--duration-base) ease-(--ease-out-expo) motion-reduce:transition-none"
          style={{
            transform: `translate(${indicator.offset}px, ${indicator.top}px)`,
            width: indicator.width,
            height: indicator.height,
            insetInlineStart: 0,
            top: 0,
          }}
        />
      )}
      {children}
    </ToggleGroupPrimitive.Root>
  )

  return single ? (
    <SingleValueContext.Provider value={value}>{root}</SingleValueContext.Provider>
  ) : (
    root
  )
}

export type ToggleGroupItemProps = ComponentProps<typeof ToggleGroupPrimitive.Item>

/**
 * One segment.
 *
 * In a single-value group the item draws no background of its own — the
 * travelling pill behind it does — so it only changes ink. In a multiple-value
 * group it fills, because there is nothing travelling.
 */
export function ToggleGroupItem({ className, value, ...props }: ToggleGroupItemProps) {
  const selected = useContext(SingleValueContext)
  const isSingle = selected !== null
  const active = isSingle && selected === value

  return (
    <ToggleGroupPrimitive.Item
      value={value}
      data-indicator-active={active ? 'true' : undefined}
      className={cn(
        'relative z-1 inline-flex min-h-(--control-h-sm) items-center justify-center gap-2 rounded-(--radius-pill) px-3.5 text-sm transition-colors duration-(--duration-fast) disabled:opacity-(--disabled-opacity) disabled:pointer-events-none',
        isSingle
          ? active
            ? 'text-(--accent-foreground)'
            : 'text-(--ink-3-aa) hover:text-(--ink)'
          : 'text-(--ink-3-aa) hover:text-(--ink) data-[state=on]:bg-(--accent) data-[state=on]:text-(--accent-foreground)',
        className,
      )}
      {...props}
    />
  )
}

export default ToggleGroup
