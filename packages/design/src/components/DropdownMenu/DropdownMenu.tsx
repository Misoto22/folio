'use client'

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import type { RemixiconComponentType } from '@remixicon/react'
import { isValidElement, useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { useOverlayContainer } from '../../lib/overlay-container'

/**
 * True for a component type — `icon={Settings}` — rather than a rendered element.
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

/** Radix DropdownMenu root + trigger, re-exported as typed passthroughs. */
export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

export type DropdownMenuContentProps = ComponentProps<typeof DropdownMenuPrimitive.Content>

/**
 * A menu surface.
 *
 * A menu is a list of ACTIONS. If the items navigate somewhere, they belong in
 * a nav; if they set a value, that is a `Select` or a `RadioGroup` — this
 * package ships no checkbox or radio menu item, and a plain item pretending to
 * be a choice loses the checked state a screen reader needs.
 *
 * @example
 * <DropdownMenu>
 *   <DropdownMenuTrigger asChild><Button variant="secondary">Menu</Button></DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuGroup label="Account">
 *       <DropdownMenuItem icon={Settings}>Settings</DropdownMenuItem>
 *     </DropdownMenuGroup>
 *     <DropdownMenuSeparator />
 *     <DropdownMenuItem icon={LogOut}>Sign out</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 */
export function DropdownMenuContent({
  className,
  sideOffset = 6,
  children,
  ...rest
}: DropdownMenuContentProps) {
  const container = useOverlayContainer()

  return (
    <DropdownMenuPrimitive.Portal container={container ?? undefined}>
      <DropdownMenuPrimitive.Content
        collisionBoundary={container ?? undefined}
        collisionPadding={8}
        sideOffset={sideOffset}
        data-folio-animated
        data-folio-menu
        className={cn(
          'z-(--z-dropdown) min-w-44 rounded-(--radius-lg) border border-(--panel-border) bg-(--panel-bg) p-1.5 shadow-(--panel-lift) panel-blur',
          'data-[state=open]:animate-[folio-pop-in_var(--duration-fast)_var(--ease-out-expo)] data-[state=closed]:animate-[folio-pop-out_var(--duration-fast)_var(--ease)] origin-(--radix-popper-transform-origin)',
          className,
        )}
        {...rest}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  )
}

export interface DropdownMenuItemProps extends ComponentProps<typeof DropdownMenuPrimitive.Item> {
  /**
   * Optional leading icon, rendered before the label.
   *
   * Either spelling: `icon={Settings}` passes the component and this sizes it,
   * `icon={<Settings size={16} />}` passes the element and this places it. The
   * two used to mean opposite things one import apart — `CommandItem.icon` took
   * the element while this took the component — and the wrong one did not fail
   * a type check into anything actionable, it failed at render.
   */
  icon?: RemixiconComponentType | ReactNode
  /** Paints the row as destructive. Use for delete, revoke, disconnect. */
  destructive?: boolean
}

/**
 * A menu row.
 *
 * Highlight is driven by Radix's `data-highlighted`, which covers both pointer
 * hover and keyboard focus — styling `:hover` alone leaves the keyboard user
 * unable to see where they are.
 */
export function DropdownMenuItem({
  icon,
  destructive = false,
  className,
  children,
  ...rest
}: DropdownMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        'flex cursor-pointer items-center gap-2.5 rounded-(--radius-row) px-2.5 py-2 text-sm outline-none transition-colors duration-(--duration-fast) data-[highlighted]:bg-(--stone) data-[disabled]:pointer-events-none data-[disabled]:opacity-(--disabled-opacity)',
        destructive ? 'text-(--danger)' : 'text-(--ink-2) data-[highlighted]:text-(--ink)',
        className,
      )}
      {...rest}
    >
      {iconNode(icon)}
      {children}
    </DropdownMenuPrimitive.Item>
  )
}

/** Hairline divider between menu groups. */
export function DropdownMenuSeparator({
  className,
  ...rest
}: ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn('my-1 h-px bg-(--rule)', className)}
      {...rest}
    />
  )
}

/**
 * Mono eyebrow heading, on its own.
 *
 * Visual only: Radix renders it as a bare `<div>` with no role, so it segments
 * the menu for a reader who can see it and for nobody else. Reach for
 * `DropdownMenuGroup` when the eyebrow is a HEADING over rows; this is right
 * for a line that heads nothing — the signed-in address at the top of an
 * account menu.
 */
export function DropdownMenuLabel({
  className,
  ...rest
}: ComponentProps<typeof DropdownMenuPrimitive.Label>) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn('px-2.5 py-1.5 eyebrow text-(--ink-3-aa)', className)}
      {...rest}
    />
  )
}

export interface DropdownMenuGroupProps
  extends ComponentProps<typeof DropdownMenuPrimitive.Group> {
  /** The eyebrow over the rows, and the group's accessible name. */
  label?: ReactNode
}

/**
 * A named section of a menu.
 *
 * The eyebrow alone was a picture of a heading. Radix's `MenuLabel` carries no
 * role and no `aria-labelledby` wiring, and `MenuGroup` — which does carry
 * `role="group"` — was not re-exported by this package at all, so a sighted
 * reader saw three labelled sections and a screen-reader user got one
 * undifferentiated list. This renders the group, renders the label inside it,
 * and points the one at the other, which is the whole of the fix and not
 * something a caller should have to remember.
 *
 * @example
 * <DropdownMenuGroup label="Account">
 *   <DropdownMenuItem icon={Settings}>Settings</DropdownMenuItem>
 * </DropdownMenuGroup>
 */
export function DropdownMenuGroup({ label, children, ...rest }: DropdownMenuGroupProps) {
  const id = useId()

  return (
    <DropdownMenuPrimitive.Group
      aria-labelledby={label === undefined ? undefined : id}
      {...rest}
    >
      {label !== undefined && <DropdownMenuLabel id={id}>{label}</DropdownMenuLabel>}
      {children}
    </DropdownMenuPrimitive.Group>
  )
}

export default DropdownMenu
