'use client'

import { useEffect, useLayoutEffect, useRef, type KeyboardEvent, type ReactNode, type RefObject } from 'react'
import { ArrowLeft, ArrowUpRight, Search } from '../../icons'
import { CommandDialog, CommandEmpty, CommandFooter, CommandGroup, CommandHint, CommandInput, CommandItem, CommandList } from '../../components/Command/Command'
import type { DialogContentProps } from '../../components/Dialog/Dialog'
import { Kbd } from '../../components/Kbd/Kbd'

export interface SearchPaletteItem {
  /** Stable identity, independent of a translated title. */
  id: string
  title: ReactNode
  description?: ReactNode
  /** A bare glyph for a place or an action, drawn at 20px. */
  icon?: ReactNode
  /**
   * A picture of the result — a cover, a photograph — drawn as a 36px tile in
   * the icon's place. Only results that have a real picture should get one, so
   * that a tile always means content.
   */
  thumbnail?: ReactNode
  /** What Enter does on this row, shown on the selected row only — "Open", "Run", "Ask". Defaults to `labels.select`. */
  meta?: ReactNode
  /**
   * `inline` sets the title and a muted descriptor on one line, for places and
   * actions; `stacked` gives the description its own line, for a search hit's
   * snippet. Defaults to `stacked` for a row with a thumbnail, `inline` otherwise.
   */
  variant?: 'inline' | 'stacked'
  /** Marks a row that points at evidence — the Ask row — with the accent on its glyph. */
  accent?: boolean
  onSelect: () => void
}

export interface SearchPaletteGroup {
  id: string
  label: string
  items: SearchPaletteItem[]
}

export interface SearchPaletteLabels {
  close: string
  navigate: string
  /** The selected row's hint when the item names none of its own. */
  select: string
  back: string
  /** The phone's text button that closes the sheet. Defaults to `close`. */
  cancel?: string
  /** With a ⌘↵ shortcut of the host's own, the footer names it — "ask the site". */
  askAnywhere?: string
}

export interface SearchPaletteDetail {
  /** Names the answer region for assistive tech. */
  label: string
  content: ReactNode
  onBack: () => void
  onSubmit: () => void
  submitDisabled?: boolean
  /** Names the footer action that hands the answer to a fuller surface, such as "Continue in the panel". */
  continueLabel?: string
  onContinue?: () => void
}

export interface SearchPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  label: string
  inputLabel: string
  placeholder: string
  query: string
  onQueryChange: (query: string) => void
  /** Already filtered results; search and data access belong to the consumer. */
  groups: SearchPaletteGroup[]
  /**
   * Said when nothing matches. When the only rows left are accent rows — the
   * Ask row — it is said above them, so a miss is never a dead end.
   */
  emptyLabel: ReactNode
  labels: SearchPaletteLabels
  /** Optional answer or detail view: the field becomes its composer, and Escape returns to the results. */
  detail?: SearchPaletteDetail
  onContentLinkClick?: () => void
  onCloseAutoFocus?: DialogContentProps['onCloseAutoFocus']
}

const PANEL = 'folio-search-palette top-[max(4rem,15svh)] w-[min(calc(100vw-2rem),38.75rem)] data-[state=open]:animate-[folio-palette-in_var(--duration-base)_var(--ease)] data-[state=closed]:animate-[folio-palette-out_var(--duration-fast)_var(--ease)]'

/**
 * The body's height, eased between whatever the visible view needs.
 *
 * Results change as the reader types and the answer grows as it streams; the
 * panel follows both by its body's height alone, and the rows themselves do
 * not move.
 */
function useBodyHeight(body: RefObject<HTMLDivElement | null>, showingDetail: boolean) {
  useLayoutEffect(() => {
    const node = body.current
    if (!node) return
    const view = node.querySelector<HTMLElement>(showingDetail ? '.folio-search-palette__detail' : '[cmdk-list]')
    if (!view) return
    const fit = () => { node.style.height = `${view.offsetHeight}px` }
    fit()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(fit)
    observer.observe(view)
    return () => observer.disconnect()
  }, [body, showingDetail])
}

