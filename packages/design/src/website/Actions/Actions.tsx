'use client'

import { RiArrowUpLine } from '@remixicon/react'
import type { ReactNode } from 'react'
import { Button } from '../../components/Button/Button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/DropdownMenu/DropdownMenu'
import { FloatingIconButton } from '../../components/FloatingIconButton/FloatingIconButton'
import { cn } from '../../lib/cn'

export interface ActionMenuItem {
  id: string
  label: string
  icon?: ReactNode
  onSelect: () => void
  keepOpen?: boolean
  separatorBefore?: boolean
}

export interface ActionMenuProps {
  label: string
  icon: ReactNode
  items: ActionMenuItem[]
  open: boolean
  onOpenChange: (open: boolean) => void
  side?: 'top' | 'bottom'
  align?: 'start' | 'center' | 'end'
  /** A host-native action may replace the menu on a supported device. */
  onTriggerAction?: () => void
  className?: string
}

/** A collision-aware action menu with roving focus and an optional native trigger. */
export function ActionMenu({ label, icon, items, open, onOpenChange, side = 'bottom', align = 'center', onTriggerAction, className }: ActionMenuProps) {
  const trigger = <Button variant="ghost" iconOnly aria-label={label} className={className} onClick={onTriggerAction}>{icon}</Button>
  if (onTriggerAction) return trigger
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange} modal={false}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side} sideOffset={8} collisionPadding={8} className="folio-action-menu" onEscapeKeyDown={(event) => event.stopPropagation()}>
        {items.map((item) => <div key={item.id}>{item.separatorBefore && <DropdownMenuSeparator />}<DropdownMenuItem icon={item.icon} className="folio-action-menu-item" onSelect={(event) => { if (item.keepOpen) event.preventDefault(); item.onSelect() }}>{item.label}</DropdownMenuItem></div>)}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export interface ScrollControlProps {
  label: string
  visible: boolean
  onActivate: () => void
}

/** Page position belongs to the host; visibility and a safe tab stop belong here. */
export function ScrollControl({ label, visible, onActivate }: ScrollControlProps) {
  return <FloatingIconButton position="end" label={label} onClick={onActivate} disabled={!visible} tabIndex={visible ? 0 : -1} aria-hidden={!visible || undefined} className={cn('folio-scroll-control', !visible && 'folio-scroll-control-hidden')}><RiArrowUpLine size={18} aria-hidden="true" /></FloatingIconButton>
}
