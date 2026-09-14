import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { render } from '@testing-library/react'
import {
  Accordion,
  AccordionItem,
  Collapsible,
  CollapsibleContent,
  CollapsibleSection,
  CollapsibleTrigger,
} from '../index'

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..')
const KEYFRAMES = join(SRC, 'styles', 'keyframes.css')

/** Every `.ts`/`.tsx` under a source tree, recursively. */
const sourceFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.tsx?$/.test(entry) ? [path] : []
  })

const COMPONENT_SOURCES = [
  ...sourceFiles(join(SRC, 'components')),
  ...sourceFiles(join(SRC, 'charts')),
].filter((file) => !/\.test\.tsx?$/.test(file))

const COMPONENT_TEXT = COMPONENT_SOURCES.map((file) => readFileSync(file, 'utf8')).join('\n')

/**
 * Only the quoted string literals — which is where a class list lives and a
 * bare JSX attribute does not. Checking a `[class*='…']` needle against the
 * whole file is what a first pass at this test did, and it passed on the very
 * selector it was written to catch: `data-folio-animated` contains the substring
 * `folio-anim`, so the dead selector looked alive.
 */
const CLASS_LITERALS = (COMPONENT_TEXT.match(/'[^'\n]*'|"[^"\n]*"/g) ?? []).join('\n')

const withoutComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '')

/** The body of the one `@media (prefers-reduced-motion: reduce)` block, comments stripped. */
function reducedMotionBlock(): string {
  const css = withoutComments(readFileSync(KEYFRAMES, 'utf8'))
  const start = css.indexOf('@media (prefers-reduced-motion: reduce)')
  if (start === -1) return ''
  const open = css.indexOf('{', start)
  let depth = 0
  for (let index = open; index < css.length; index += 1) {
    if (css[index] === '{') depth += 1
    else if (css[index] === '}') {
      depth -= 1
      if (depth === 0) return css.slice(open + 1, index)
    }
  }
  return ''
}

interface Rule {
  selectors: string[]
  body: string
}

const rulesIn = (block: string): Rule[] =>
  [...block.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({
    selectors: selector
      .split(',')
      .map((one) => one.trim())
      .filter(Boolean),
    body,
  }))

/**
 * The reduced-motion rule is the only accessibility promise in this package
 * that no component has to opt into, and the four bugs that produced these
 * tests were all the same shape: the rule was narrower than the documentation
 * said it was, and nothing failed.
 *
 * What these tests can and cannot do is worth stating, because the gap is the
 * reason `apps/docs/e2e/` exists. jsdom parses no stylesheet, evaluates no
 * media query and runs no animation, so NONE of this asserts that a panel
 * actually holds still. It asserts the two things that are checkable without
 * an engine: that the rule is written to cover everything rather than an
 * opt-in list, and that no component animates outside what it covers.
 */
describe('prefers-reduced-motion', () => {
  it('cancels motion for everything, not for an opt-in list', () => {
    const universal = rulesIn(reducedMotionBlock()).find((rule) => rule.selectors.includes('*'))

    expect(
      universal,
      'the reduced-motion block must carry a universal rule — an opt-in marker has now been forgotten four times',
    ).toBeDefined()
  })

  it('reaches transitions, not only animations', () => {
    const universal = rulesIn(reducedMotionBlock()).find((rule) => rule.selectors.includes('*'))

    // SheetContent and AppShell's drawer both slide on `transition-transform`.
    // A rule that only names `animation` leaves every one of those running.
    expect(universal?.body, 'the universal rule must cap transition-duration').toMatch(
      /transition-duration:[^;]*!important/,
    )
    expect(universal?.body, 'the universal rule must cap animation-duration').toMatch(
      /animation-duration:[^;]*!important/,
    )
  })

  it('names no selector that matches nothing in the package', () => {
    // `[class*='folio-anim']` sat here for months matching zero elements:
    // Tailwind emits `animate-[folio-collapsible-down_…]`, which does not contain
    // the substring. A dead selector in a kill switch is indistinguishable
    // from a live one until someone reads the built CSS.
    const dead = rulesIn(reducedMotionBlock())
      .flatMap((rule) => rule.selectors)
      .flatMap((selector) => [...selector.matchAll(/\[([^\]]+)\]/g)].map(([, inner]) => inner.trim()))
      .filter((inner) => {
        const substring = /^class\s*\*=\s*['"]([^'"]+)['"]$/.exec(inner)
        // A class needle has to turn up in a class list; an attribute selector
        // has to turn up as an attribute, which is written bare in JSX.
        return substring ? !CLASS_LITERALS.includes(substring[1]) : !COMPONENT_TEXT.includes(inner)
      })

    expect(dead, 'this selector matches no element the package renders').toEqual([])
  })

  it('leaves no animated component without its marker', () => {
    // The enumeration that would have caught all four. `data-folio-animated` is
    // an assertion that a surface's motion is decorative; a file that reaches
    // for a system keyframe and does not make it has forgotten, not decided.
    const unmarked = COMPONENT_SOURCES.filter((file) => {
      const text = readFileSync(file, 'utf8')
      return text.includes('animate-[folio-') && !text.includes('data-folio-animated')
    }).map((file) => file.slice(SRC.length + 1))

    expect(unmarked, 'add data-folio-animated to the animated element').toEqual([])
  })

  it('marks the animated panel of every disclosure this package composes', () => {
    // File-level scanning cannot see this one: Collapsible.tsx would pass on
    // the strength of CollapsibleContent alone while CollapsibleSection, the
    // one its own JSDoc calls "what most call sites want", went unmarked.
    const cases: [string, ReturnType<typeof render>][] = [
      [
        'AccordionItem',
        render(
          <Accordion type="single" collapsible defaultValue="one">
            <AccordionItem value="one" title="Question">
              Answer
            </AccordionItem>
          </Accordion>,
        ),
      ],
      [
        'CollapsibleContent',
        render(
          <Collapsible defaultOpen>
            <CollapsibleTrigger>Toggle</CollapsibleTrigger>
            <CollapsibleContent>Body</CollapsibleContent>
          </Collapsible>,
        ),
      ],
      [
        'CollapsibleSection',
        render(
          <CollapsibleSection title="Advanced" defaultOpen>
            Body
          </CollapsibleSection>,
        ),
      ],
    ]

    for (const [name, { container }] of cases) {
      // Read the attribute rather than selecting on it: jsdom's selector
      // engine does not parse the unescaped `[` inside `animate-[folio-…`, and
      // returns an empty list rather than an error.
      const animated = [...container.querySelectorAll('*')].filter((element) =>
        (element.getAttribute('class') ?? '').includes('animate-[folio-'),
      )

      expect(animated.length, `${name} renders no element on a system keyframe`).toBeGreaterThan(0)
      expect(
        animated.filter((element) => !element.hasAttribute('data-folio-animated')).length,
        `${name} animates an element that carries no data-folio-animated`,
      ).toBe(0)
    }
  })
})
