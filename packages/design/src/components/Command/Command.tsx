'use client'

import { Command as CommandPrimitive } from 'cmdk'
import { RiSearchLine, type RemixiconComponentType } from '@remixicon/react'
import { isValidElement, type ComponentProps, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

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
  if (!isIconComponent(icon)) return icon
  const Icon = icon
  return <Icon size={16} aria-hidden />
}
import { Dialog, DialogContent, type DialogContentProps } from '../Dialog/Dialog'
import { Kbd } from '../Kbd/Kbd'

/**
 * A filterable list of actions — the ⌘K surface.
 *
 * Built on cmdk rather than on a `Select` or a menu, because the interaction is
 * neither: the list is filtered as you type, the highlighted row moves with the
 * arrow keys while focus STAYS in the input, and Enter runs the highlighted
 * row. That is the ARIA combobox pattern, and it is the part nobody should
 * hand-roll — `aria-activedescendant` moving without focus moving is precisely
 * where a home-made palette stops working with a screen reader.
 *
 * @example
 * <Command label="Command palette">
 *   <CommandInput placeholder="Type a command…" />
 *   <CommandList>
 *     <CommandEmpty>Nothing matches.</CommandEmpty>
 *     <CommandGroup heading="Navigate">
 *       <CommandItem onSelect={go}>Components</CommandItem>
 *     </CommandGroup>
 *   </CommandList>
 * </Command>
 */
export function Command({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      className={cn(
        'flex w-full flex-col overflow-hidden rounded-(--radius-lg) border border-(--panel-border) bg-(--panel-bg) shadow-(--panel-lift) panel-blur',
        className,
      )}
      {...props}
    />
  )
}

/** The filter field. Carries the search icon and the combobox semantics. */
export function CommandInput({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div className="flex items-center gap-3 border-b border-(--rule) px-4">
      <RiSearchLine size={18} aria-hidden className="shrink-0 text-(--ink-3-aa)" />
      <CommandPrimitive.Input
        className={cn(
          'h-13 w-full bg-transparent text-base md:text-[15px] text-(--ink) outline-none placeholder:text-(--ink-3-aa)',
          className,
        )}
        {...props}
      />
    </div>
  )
}

export function CommandList({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      className={cn('max-h-72 overflow-y-auto overflow-x-hidden p-2 scroll-slim', className)}
      {...props}
    />
  )
}

/** Shown when the filter matches nothing. Say what would match, not "no results". */
export function CommandEmpty(props: ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      className="px-3 py-10 text-center text-sm text-(--ink-3-aa)"
      {...props}
    />
  )
}

/**
 * The key-hint strip along the bottom.
 *
 * A palette is a keyboard surface whose keys are invisible: nothing on screen
 * says the arrows move the row or that Enter runs it, and a reader who reaches
 * for the mouse has been failed by the design rather than by themselves.
 *
 * @example
 * <CommandFooter>
 *   <CommandHint keys={['↑', '↓']}>navigate</CommandHint>
 *   <CommandHint keys={['↵']}>open</CommandHint>
 * </CommandFooter>
 */
export function CommandFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 border-t border-(--rule) bg-(--paper-2) px-3.5 py-2',
        className,
      )}
      {...props}
    />
  )
}

export interface CommandHintProps extends Omit<ComponentProps<'span'>, 'children'> {
  /** The keys this hint describes, printed as `Kbd` chips. */
  keys: string[]
  /** What they do — a verb, lowercase, no sentence. */
  children: ReactNode
}

/** One key-and-verb pair inside a `CommandFooter`. */
export function CommandHint({ keys, children, className, ...props }: CommandHintProps) {
  return (
    <span className={cn('flex items-center gap-1.5 mono-meta text-(--ink-3-aa)', className)} {...props}>
      {keys.map((key) => (
        <Kbd key={key}>{key}</Kbd>
      ))}
      {children}
    </span>
  )
}

export function CommandGroup({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      className={cn(
        'overflow-hidden [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:eyebrow [&_[cmdk-group-heading]]:text-(--ink-3-aa)',
        className,
      )}
      {...props}
    />
  )
}

/**
 * A divider between groups.
 *
 * Marked presentational, because ARIA permits a `listbox` to contain only
 * `option` and `group` — and the library renders this as `role="separator"`,
 * which puts a critical `aria-required-children` violation inside every palette
 * that uses one. The grouping is already announced by the groups themselves, so
 * removing the divider from the accessibility tree loses nothing.
 */
export function CommandSeparator({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      role="presentation"
      aria-hidden="true"
      className={cn('my-1 h-px bg-(--rule)', className)}
      {...props}
    />
  )
}

export interface CommandItemProps extends ComponentProps<typeof CommandPrimitive.Item> {
  /** A shortcut printed at the end of the row. */
  shortcut?: string
  /**
   * A leading glyph. Either spelling — `icon={<Settings size={16} />}` passes
   * the element, `icon={Settings}` passes the component and this sizes it.
   *
   * It is what makes a long list scannable — the eye sorts by shape before it
   * reads, and forty identical rows of text defeat that.
   */
  icon?: RemixiconComponentType | ReactNode
  /**
   * A quiet note at the end of the row — what kind of thing this is, or its
   * current state. Not a description: a palette that prints a sentence per row
   * stops being scannable at about six of them.
   */
  meta?: ReactNode
}

