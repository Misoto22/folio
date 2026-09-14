import { describe, expect, it } from 'vitest'
import catalog from '@/generated/catalog'
import { WARNING_CODES } from '@/lib/docs'
import { getMessages } from '@/i18n/messages'
import { LOCALES } from '@/i18n/locales'
import { componentText, indexText } from '@/lib/agent-text'
import { COMPONENTS } from '@/content/registry'
import * as website from '@misoto22/folio/website'

/**
 * The site has fallen behind the package three times, in the same way each
 * time: the package gained something an agent can use, nobody thought about
 * this side, and the page kept describing the version before it. Once it
 * advertised a `data-accent` attribute the stylesheets did not have. Twice it
 * listed a way in that had been superseded. Every one of those was invisible
 * until somebody read the page against the package.
 *
 * So the drift is a test rather than a habit. What the package publishes about
 * itself — its theme axes, its warning codes — is read from the artifact its
 * build emits, and these assert the site actually says it. A number typed into
 * prose is the other half of the same failure, and gets the same treatment.
 */
const WEBSITE = COMPONENTS.filter((entry) => entry.group === 'Website')

describe('the site keeps up with the package', () => {
  it.each(WEBSITE)('advertises a real public import for the $name family', (entry) => {
    const text = componentText(entry)
    const imported = text.match(/- Import: `import \{ (\w+) \}/)?.[1]
    expect(imported).toBeTruthy()
    expect(website).toHaveProperty(imported!)
    expect(text).toContain(`- Page: https://ui.misoto22.com/components/${entry.slug}/`)
  })

  it('indexes the website families under their own heading, at their component pages', () => {
    // The /patterns/ section is retired and only redirects; an agent handed the
    // old address pays a hop for nothing, and the index is the one place it
    // would learn the address from.
    const index = indexText()
    expect(index).not.toContain('/patterns/')
    const start = index.indexOf('## Website')
    expect(start).toBeGreaterThan(-1)
    const section = index.slice(start, index.indexOf('\n## ', start + 1))
    expect(section).toContain('@misoto22/folio/website')
    const missing = WEBSITE.filter((entry) => !section.includes(`/components/${entry.slug}/llms.txt`))
    expect(missing.map((entry) => entry.slug)).toEqual([])
  })
  const copy = Object.fromEntries(
    LOCALES.map((locale) => [locale, JSON.stringify(getMessages(locale))]),
  )

  it('names every warning code the package can emit, in the text an agent reads', () => {
    // Listing three of four is worse than listing none: the missing one reads
    // as "not a real code" to anyone who just saw it in their console. Asserted
    // against the emitted index rather than against the constant it renders
    // from — comparing the constant to its own source proves nothing.
    expect(WARNING_CODES.length).toBeGreaterThan(0)

    const index = indexText()
    const missing = WARNING_CODES.filter((code) => !index.includes(code))
    expect(missing).toEqual([])
  })

  it('reads the theme axes from the package rather than listing its own', () => {
    const axes = catalog.themeAxes.map((axis) => axis.axis)
    expect(axes.length).toBeGreaterThan(0)

    const index = indexText()
    const missing = axes.filter((axis) => !index.includes(axis))
    expect(missing).toEqual([])

    // The one that was invented, and is now real. It reaches this page because
    // a selector defines it, which is the whole arrangement: it was written by
    // hand for months, was wrong for months, and nobody had to remember it the
    // day it stopped being wrong.
    expect(axes).toContain('data-accent')
  })

  it('never hard-codes the component count into prose', () => {
    // "twenty-eight thousand for all fifty-two" was true for one release. The
    // count belongs in a placeholder the page fills at render time.
    const written =
      /\b(twelve|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred)[- ](one|two|three|four|five|six|seven|eight|nine)\b/i
    for (const [locale, text] of Object.entries(copy)) {
      expect(text, `${locale} copy spells out a count that will go stale`).not.toMatch(written)
    }
  })

  it('tells a reader how to install the skill for a non-Claude agent', () => {
    // `init` covers the shared path and Claude's. Everything else goes through
    // the ecosystem CLI, and a reader who is not on Claude Code has to be told.
    for (const [locale, text] of Object.entries(copy)) {
      expect(text, `${locale} copy does not mention the shared skills path`).toContain(
        '.agents/skills',
      )
      expect(text, `${locale} copy does not mention npx skills add`).toContain('npx skills add')
    }
  })
})
