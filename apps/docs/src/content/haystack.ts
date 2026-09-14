import propsJson from '@/generated/props.json'
import { COMPONENTS } from './registry'

/**
 * Everything about a component a reader might plausibly type.
 *
 * The name and the summary are the obvious half. The rest is the half that
 * makes a search useful rather than decorative: someone looking for
 * `aria-sort`, `asChild` or "focus trap" is looking for a component, and
 * matching only titles sends them away empty.
 *
 * This used to live in the sidebar's own filter. The sidebar's filter is gone —
 * it was a second search box beside ⌘K, answering the same question worse — so
 * the reach moved to the palette rather than being deleted with it.
 *
 * Short tokens only — prop NAMES and types, keyboard keys, the group. Not the
 * prose. cmdk renders an item's keywords into the DOM, so passing every prop
 * description put forty thousand characters of documentation into the text of
 * every page on the site; `haystack.test.ts` holds the line.
 *
 * The reach that matters survives it: someone types `aria-sort` or `asChild`,
 * and those are names.
 *
 * Built once at module load, from data the build already produced.
 */
export const SEARCH_TERMS = new Map<string, string[]>(
  COMPONENTS.map((entry) => {
    type Prop = { name: string; type: string }
    const source = (propsJson as Record<string, { components?: { name: string; props?: Prop[] }[] }>)[entry.dir]
    const props = (source?.components ?? []).flatMap((component) => [
      component.name,
      ...(component.props ?? []).flatMap((prop) => [
        prop.name,
        ...(prop.type.match(/[A-Za-z_$][\w$-]*/g) ?? []),
      ]),
    ])
    return [
      entry.slug,
      [...new Set([
        entry.dir,
        entry.group,
        ...(entry.keyboard ?? []).flatMap((row) => row.keys),
        ...props,
      ].filter(Boolean))],
    ]
  }),
)
