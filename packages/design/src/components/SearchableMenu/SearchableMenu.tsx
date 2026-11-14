'use client'

import { ChevronDown } from '../../icons'
import { isValidElement, useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { DEV, warn } from '../../lib/warn'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../Command/Command'
import { Popover, PopoverContent, PopoverTrigger } from '../Popover/Popover'

export interface MenuAction {
  /**
   * Stable identity for the row. Not what the filter matches — the label is,
   * and an id a reader would never type is exactly what this used to be.
   */
  id: string
  /** What the row prints. Its text is the first thing the filter matches. */
  label: ReactNode
  /**
   * More text the filter should match, beyond the label's own words.
   *
   * The synonym a reader reaches for first: "download" for Export, "bin" for
   * Delete. Required in practice only when the label prints no text at all.
   */
  keywords?: string[]
  /** Printed at the end of the row. */
  shortcut?: string
  /** Optional group heading. Rows with the same value are shown together. */
  group?: string
  disabled?: boolean
  destructive?: boolean
  onSelect: () => void
}

export interface SearchableMenuProps {
  actions: MenuAction[]
  /** The trigger's text. */
  children: ReactNode
  /** Names the menu for assistive tech. */
  label: string
  searchPlaceholder?: string
  emptyMessage?: string
  align?: 'start' | 'center' | 'end'
  className?: string
}

/** The plain text a label prints, gathered through whatever wraps it. */
function textOf(node: ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join(' ')
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children)
  return ''
}

/**
 * What the filter matches this row on.
 *
 * cmdk derives an item's value from the first string in
 * `[props.value, props.children, ref]`, and only falls back to the row's
 * `textContent` when `value` is absent. This component passes the id as the
 * value, because that is the row's identity and two rows may print the same
 * words — so with the opaque ids an application actually has, the label a
 * reader can SEE scored zero and the menu showed its empty state. Lifting the
 * label's text into the keywords is what makes the visible words match, while
 * the id stays the identity.
 */
function filterKeywords(action: MenuAction): string[] {
  const label = textOf(action.label).trim()
  const extra = action.keywords ?? []

  if (DEV && !label && extra.length === 0) {
    warn({
      code: 'SEARCHABLE_MENU_LABEL_UNREADABLE',
      problem:
        'A SearchableMenu action has a label with no text in it, so the filter has nothing to match and the row can never be found by typing.',
      field: 'actions[].label',
      fix: 'Give the action keywords with the words a reader would type for it, or put text in the label.',
      component: 'SearchableMenu',
    })
  }

  return label ? [label, ...extra] : extra
}

/**
 * A menu of actions you can type into.
 *
 * The fourth corner of a square the system otherwise had three of, and the
 * distinction is worth stating because reaching for the wrong one is easy:
 *
 * | | few options | many options |
 * |---|---|---|
 * | **sets a value** | `Select` | `Combobox` |
 * | **runs an action** | `DropdownMenu` | `SearchableMenu` |
 *
 * A `DropdownMenu` past about a dozen rows stops being scannable, and the
 * usual response — nesting submenus — makes it worse. This is the same list
 * with a filter over it.
 *
 * Not the same thing as `Command`: that is a page-level palette, usually modal
 * and usually bound to ⌘K. This is anchored to a control, like the menu it
 * replaces.
 *
 * The rows are `option`s inside a listbox rather than `menuitem`s, because that
 * is what the filtering pattern requires — the highlight moves through
 * `aria-activedescendant` while focus stays in the input, and a menu cannot do
 * that. The trade is deliberate: a menu that cannot be filtered is worse for
 * the reader than a listbox that runs actions.
 *
 * @example
 * <SearchableMenu label="Actions" actions={ACTIONS}>Actions</SearchableMenu>
 */
export function SearchableMenu({
  actions,
  children,
  label,
  searchPlaceholder = 'Filter…',
  emptyMessage = 'Nothing matches.',
  align = 'start',
  className,
}: SearchableMenuProps) {
  const [open, setOpen] = useState(false)

  // Grouped in declaration order, so a caller controls the arrangement by the
  // order they list actions rather than by an extra prop.
  const groups: { name: string | undefined; items: MenuAction[] }[] = []
  for (const action of actions) {
    const last = groups.at(-1)
    if (last && last.name === action.group) last.items.push(action)
    else groups.push({ name: action.group, items: [action] })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={label}
        className={cn(
          'inline-flex min-h-(--control-h-sm) items-center gap-2 rounded-(--radius-pill) border border-(--rule-2) px-4 text-sm text-(--ink) transition-colors duration-(--duration-fast) hover:border-(--ink)',
          className,
        )}
      >
        {children}
        <ChevronDown size={14} aria-hidden className="shrink-0 text-(--ink-3-aa)" />
      </PopoverTrigger>
      <PopoverContent label={label} align={align} className="w-64 overflow-hidden p-0">
        <Command label={`${label}: ${searchPlaceholder}`} className="rounded-none border-0">
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            {groups.map((group, index) => (
              <div key={group.name ?? index}>
                {index > 0 && <CommandSeparator />}
                <CommandGroup heading={group.name}>
                  {group.items.map((action) => (
                    <CommandItem
                      key={action.id}
                      value={action.id}
                      keywords={filterKeywords(action)}
                      disabled={action.disabled}
                      shortcut={action.shortcut}
                      onSelect={() => {
                        setOpen(false)
                        action.onSelect()
                      }}
                      className={action.destructive ? 'text-(--danger)' : undefined}
                    >
                      {action.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </div>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default SearchableMenu
