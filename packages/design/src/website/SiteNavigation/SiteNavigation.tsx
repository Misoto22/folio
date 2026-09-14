'use client'

import { Slot } from '@radix-ui/react-slot'
import * as MenuPrimitive from '@radix-ui/react-dropdown-menu'
import { RiCheckLine, RiMenuLine, RiSearchLine } from '@remixicon/react'
import { useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react'
import { Button } from '../../components/Button/Button'
import { Kbd } from '../../components/Kbd/Kbd'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../../components/Sheet/Sheet'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel } from '../../components/DropdownMenu/DropdownMenu'

export interface SiteNavigationItem {
  id: string
  content: ReactElement
  active?: boolean
}

export interface NavigationSearchTriggerProps {
  label: string
  onClick: () => void
  shortcut?: string
}

/** A visible search entry with its keyboard shortcut, compact on small screens. */
export function NavigationSearchTrigger({ label, onClick, shortcut = '⌘ K' }: NavigationSearchTriggerProps) {
  return <Button variant="ghost" className="m22-navigation-search" aria-label={`${label} (${shortcut})`} onClick={onClick}><RiSearchLine size={17} aria-hidden /><span className="m22-navigation-search-label">{label}</span><Kbd>{shortcut}</Kbd></Button>
}

export interface PreferenceMenuProps {
  label: string
  value: string
  onValueChange: (value: string) => void
  icon: ReactNode
  disabled?: boolean
  options: { value: string; label: string; icon?: ReactNode }[]
}

/** A compact named control for selecting one persistent reader preference. */
export function PreferenceMenu({ label, value, onValueChange, icon, disabled, options }: PreferenceMenuProps) {
  const keyboardInteraction = useRef(false)
  return <DropdownMenu modal={false}><DropdownMenuTrigger asChild onPointerDownCapture={() => { keyboardInteraction.current = false }} onKeyDownCapture={() => { keyboardInteraction.current = true }}><Button variant="ghost" iconOnly aria-label={label} disabled={disabled}>{icon}</Button></DropdownMenuTrigger><DropdownMenuContent align="end" aria-label={label} className="m22-site-preference-menu"onPointerDownCapture={() => { keyboardInteraction.current = false }} onKeyDownCapture={() => { keyboardInteraction.current = true }} onCloseAutoFocus={event => { if (!keyboardInteraction.current) event.preventDefault() }}><DropdownMenuLabel>{label}</DropdownMenuLabel><MenuPrimitive.RadioGroup value={value} onValueChange={onValueChange}>{options.map(option => <MenuPrimitive.RadioItem key={option.value} value={option.value} className="m22-site-preference-item"><span>{option.label}</span>{option.icon}<MenuPrimitive.ItemIndicator className="m22-site-preference-indicator" aria-hidden><RiCheckLine size={14} /></MenuPrimitive.ItemIndicator></MenuPrimitive.RadioItem>)}</MenuPrimitive.RadioGroup></DropdownMenuContent></DropdownMenu>
}

/**
 * Whether a fixed element's containing block is the viewport.
 *
 * A transform, filter or `contain: layout` on any ancestor takes that role
 * instead, and the list differs between engines, so the element is
 * compared with a probe fixed to the body rather than checked against a list.
 * `documentElement.clientWidth` cannot stand in for the probe: with a stable
 * scrollbar gutter Chromium reports the full window while laying fixed boxes
 * out beside the gutter.
 */
function isLaidOutAgainstViewport(element: HTMLElement): boolean {
  const probe = document.createElement('div')
  probe.style.cssText = 'position:fixed;inset:0 0 auto;inline-size:100%;visibility:hidden;pointer-events:none'
  document.body.append(probe)
  const own = element.getBoundingClientRect()
  const viewport = probe.getBoundingClientRect()
  probe.remove()
  return Math.abs(own.left - viewport.left) <= 1 && Math.abs(own.top - viewport.top) <= 1 && Math.abs(own.width - viewport.width) <= 1
}

export interface SiteNavigationProps {
  brand: ReactNode
  links: SiteNavigationItem[]
  actions?: ReactNode
  footer?: ReactNode
  label: string
  openLabel: string
  closeLabel: string
  /** Transparent over media until the reader scrolls. */
  overlay?: boolean
  /** A host navigation identity; changing it dismisses the mobile menu. */
  navigationKey?: string
}

/** A public-site masthead with a keyboard-safe mobile navigation sheet. */
export function SiteNavigation({ brand, links, actions, footer, label, openLabel, closeLabel, overlay = false, navigationKey }: SiteNavigationProps) {
  const header = useRef<HTMLElement>(null)
  useEffect(() => {
    const node = header.current
    if (!node) return
    // Overlay scroll locks change the viewport's available layout width in
    // WebViews. Keep the unlocked width until an actual window resize.
    let gutter = window.innerWidth - document.documentElement.clientWidth
    const measure = () => {
      if (!document.body.hasAttribute('data-scroll-locked')) {
        gutter = window.innerWidth - document.documentElement.clientWidth
      }
      // Pin only against the viewport. Under an ancestor that contains fixed
      // descendants the stylesheet's 100% is that ancestor's width, and the
      // window's overflows it.
      node.style.removeProperty('inline-size')
      if (isLaidOutAgainstViewport(node)) node.style.setProperty('inline-size', `${window.innerWidth - gutter}px`)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [previousKey, setPreviousKey] = useState(navigationKey)
  if (previousKey !== navigationKey) {
    setPreviousKey(navigationKey)
    setOpen(false)
  }
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 40)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <header ref={header} className="m22-site-navigation" data-overlay={overlay && !scrolled && !open || undefined}>
      <div className="m22-site-navigation-inner">
        <div className="m22-site-wordmark">{brand}</div>
        <nav className="m22-site-navigation-desktop" aria-label={label}>
          <ul>{links.map(item => <li key={item.id}><Slot className="m22-site-navigation-link" aria-current={item.active ? 'page' : undefined}>{item.content}</Slot></li>)}</ul>
        </nav>
        <div className="m22-site-navigation-actions">
          {actions}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild><Button variant="ghost" iconOnly aria-label={open ? closeLabel : openLabel} className="m22-site-navigation-toggle"><RiMenuLine size={19} aria-hidden /></Button></SheetTrigger>
            <SheetContent side="top" title={label} closeLabel={closeLabel} className="m22-site-navigation-sheet" aria-describedby={undefined}>
              <nav aria-label={label} className="m22-site-navigation-mobile">
                {links.map(item => <SheetClose asChild key={item.id}><Slot className="m22-site-navigation-link" aria-current={item.active ? 'page' : undefined}>{item.content}</Slot></SheetClose>)}
              </nav>
              {footer && <div className="m22-site-navigation-footer">{footer}</div>}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
