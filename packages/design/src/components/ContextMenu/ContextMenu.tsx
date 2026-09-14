'use client'

import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import type { RemixiconComponentType } from '@remixicon/react'
import { isValidElement, useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { useOverlayContainer } from '../../lib/overlay-container'

/**
 * True for a component type — `icon={Copy}` — rather than a rendered element.
 *
 * Everything a `ReactNode` can be is an element, a primitive, an array, another
 * iterable or a promise; a Remix Icon glyph is none of those, it is a plain
 * function component. So both spellings are tellable apart at runtime, which is
 * what lets one prop take either — and it has to, because this prop meant the
 * opposite thing one import away and the wrong spelling failed at render, not
 * at the type.
 */
function isIconComponent(icon: RemixiconComponentType | ReactNode): icon is RemixiconComponentType {
  if (isValidElement(icon)) return false
  if (typeof icon === 'function') return true
  if (typeof icon !== 'object' || icon === null) return false
  return !Array.isArray(icon) && !(Symbol.iterator in icon) && !('then' in icon)
}

/** The leading glyph, sized by this component when it was handed a component. */
function iconNode(icon: RemixiconComponentType | ReactNode): ReactNode {
  if (icon === undefined || icon === null || icon === false) return null
  if (!isIconComponent(icon)) {
    return (
      <span aria-hidden className="grid size-4 shrink-0 place-items-center [&_svg]:size-4">
        {icon}
      </span>
    )
  }
  const Icon = icon
  return <Icon size={16} className="shrink-0" aria-hidden />
}

/** Radix ContextMenu root and trigger, as typed passthroughs. */
export const ContextMenu = ContextMenuPrimitive.Root
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger

/**
 * The menu a right-click opens.
 *
 * Never the only way to reach an action. A context menu is opened by a
 * secondary pointer button or a keyboard's own menu key, and a meaningful share
 * of readers have neither — a touch user, someone on a trackpad they have not
 * configured, anyone driving the page by keyboard alone. Whatever is in here
 * belongs somewhere reachable too: a row's overflow button, a toolbar.
 *
 * @example
 * <ContextMenu>
 *   <ContextMenuTrigger asChild><Card>Right-click me</Card></ContextMenuTrigger>
 *   <ContextMenuContent>
 *     <ContextMenuItem icon={Copy}>Copy</ContextMenuItem>
 *   </ContextMenuContent>
 * </ContextMenu>
 */
export function ContextMenuContent({
  className,
  ...rest
}: ComponentProps<typeof ContextMenuPrimitive.Content>) {
  const container = useOverlayContainer()

  return (
    <ContextMenuPrimitive.Portal container={container ?? undefined}>
      <ContextMenuPrimitive.Content
        collisionBoundary={container ?? undefined}
        collisionPadding={8}
        data-folio-animated
        className={cn(
          'z-(--z-dropdown) min-w-44 rounded-(--radius-lg) border border-(--panel-border) bg-(--panel-bg) p-1.5 shadow-(--panel-lift) panel-blur',
          'data-[state=open]:animate-[folio-pop-in_var(--duration-fast)_var(--ease-out-expo)] data-[state=closed]:animate-[folio-pop-out_var(--duration-fast)_var(--ease)] origin-(--radix-popper-transform-origin)',
          className,
        )}
        {...rest}
      />
    </ContextMenuPrimitive.Portal>
  )
}

export interface ContextMenuItemProps
  extends ComponentProps<typeof ContextMenuPrimitive.Item> {
  /**
   * Optional leading icon. Either spelling — `icon={Copy}` passes the component
   * and this sizes it, `icon={<Copy size={16} />}` passes the element and this
   * places it.
   */
  icon?: RemixiconComponentType | ReactNode
  /** Paints the row as destructive. Use for delete, revoke, disconnect. */
  destructive?: boolean
}

/** A row. Highlight follows `data-highlighted`, which covers hover and keyboard. */
export function ContextMenuItem({
  icon,
  destructive = false,
  className,
  children,
  ...rest
}: ContextMenuItemProps) {
  return (
    <ContextMenuPrimitive.Item
      className={cn(
        'flex cursor-pointer items-center gap-2.5 rounded-(--radius-row) px-2.5 py-2 text-sm outline-none transition-colors duration-(--duration-fast) data-[highlighted]:bg-(--stone) data-[disabled]:pointer-events-none data-[disabled]:opacity-(--disabled-opacity)',
        destructive ? 'text-(--danger)' : 'text-(--ink-2) data-[highlighted]:text-(--ink)',
        className,
      )}
      {...rest}
    >
      {iconNode(icon)}
      {children}
    </ContextMenuPrimitive.Item>
  )
}

/** Hairline divider between groups. */
export function ContextMenuSeparator({
  className,
  ...rest
}: ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator className={cn('my-1 h-px bg-(--rule)', className)} {...rest} />
  )
}

/**
 * Mono eyebrow heading, on its own.
 *
 * Visual only: Radix renders it as a bare `<div>` with no role. Reach for
 * `ContextMenuGroup` when the eyebrow is a HEADING over rows; this is right for
 * a line that heads nothing.
 */
export function ContextMenuLabel({
  className,
  ...rest
}: ComponentProps<typeof ContextMenuPrimitive.Label>) {
  return (
    <ContextMenuPrimitive.Label
      className={cn('px-2.5 py-1.5 eyebrow text-(--ink-3-aa)', className)}
      {...rest}
    />
  )
}

export interface ContextMenuGroupProps
  extends ComponentProps<typeof ContextMenuPrimitive.Group> {
  /** The eyebrow over the rows, and the group's accessible name. */
  label?: ReactNode
}

/**
 * A named section of a menu.
 *
 * The eyebrow alone was a picture of a heading: Radix's `MenuLabel` carries no
 * role and no `aria-labelledby` wiring, so a sighted reader saw sections and a
 * screen-reader user got one undifferentiated list. This renders the group,
 * renders the label inside it, and points the one at the other.
 */
export function ContextMenuGroup({ label, children, ...rest }: ContextMenuGroupProps) {
  const id = useId()

  return (
    <ContextMenuPrimitive.Group
      aria-labelledby={label === undefined ? undefined : id}
      {...rest}
    >
      {label !== undefined && <ContextMenuLabel id={id}>{label}</ContextMenuLabel>}
      {children}
    </ContextMenuPrimitive.Group>
  )
}

export default ContextMenu