/** Search, actions and an optional answer inside one accessible modal. */
export function SearchPalette({
  open, onOpenChange, label, inputLabel, placeholder, query, onQueryChange,
  groups, emptyLabel, labels, detail, onContentLinkClick, onCloseAutoFocus,
}: SearchPaletteProps) {
  const input = useRef<HTMLInputElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  const showingDetail = Boolean(detail)
  useEffect(() => {
    if (open) input.current?.focus()
  }, [open, showingDetail])
  useBodyHeight(body, showingDetail)
  const close = () => onOpenChange(false)
  const missed = query.trim() !== '' && groups.length > 0 && groups.every((group) => group.items.every((item) => item.accent))

  return (
    <CommandDialog
      open={open} onOpenChange={onOpenChange} label={label} inputLabel={inputLabel} shouldFilter={false}
      // Placed on the optical centre rather than near the top edge. It settles
      // in from an 8px lift while its parts follow it in a stagger step apart,
      // and leaves in one quick fade.
      className={PANEL}
      onOpenAutoFocus={(event) => {
        previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
        // The field, not the first control: in the answer view that is the back arrow.
        event.preventDefault()
        input.current?.focus()
      }}
      // A palette opened by a shortcut has no trigger for the dialog to return
      // focus to, so it goes back to whatever held it before opening.
      onCloseAutoFocus={(event) => {
        onCloseAutoFocus?.(event)
        if (!event.defaultPrevented) {
          event.preventDefault()
          previousFocus.current?.focus()
        }
      }}
      onEscapeKeyDown={(event) => {
        if (detail) { event.preventDefault(); detail.onBack() }
      }}
    >
      <div className="folio-search-palette__frame" data-view={detail ? 'answer' : 'list'}>
        <div className="folio-search-palette__field">
          {/* One lead for both views: the search glyph slides out for a back
              arrow, and only the arrow is a control. */}
          <button type="button" className="folio-search-palette__lead" aria-label={labels.back} aria-hidden={!detail || undefined} tabIndex={detail ? 0 : -1} disabled={!detail} onClick={detail?.onBack} onKeyDown={keepFromList}>
            <Search size={20} aria-hidden data-glyph="search" />
            <ArrowLeft size={20} aria-hidden data-glyph="back" />
          </button>
          {detail
            ? <DetailField input={input} inputLabel={inputLabel} placeholder={placeholder} query={query} onQueryChange={onQueryChange} detail={detail} />
            : <CommandInput ref={input} icon={false} aria-label={inputLabel} placeholder={placeholder} value={query} onValueChange={onQueryChange} autoComplete="off" spellCheck={false} />}
          <Kbd aria-hidden className="folio-search-palette__esc">esc</Kbd>
          <button type="button" className="folio-search-palette__cancel" onClick={close}>{labels.cancel ?? labels.close}</button>
        </div>
        <div ref={body} className="folio-search-palette__body">
          <CommandList label={label} inert={showingDetail} aria-hidden={showingDetail || undefined}>
            <CommandEmpty>{emptyLabel}</CommandEmpty>
            {missed && <p className="folio-search-palette__none">{emptyLabel}</p>}
            {groups.map((group) => (
              <CommandGroup key={group.id} heading={<span className="folio-search-palette__heading">{group.label}</span>}>
                {group.items.map((item) => <SearchRow key={item.id} item={item} hint={item.meta ?? labels.select} />)}
              </CommandGroup>
            ))}
          </CommandList>
          {detail && <div className="folio-search-palette__detail" role="region" aria-label={detail.label} aria-live="polite" onKeyDown={keepFromList} onClick={(event) => {
            if ((event.target as HTMLElement).closest('a')) onContentLinkClick?.()
          }}>{detail.content}</div>}
        </div>
        <CommandFooter className="folio-search-palette__footer">
          {detail ? <>
            <CommandHint keys={['esc']}>{labels.back}</CommandHint>
            {detail.onContinue && detail.continueLabel && <button type="button" className="folio-search-palette__continue" onClick={detail.onContinue}>{detail.continueLabel}<ArrowUpRight size={14} aria-hidden /></button>}
          </> : <>
            <CommandHint keys={['↑', '↓']}>{labels.navigate}</CommandHint>
            <CommandHint keys={['esc']}>{labels.close}</CommandHint>
            {labels.askAnywhere && <CommandHint keys={['⌘', '↵']} className="folio-search-palette__ask-anywhere">{labels.askAnywhere}</CommandHint>}
          </>}
        </CommandFooter>
      </div>
    </CommandDialog>
  )
}

/** One result: a bare glyph or a picture tile, a title, its descriptor, and the selected row's hint. */
function SearchRow({ item, hint }: { item: SearchPaletteItem; hint: ReactNode }) {
  const variant = item.variant ?? (item.thumbnail ? 'stacked' : 'inline')
  return (
    <CommandItem value={item.id} onSelect={item.onSelect} className="folio-search-palette__item" data-variant={variant} data-accent={item.accent || undefined}>
      {item.thumbnail
        ? <span className="folio-search-palette__thumb">{item.thumbnail}</span>
        : item.icon && <span className="folio-search-palette__icon">{item.icon}</span>}
      <span className="folio-search-palette__result">
        <span className="folio-search-palette__title">{item.title}</span>
        {item.description && <span className="folio-search-palette__description">{item.description}</span>}
      </span>
      <span aria-hidden className="folio-search-palette__hint">{hint}<Kbd>↵</Kbd></span>
    </CommandItem>
  )
}

/**
 * The keys the command list takes for itself: moving its highlight, and running
 * the highlighted row with Enter, which it does by cancelling the key. The
 * detail view has no list, and needs them back — Enter submits the question or
 * follows a link, and the others move the caret or scroll the answer — so they
 * stop here instead of reaching it.
 */
const LIST_KEYS = new Set(['Enter', 'Home', 'End', 'ArrowUp', 'ArrowDown'])

function keepFromList(event: KeyboardEvent<HTMLElement>) {
  if (LIST_KEYS.has(event.key)) event.stopPropagation()
}

interface DetailFieldProps {
  input: RefObject<HTMLInputElement | null>
  inputLabel: string
  placeholder: string
  query: string
  onQueryChange: (query: string) => void
  detail: SearchPaletteDetail
}

/** The answer view's field: the follow-up composer. Backspace on an empty field goes back. */
function DetailField({ input, inputLabel, placeholder, query, onQueryChange, detail }: DetailFieldProps) {
  return (
    <form className="folio-search-palette__input" onKeyDown={(event) => {
      keepFromList(event)
      if (event.key === 'Backspace' && !query) { event.preventDefault(); detail.onBack() }
    }} onSubmit={(event) => {
      event.preventDefault()
      if (query.trim() && !detail.submitDisabled) detail.onSubmit()
    }}>
      <input ref={input} aria-label={inputLabel} placeholder={placeholder} value={query} onChange={(event) => onQueryChange(event.target.value)} autoComplete="off" />
    </form>
  )
}

export interface SearchExcerptProps {
  segments: ReadonlyArray<{ text: string; highlighted: boolean }>
}

/** Render query highlights as text, never as consumer-supplied HTML. */
export function SearchExcerpt({ segments }: SearchExcerptProps) {
  return <>{segments.map((segment, index) => segment.highlighted
    ? <mark className="folio-search-palette__highlight" key={index}>{segment.text}</mark>
    : segment.text)}</>
}
