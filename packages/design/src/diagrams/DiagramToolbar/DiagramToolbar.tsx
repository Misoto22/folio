'use client'

import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { SURFACE_PANEL_QUIET } from '../../lib/surface'

export interface DiagramToolbarProps extends Omit<ComponentProps<'div'>, 'children'> {
  children: ReactNode
  /** Where it sits. `floating` pins it over the surface it acts on. */
  placement?: 'inline' | 'floating'
  /** Which corner a floating bar pins to. */
  align?: 'start' | 'end'
  label: string
}

/**
 * A bar of actions that belong to the surface underneath them.
 *
 * The package already has `FloatingIconButton` for ONE pinned action. This is
 * the container for several — which is a different problem, because several
 * pinned buttons need to read as one object rather than as a scatter: one
 * plate, one border, hairlines between the groups, and a single `role="toolbar"`
 * so a screen reader announces a toolbar instead of six unrelated buttons.
 *
 * `role="toolbar"` also changes the keyboard contract, and callers should know
 * what they are opting into: arrow keys are expected to move between the
 * controls and Tab is expected to leave the bar. This component does not
 * implement roving focus for you — a bar of three buttons where Tab visits all
 * three is honest and fine — so pass `placement="inline"` and skip the role by
 * using a plain `<div>` if that is not what you want.
 *
 * @example
 * <DiagramToolbar label="Diagram actions" placement="floating">
 *   <DiagramToolbarGroup>
 *     <Button size="sm" variant="ghost">Theme</Button>
 *   </DiagramToolbarGroup>
 *   <DiagramToolbarGroup>
 *     <DiagramExportMenu targetRef={svg} title="Request path" />
 *   </DiagramToolbarGroup>
 * </DiagramToolbar>
 */
export function DiagramToolbar({
  children,
  className,
  placement = 'inline',
  align = 'end',
  label,
  ...rest
}: DiagramToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label={label}
      aria-orientation="horizontal"
      className={cn(
        'flex items-center gap-1 rounded-(--radius) border p-1',
        SURFACE_PANEL_QUIET,
        placement === 'floating' && 'absolute top-3 z-(--z-sticky)',
        placement === 'floating' && (align === 'end' ? 'end-3' : 'start-3'),
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * One run of related controls inside the bar.
 *
 * Separated by a hairline rather than by space, because a gap large enough to
 * read as a group boundary is also large enough to stop the bar reading as one
 * object — which is the whole reason the controls were collected into a bar.
 */
export function DiagramToolbarGroup({
  children,
  className,
  ...rest
}: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex items-center gap-0.5',
        'border-s border-(--rule) ps-1 first:border-s-0 first:ps-0',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export default DiagramToolbar
