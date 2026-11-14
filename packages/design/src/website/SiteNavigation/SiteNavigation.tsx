'use client'

import { Slot } from '@radix-ui/react-slot'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as MenuPrimitive from '@radix-ui/react-dropdown-menu'
import { Check, Menu, Search, X } from '../../icons'
import { useEffect, useId, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactElement, type ReactNode } from 'react'
import { Button } from '../../components/Button/Button'
import { Kbd } from '../../components/Kbd/Kbd'
import { ToggleGroup, ToggleGroupItem } from '../../components/ToggleGroup/ToggleGroup'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel } from '../../components/DropdownMenu/DropdownMenu'
import { replaceSlotContent, resolveSlotElement } from '../../lib/slot-content'

export interface SiteNavigationItem {
  id: string
  content: ReactElement
  active?: boolean
  /** A mark at the end of the link's row in the phone menu, such as an accent glyph. */
  marker?: ReactNode
}

const HOVER = '(hover: hover)'
const subscribeHover = (onChange: () => void) => {
  const query = window.matchMedia?.(HOVER)
  query?.addEventListener('change', onChange)
  return () => query?.removeEventListener('change', onChange)
}
const readHover = () => window.matchMedia?.(HOVER).matches ?? true
const readHoverOnServer = () => true

export interface NavigationSearchTriggerProps {
  label: string
  onClick: () => void
  shortcut?: string
}

/**
 * A visible search entry with its keyboard shortcut, compact on small screens.
 *
 * The shortcut is named only where a pointer can hover — a reader on a touch
 * screen has no ⌘ key to press, so "(⌘ K)" there is noise read aloud.
 */
export function NavigationSearchTrigger({ label, onClick, shortcut = '⌘ K' }: NavigationSearchTriggerProps) {
  const hover = useSyncExternalStore(subscribeHover, readHover, readHoverOnServer)
  return <Button variant="ghost" className="folio-navigation-search" aria-label={hover ? `${label} (${shortcut})` : label} onClick={onClick}><Search size={17} aria-hidden /><span className="folio-navigation-search-label">{label}</span><Kbd>{shortcut}</Kbd></Button>
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
  return <DropdownMenu modal={false}><DropdownMenuTrigger asChild onPointerDownCapture={() => { keyboardInteraction.current = false }} onKeyDownCapture={() => { keyboardInteraction.current = true }}><Button variant="ghost" iconOnly aria-label={label} disabled={disabled}>{icon}</Button></DropdownMenuTrigger><DropdownMenuContent align="end" aria-label={label} className="folio-site-preference-menu"onPointerDownCapture={() => { keyboardInteraction.current = false }} onKeyDownCapture={() => { keyboardInteraction.current = true }} onCloseAutoFocus={event => { if (!keyboardInteraction.current) event.preventDefault() }}><DropdownMenuLabel>{label}</DropdownMenuLabel><MenuPrimitive.RadioGroup value={value} onValueChange={onValueChange}>{options.map(option => <MenuPrimitive.RadioItem key={option.value} value={option.value} className="folio-site-preference-item"><span>{option.label}</span>{option.icon}<MenuPrimitive.ItemIndicator className="folio-site-preference-indicator" aria-hidden><Check size={14} /></MenuPrimitive.ItemIndicator></MenuPrimitive.RadioItem>)}</MenuPrimitive.RadioGroup></DropdownMenuContent></DropdownMenu>
}

export type PreferenceSegmentProps = Omit<PreferenceMenuProps, 'icon'>

/**
 * The same preference as `PreferenceMenu`, laid out as a segmented switch that
 * shows its state without being opened — for the foot of the phone menu, where
 * a dropdown would hang off the hardest corner to reach.
 */
