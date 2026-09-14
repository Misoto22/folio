'use client'

import { useEffect, useRef, type KeyboardEvent, type ReactNode, type RefObject } from 'react'
import { RiArrowLeftLine, RiCloseLine } from '@remixicon/react'
import { Badge } from '../../components/Badge/Badge'
import { Button } from '../../components/Button/Button'
import { CommandDialog, CommandEmpty, CommandFooter, CommandGroup, CommandHint, CommandInput, CommandItem, CommandList } from '../../components/Command/Command'
import type { DialogContentProps } from '../../components/Dialog/Dialog'
import { Input } from '../../components/Input/Input'

export interface SearchPaletteItem {
  /** Stable identity, independent of a translated title. */
  id: string
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  meta?: ReactNode
  onSelect: () => void
}

export interface SearchPaletteGroup {
  id: string
  label: string
  items: SearchPaletteItem[]
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
  emptyLabel: ReactNode
  labels: { close: string; navigate: string; select: string; back: string }
  /** Optional answer or detail view, with Escape returning to the results. */
  detail?: { label: string; content: ReactNode; onBack: () => void; onSubmit: () => void; submitDisabled?: boolean }
  onContentLinkClick?: () => void
  onCloseAutoFocus?: DialogContentProps['onCloseAutoFocus']
}

/** Search, actions and an optional result detail inside one accessible modal. */
export function SearchPalette({
  open, onOpenChange, label, inputLabel, placeholder, query, onQueryChange,
  groups, emptyLabel, labels, detail, onContentLinkClick, onCloseAutoFocus,
}: SearchPaletteProps) {
  const input = useRef<HTMLInputElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  const showingDetail = Boolean(detail)
  useEffect(() => {
    if (open) input.current?.focus()
  }, [open, showingDetail])
  const close = () => onOpenChange(false)
  const field = { input, inputLabel, placeholder, query, onQueryChange }

  return (
    <CommandDialog
      open={open} onOpenChange={onOpenChange} label={label} inputLabel={inputLabel} shouldFilter={false}
      onOpenAutoFocus={() => {
        previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
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
      {detail
        ? <SearchDetail {...field} detail={detail} labels={labels} onClose={close} onContentLinkClick={onContentLinkClick} />
        : <SearchResults {...field} label={label} groups={groups} emptyLabel={emptyLabel} closeLabel={labels.close} onClose={close} />}
      <CommandFooter className="m22-search-palette__footer">
        {!detail && <CommandHint keys={['↑', '↓']}>{labels.navigate}</CommandHint>}
        <CommandHint keys={['↵']}>{labels.select}</CommandHint>
        <CommandHint keys={['esc']}>{detail ? labels.back : labels.close}</CommandHint>
      </CommandFooter>
    </CommandDialog>
  )
}

interface SearchFieldProps {
  input: RefObject<HTMLInputElement | null>
  inputLabel: string
  placeholder: string
  query: string
  onQueryChange: (query: string) => void
  onClose: () => void
}

interface SearchResultsProps extends SearchFieldProps {
  label: string
  groups: SearchPaletteGroup[]
  emptyLabel: ReactNode
  closeLabel: string
}

/** The combobox over the host's groups, which the palette never filters again. */
function SearchResults({ input, inputLabel, placeholder, query, onQueryChange, onClose, label, groups, emptyLabel, closeLabel }: SearchResultsProps) {
  return (
    <>
      <div className="m22-search-palette__search">
        <CommandInput ref={input} aria-label={inputLabel} placeholder={placeholder} value={query} onValueChange={onQueryChange} autoComplete="off" spellCheck={false} />
        <Button variant="ghost" iconOnly aria-label={closeLabel} onClick={onClose} className="m22-search-palette__close"><RiCloseLine size={18} aria-hidden /></Button>
      </div>
      <CommandList label={label}>
        <CommandEmpty>{emptyLabel}</CommandEmpty>
        {groups.map((group) => (
          <CommandGroup key={group.id} heading={<span className="m22-search-palette__heading">{group.label}</span>}>
            {group.items.map((item) => (
              <CommandItem
                key={item.id} value={item.id} icon={item.icon} onSelect={item.onSelect} className="m22-search-palette__item"
                meta={item.meta ? <span className="m22-search-palette__meta">{item.meta}</span> : undefined}
              >
                <span className="m22-search-palette__result">
                  <span>{item.title}</span>
                  {item.description && <span className="m22-search-palette__description">{item.description}</span>}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </>
  )
}

interface SearchDetailProps extends SearchFieldProps {
  detail: NonNullable<SearchPaletteProps['detail']>
  labels: SearchPaletteProps['labels']
  onContentLinkClick?: () => void
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

/** The answer view: a question field over content the host renders. */
function SearchDetail({ input, inputLabel, placeholder, query, onQueryChange, onClose, detail, labels, onContentLinkClick }: SearchDetailProps) {
  return (
    <>
      <form className="m22-search-palette__input" onKeyDown={keepFromList} onSubmit={(event) => {
        event.preventDefault()
        if (query.trim() && !detail.submitDisabled) detail.onSubmit()
      }}>
        <Button variant="ghost" iconOnly aria-label={labels.back} onClick={detail.onBack}><RiArrowLeftLine size={18} aria-hidden /></Button>
        <Input ref={input} aria-label={inputLabel} placeholder={placeholder} value={query} onChange={(event) => onQueryChange(event.target.value)} autoComplete="off" />
        <Badge>{detail.label}</Badge>
        <Button variant="ghost" iconOnly aria-label={labels.close} onClick={onClose}><RiCloseLine size={18} aria-hidden /></Button>
      </form>
      <div className="m22-search-palette__detail" aria-live="polite" onKeyDown={keepFromList} onClick={(event) => {
        if ((event.target as HTMLElement).closest('a')) onContentLinkClick?.()
      }}>{detail.content}</div>
    </>
  )
}

export interface SearchExcerptProps {
  segments: ReadonlyArray<{ text: string; highlighted: boolean }>
}

/** Render query highlights as text, never as consumer-supplied HTML. */
export function SearchExcerpt({ segments }: SearchExcerptProps) {
  return <>{segments.map((segment, index) => segment.highlighted
    ? <mark className="m22-search-palette__highlight" key={index}>{segment.text}</mark>
    : segment.text)}</>
}
