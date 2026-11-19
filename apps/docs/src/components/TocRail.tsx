'use client'

import { useEffect, useRef, useState } from 'react'
import { HEADING_ICON } from '@/content/icons'

export interface TocItem {
  /** The heading's `id`. What the rail links to and what the spy watches. */
  id: string
  label: string
  /** 2 for a section, 3 for the level beneath it. Anything deeper is ignored. */
  level: number
}

export interface TocRailProps {
  /**
   * The element whose headings the rail lists, as a CSS selector.
   *
   * Read out of the DOM rather than handed in as a list, and that is the whole
   * design of this thing: a page's outline is spread through its JSX, a tab
   * swaps half of it out from under any list written beside it, and every page
   * that had to author its own would eventually author one that had gone
   * stale. Anything inside `[data-toc-skip]` is ignored — an example canvas
   * renders real components, and some of them are headings.
   */
  scope?: string
  /**
   * Names the landmark, and is printed above the list.
   *
   * It must be UNIQUE among the page's landmarks. This is a `<nav>`, and a
   * second navigation with the same accessible name is a reader hearing the
   * same answer twice with nothing to tell them apart — axe calls it
   * `landmark-unique` and the site's own end-to-end suite fails on it. The
   * examples and templates that demonstrate a contents rail of their own are
   * named "Section links" and "Contents" for exactly this reason.
   */
  label: string
  /**
   * Number the outline — 1, 2, 3 for sections and 1.1, 1.2 beneath.
   *
   * On by default. Turn it off where the headings already carry their own
   * sequence, or where the outline is a set of places rather than an order:
   * two numbering systems disagreeing about the same heading is worse than
   * neither, and it happens in the one place whose job is saying where you are.
   */
  numbered?: boolean
  /**
   * Show a section's sub-headings only while it is the section being read.
   *
   * On by default, and it is what keeps the rail shorter than the screen. A
   * sticky block cannot be scrolled past its own bottom, so a thirty-entry
   * outline listed in full puts its last third out of reach; giving the rail
   * its own scrollbar was the first fix and the wrong one, because a rail that
   * has to be scrolled is competing with the page for the same gesture.
   */
  collapsible?: boolean
  /**
   * Draw each heading's glyph from `HEADING_ICON` in place of its number.
   *
   * For a page whose `SectionHeading`s carry those glyphs, so the rail and the
   * heading show one mark. A boolean rather than the map itself: the pages that
   * want it are server components, and a component cannot cross into this
   * client one as a prop. A heading with no glyph keeps its number.
   */
  glyphs?: boolean
  className?: string
}

/** "1", "2", … for sections; "1.1", "1.2", … for the level beneath. */
export function numberToc(items: TocItem[]): string[] {
  const top = items.length > 0 ? Math.min(...items.map((item) => item.level)) : 0
  let major = 0
  let minor = 0
  return items.map((item) => {
    if (item.level <= top) {
      major += 1
      minor = 0
      return String(major)
    }
    minor += 1
    return `${major}.${minor}`
  })
}

/** Whether two outlines say the same thing, so an idle mutation costs nothing. */
function sameOutline(a: TocItem[], b: TocItem[]): boolean {
  return (
    a.length === b.length &&
    a.every((item, i) => item.id === b[i]?.id && item.label === b[i]?.label && item.level === b[i]?.level)
  )
}

/**
 * Where you are in the page, as a rail beside it.
 *
 * A documentation page is a stack of sections with no edge visible from the
 * middle of it: a reader three screens down cannot see that examples exist
 * below, and has no way back to the section above but scrolling. That is the
 * gap this fills, and it is why it is on every long page rather than on the
 * ones that happen to have asked.
 *
 * It is a real grid or flex COLUMN with a `sticky` block inside it, never a
 * floating overlay, so it can never cover the prose. The sticky offset is
 * `--scroll-offset`, the same token every heading's `scroll-margin-top` uses,
 * so the rail and the heading it points at come to rest against the same line.
 *
 * The active entry is set in ink at medium weight, and there is no sliding bar
 * beside it — the mark was louder than the text it pointed at.
 */