export function PreferenceSegment({ label, value, onValueChange, disabled, options }: PreferenceSegmentProps) {
  const labelId = useId()
  return (
    <div className="folio-site-preference-segment">
      <span id={labelId} className="folio-site-preference-segment__label">{label}</span>
      <ToggleGroup type="single" value={value} onValueChange={(next) => { if (next) onValueChange(next) }} aria-labelledby={labelId} disabled={disabled} className="folio-site-preference-segment__group">
        {options.map((option) => <ToggleGroupItem key={option.value} value={option.value} className="folio-site-preference-segment__item">{option.icon}{option.label}</ToggleGroupItem>)}
      </ToggleGroup>
    </div>
  )
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

const TABBABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Keeps Tab inside the bar and its menu while the menu is open.
 *
 * The menu is a non-modal dialog so that the button which opened it stays in
 * the bar and closes it in place; Radix's modal trap would make that button
 * unreachable. The trap is therefore the masthead's own: the bar's controls,
 * then the menu, and round again.
 */
function wrapTab(event: KeyboardEvent<HTMLElement>) {
  if (event.key !== 'Tab') return
  const nodes = [...event.currentTarget.querySelectorAll<HTMLElement>(TABBABLE)].filter((node) => !node.closest('[inert], .folio-site-navigation-desktop') && (node.checkVisibility?.() ?? true) && node.tabIndex >= 0)
  if (nodes.length === 0) return
  const first = nodes[0]!
  const last = nodes[nodes.length - 1]!
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
}

/** A menu link: the host's element, with "you are here" and any marker set after its words. */
function menuLink(item: SiteNavigationItem, currentLabel: string | undefined) {
  const element = resolveSlotElement(item.content as ReactElement<{ children?: ReactNode }>)
  const words = element.props.children
  return replaceSlotContent(element, <><span>{words}</span>{item.active && currentLabel && <span className="folio-site-navigation-here" aria-hidden>{currentLabel}</span>}{!item.active && item.marker && <span className="folio-site-navigation-marker" aria-hidden>{item.marker}</span>}</>)
}

const WIDE = '(min-width: 900px)'

export interface SiteNavigationProps {
  brand: ReactNode
  links: SiteNavigationItem[]
  /** The desk's tools. With `barActions` they are hidden below the breakpoint. */
  actions?: ReactNode
  /** What stays in the bar below the breakpoint, beside the menu button — usually search alone. */
  barActions?: ReactNode
  /** A second, smaller row of links in the phone menu, for pages the bar never carried there. */
  secondaryLinks?: SiteNavigationItem[]
  /** Names the second row for assistive tech. */
  secondaryLabel?: string
  /** The foot of the phone menu — usually the reader's settings, as `PreferenceSegment`s. */
  footer?: ReactNode
  label: string
  openLabel: string
  closeLabel: string
  /** Marks the current page in the phone menu, e.g. "You are here". Decorative; the link already carries `aria-current`. */
  currentLabel?: string
  /** Transparent over media until the reader scrolls. */
  overlay?: boolean
  /** A host navigation identity; changing it dismisses the mobile menu. */
  navigationKey?: string
}

/**
 * A public-site masthead with a phone menu that unfolds from under the bar.
 *
 * The bar never moves: the menu is a page below its hairline, and the button
 * that opened it turns into the button that closes it, in place, so focus never
 * has to go looking for the close. Esc closes it and returns focus to that
 * button, the page behind does not scroll, and Tab stays within the bar and
 * the menu.
 */
export function SiteNavigation({ brand, links, actions, barActions, secondaryLinks, secondaryLabel, footer, label, openLabel, closeLabel, currentLabel, overlay = false, navigationKey }: SiteNavigationProps) {
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
  // While the menu is open the page behind it holds still, and a window that
  // grows past the breakpoint — where there is no menu — closes it.
  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    const wide = window.matchMedia?.(WIDE)
    const onWide = () => { if (wide?.matches) setOpen(false) }
    wide?.addEventListener('change', onWide)
    return () => { root.style.overflow = previous; wide?.removeEventListener('change', onWide) }
  }, [open])

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen} modal={false}>
      <header ref={header} className="folio-site-navigation" data-overlay={overlay && !scrolled && !open || undefined} data-menu-open={open || undefined} onKeyDown={open ? wrapTab : undefined}>
        <div className="folio-site-navigation-inner">
          <div className="folio-site-wordmark">{brand}</div>
          <nav className="folio-site-navigation-desktop" aria-label={label}>
            <ul>{links.map(item => <li key={item.id}><Slot className="folio-site-navigation-link" aria-current={item.active ? 'page' : undefined}>{item.content}</Slot></li>)}</ul>
          </nav>
          <div className="folio-site-navigation-actions" data-split={barActions != null || undefined}>
            {actions != null && <div className="folio-site-navigation-desk">{actions}</div>}
            {barActions != null && <div className="folio-site-navigation-bar">{barActions}</div>}
            <DialogPrimitive.Trigger asChild>
              <Button variant="ghost" iconOnly aria-label={open ? closeLabel : openLabel} className="folio-site-navigation-toggle">
                <Menu size={21} aria-hidden data-glyph="open" /><X size={21} aria-hidden data-glyph="close" />
              </Button>
            </DialogPrimitive.Trigger>
          </div>
        </div>
        <DialogPrimitive.Content className="folio-site-navigation-sheet" aria-describedby={undefined} data-folio-animated
          // Moving between the bar and the menu is staying inside the masthead,
          // not leaving the dialog; only a press elsewhere dismisses it.
          onFocusOutside={(event) => { if (header.current?.contains(event.target as Node)) event.preventDefault() }}>
          <DialogPrimitive.Title className="sr-only">{label}</DialogPrimitive.Title>
          <nav aria-label={label} className="folio-site-navigation-mobile">
            <ul>{links.map(item => <li key={item.id}><DialogPrimitive.Close asChild><Slot className="folio-site-navigation-link" aria-current={item.active ? 'page' : undefined}>{menuLink(item, currentLabel)}</Slot></DialogPrimitive.Close></li>)}</ul>
          </nav>
          {secondaryLinks && secondaryLinks.length > 0 && (
            <nav aria-label={secondaryLabel} className="folio-site-navigation-secondary">
              {secondaryLinks.map(item => <DialogPrimitive.Close asChild key={item.id}><Slot className="folio-site-navigation-link" aria-current={item.active ? 'page' : undefined}>{item.content}</Slot></DialogPrimitive.Close>)}
            </nav>
          )}
          {footer && <div className="folio-site-navigation-footer">{footer}</div>}
        </DialogPrimitive.Content>
      </header>
    </DialogPrimitive.Root>
  )
}