export function CommandItem({ shortcut, icon, meta, className, children, ...props }: CommandItemProps) {
  return (
    <CommandPrimitive.Item
      className={cn(
        'flex cursor-pointer items-center gap-3 overflow-hidden rounded-(--radius-row) px-3 py-2.5 text-[15px] text-(--ink-2) outline-none transition-colors duration-(--duration-fast)',
        // The highlighted row is a chosen state, and law 7 says a chosen state
        // reads --accent. The leading rule gives it an edge the eye catches
        // while scrolling, which a fill alone does not.
        //
        // `overflow-hidden` above clips the bar below to the row's own
        // `--radius-row` corner. Without it the bar is a straight-edged
        // absolutely-positioned box that ignores the rounded highlight behind
        // it — invisible at `sharp` (0px radius) and barely off at the
        // default, but at `round` the row's radius outgrows the bar's own
        // inset and the bar pokes past the curve by several pixels. The row
        // is never a clip boundary for anything but itself: padding keeps
        // every child (icon, label, meta, shortcut) inside it already, so
        // clipping to the row's shape costs nothing else. The focus ring
        // is unaffected too — `outline` paints outside the border box, which
        // an element's own `overflow` never clips.
        'relative data-[selected=true]:bg-(--accent-muted) data-[selected=true]:text-(--ink)',
        'before:absolute before:inset-y-1 before:start-0 before:w-0.5 before:rounded-(--radius-pill) before:bg-transparent data-[selected=true]:before:bg-(--accent)',
        'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-(--disabled-opacity)',
        className,
      )}
      {...props}
    >
      {icon && (
        <span className="grid size-4 shrink-0 place-items-center text-(--ink-3-aa) [&_svg]:size-4">
          {iconNode(icon)}
        </span>
      )}
      {children}
      {meta && <span className="ms-auto ps-3 mono-meta text-(--ink-3-aa)">{meta}</span>}
      {shortcut && <Kbd className={cn(meta ? '' : 'ms-auto')}>{shortcut}</Kbd>}
    </CommandPrimitive.Item>
  )
}

export interface CommandDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Names the palette for assistive tech. */
  label: string
  /**
   * Names the search field when it should read differently from the dialog —
   * a "Search records" field inside a "Library search" palette. Defaults to
   * `label`. An `aria-label` on `CommandInput` cannot do this: the field is
   * labelled by reference, and a reference outranks an `aria-label`.
   */
  inputLabel?: string
  children: ReactNode
  /**
   * Pass `false` when the host has already filtered the rows — a server search
   * or an index of its own. The palette would otherwise filter them a second
   * time against the input and hide results the host meant to show.
   */
  shouldFilter?: boolean
  /** Runs as the dialog moves focus in. Prevent the default to place focus yourself. */
  onOpenAutoFocus?: DialogContentProps['onOpenAutoFocus']
  /**
   * Runs as the dialog hands focus back on close. The default returns it to a
   * `DialogTrigger`, and a palette opened by a shortcut has none, so focus falls
   * to the page. Prevent the default and focus what opened it.
   */
  onCloseAutoFocus?: DialogContentProps['onCloseAutoFocus']
  /** Runs before Escape closes the dialog. Prevent the default to keep it open, as a nested view stepping back does. */
  onEscapeKeyDown?: DialogContentProps['onEscapeKeyDown']
}

/**
 * The palette in a modal, which is how it is nearly always used.
 *
 * The dialog's own padding is removed: a palette is edge-to-edge, and its input
 * is the first thing focus lands on.
 */
export function CommandDialog({
  open,
  onOpenChange,
  label,
  inputLabel,
  children,
  shouldFilter,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onEscapeKeyDown,
}: CommandDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={label}
        hideTitle
        showClose={false}
        onOpenAutoFocus={onOpenAutoFocus}
        onCloseAutoFocus={onCloseAutoFocus}
        onEscapeKeyDown={onEscapeKeyDown}
        // Above centre, not at it. A palette is read as a layer over the page
        // rather than as a message about it, and centring it puts the list
        // under the reader's own hands on a laptop.
        // `scrollbar-gutter: auto` undoes the `stable` that `Dialog`'s own
        // `scroll-slim` sets. The dialog never scrolls — the list inside it
        // does — but the reserved gutter was still there, so the list stopped
        // thirteen pixels short of the panel and drew its own hairline inside
        // an empty channel. Two bars, one of them permanently blank.
        className="top-[10vh] w-[min(94vw,44rem)] translate-y-0 overflow-hidden p-0 [scrollbar-gutter:auto]"
      >
        {/* The modal has the whole screen, so its list may be taller than the
            default an inline menu should keep.

            `scroll-hairline` rather than `scroll-slim`: eleven pixels of grey
            down the side of a palette is the widest thing in it. */}
        <Command
          label={inputLabel ?? label}
          shouldFilter={shouldFilter}
          className="rounded-none border-0 [&_[cmdk-list]]:max-h-[26rem] [&_[cmdk-list]]:scroll-hairline"
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

export default Command