export function TocRail({
  scope = '#content',
  label,
  numbered = true,
  collapsible = true,
  glyphs = false,
  className = '',
}: TocRailProps) {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const root = document.querySelector(scope)
    if (!root) return

    const read = () => {
      const found = [...root.querySelectorAll<HTMLElement>('h2[id], h3[id]')]
        .filter((el) => !el.closest('[data-toc-skip]'))
        .map((el) => ({
          id: el.id,
          label: el.textContent?.trim() ?? '',
          level: el.tagName === 'H3' ? 3 : 2,
        }))
        .filter((item) => item.label !== '')
      // Compared before it is set, so a mutation that changed nothing about the
      // outline — and most of them do not — is not a re-render of the rail and
      // a fresh identity for the effect below to tear itself down over.
      setItems((current) => (sameOutline(current, found) ? current : found))
    }

    read()
    // A tab swaps one panel for another without unmounting the page, and an
    // example canvas fills in after hydration. Neither is a navigation, so
    // nothing else here would notice.
    const observer = new MutationObserver(read)
    observer.observe(root, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [scope])

  // Where a click sent the reader. A ref rather than state: the scroll handler
  // reads it on every frame and must not be torn down and rebuilt to see it
  // change.
  const pinned = useRef<string | null>(null)
  const release = useRef<number | undefined>(undefined)

  /**
   * Follow a clicked entry at once, and hold it until the scroll lands.
   *
   * Clicking section 4 starts a smooth scroll that passes 2 and 3 on the way.
   * Unpinned, the spy reports each one it crosses, so those sections unfold
   * mid-flight and refold on arrival and the rail twitches the whole way down.
   * The timer is the escape hatch: a target near the end of the page may never
   * reach the reading line, and the pin has to release anyway.
   */
  const pin = (id: string) => {
    pinned.current = id
    window.clearTimeout(release.current)
    release.current = window.setTimeout(() => {
      pinned.current = null
    }, 1200)
    setActiveId(id)
  }

  useEffect(() => () => window.clearTimeout(release.current), [])

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return

    const onScroll = () => {
      // A reading line a quarter down the viewport, not the top edge: a heading
      // is "the one being read" from the moment it clears the masthead, not
      // once it has left the screen.
      const line = window.innerHeight * 0.28
      let current = sections[0]
      for (const section of sections) {
        if (section.getBoundingClientRect().top - line <= 0) current = section
      }
      if (!current) return
      if (pinned.current) {
        // Release as soon as the scroll agrees with the click.
        if (current.id !== pinned.current) return
        pinned.current = null
      }
      setActiveId(current.id)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [items])

  if (items.length === 0) return null

  const numbers = numberToc(items)
  const top = Math.min(...items.map((item) => item.level))

  // Each section with the sub-entries under it. Anything before the first
  // section keeps a group of its own so it cannot vanish.
  const groups: { head: TocItem; headIndex: number; subs: { item: TocItem; index: number }[] }[] = []
  items.forEach((item, index) => {
    const last = groups[groups.length - 1]
    if (item.level <= top || !last) groups.push({ head: item, headIndex: index, subs: [] })
    else last.subs.push({ item, index })
  })

  const row = 'flex items-baseline gap-2.5 pe-2 leading-snug transition-colors duration-(--duration-fast)'

  return (
    <nav aria-label={label} className={`print:hidden ${className}`}>
      <div className="sticky top-(--scroll-offset) flex max-h-[calc(100svh-var(--scroll-offset)-2rem)] flex-col overflow-y-auto scroll-slim">
        <p className="m-0 mb-3 text-meta font-medium text-(--ink-3-aa)">{label}</p>

        <ul className="m-0 flex list-none flex-col border-s border-(--rule) p-0">
          {groups.map((group) => {
            const open =
              !collapsible ||
              group.head.id === activeId ||
              group.subs.some(({ item }) => item.id === activeId)
            const active = group.head.id === activeId

            return (
              <li key={group.head.id}>
                <a
                  href={`#${group.head.id}`}
                  onClick={() => pin(group.head.id)}
                  aria-current={active ? 'true' : undefined}
                  aria-expanded={collapsible && group.subs.length > 0 ? open : undefined}
                  className={`${row} py-2 ps-4 text-sm ${
                    active ? 'font-medium text-(--ink)' : 'text-(--ink-3-aa) hover:text-(--ink)'
                  }`}
                >
                  {/* The heading's own glyph where the site has one — the same
                      mark the heading draws — and the outline number where it
                      does not. Two markers on one row would be noise. */}
                  {glyphs && HEADING_ICON[group.head.id] ? (
                    (() => {
                      const Icon = HEADING_ICON[group.head.id]!
                      return <Icon size={15} aria-hidden className="shrink-0 self-center" />
                    })()
                  ) : (
                    numbered && (
                      <span
                        aria-hidden="true"
                        className={`mono-meta shrink-0 text-micro tabular-nums ${
                          active ? 'text-(--ink)' : 'text-(--ink-3-aa)'
                        }`}
                      >
                        {numbers[group.headIndex]}
                      </span>
                    )
                  )}
                  <span>{group.head.label}</span>
                </a>

                {group.subs.length > 0 && open && (
                  <ul className="m-0 flex list-none flex-col p-0">
                    {group.subs.map(({ item, index }) => {
                      const on = item.id === activeId
                      return (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            onClick={() => pin(item.id)}
                            aria-current={on ? 'true' : undefined}
                            className={`${row} py-1.5 ps-8 text-meta ${
                              on ? 'font-medium text-(--ink)' : 'text-(--ink-3-aa) hover:text-(--ink)'
                            }`}
                          >
                            {numbered && (
                              <span
                                aria-hidden="true"
                                className={`mono-meta shrink-0 text-micro tabular-nums ${
                                  on ? 'text-(--ink)' : 'text-(--ink-3-aa)'
                                }`}
                              >
                                {numbers[index]}
                              </span>
                            )}
                            <span>{item.label}</span>
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

export default TocRail
