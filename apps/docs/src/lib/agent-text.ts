import propsData from '@/generated/props.json'
import examplesData from '@/generated/examples.json'
import { COMPONENTS, type ComponentEntry } from '@/content/registry'
import { FOUNDATIONS } from '@/content/foundations'
import { TEMPLATES } from '@/content/templates'
import { LAWS } from '@/content/principles'
import catalog from '@/generated/catalog'
import { WARNING_CODES } from '@/lib/docs'

/**
 * The site, written for a reader that does not render CSS.
 *
 * A documentation site is two audiences now. The HTML answers the first: it is
 * laid out, it is navigable, it shows the component running. The second reads
 * a fetch response, and everything that makes the first version good — the
 * live preview, the syntax highlighting, the sidebar — is noise to it, while
 * the things it needs most (every prop with its type, the whole example
 * source, the keyboard contract) are the parts spread thinnest across a page.
 *
 * So this is not a scrape of the HTML. It is the same generated data the pages
 * read, arranged for one long sequential read.
 *
 * The format follows llmstxt.org: `/llms.txt` is an index of links,
 * `/llms-full.txt` is everything inline, and each component has its own file
 * so an agent can fetch one component rather than the whole system.
 */

const SITE = 'https://ui.misoto22.com'

/**
 * The theme axes, as the package derives them from its own stylesheets.
 *
 * Written out by hand here until it said there was a `data-accent` attribute,
 * which at the time there was not, and did not mention `data-surface="glass"`,
 * which there was. A list of someone else's file goes stale silently; this one
 * did, and an agent reading it set an attribute that does nothing. The accent
 * later became a real axis and this line needed no edit, which is the shape
 * working rather than a coincidence.
 */
const THEME_AXES = catalog.themeAxes as { axis: string; values: string[]; unset: string | null }[]

interface PropRow {
  name: string
  type: string
  required?: boolean
  defaultValue?: string
  description?: string
}

interface ComponentSource {
  name: string
  description?: string
  props?: PropRow[]
  passthrough?: string[]
  reexport?: string
}

const PROPS = propsData as unknown as Record<string, { components: ComponentSource[] }>
const EXAMPLES = examplesData as unknown as Record<
  string,
  { id: string; title?: string; snippet: string }[]
>

/** A JSDoc block reflows to one paragraph: the line breaks were for a column. */
const flow = (text: string | undefined) => text?.replace(/\s*\n\s*/g, ' ').trim() ?? ''

function propTable(rows: PropRow[]): string {
  if (rows.length === 0) return ''
  const lines = rows.map((row) => {
    const parts = [
      `- \`${row.name}\``,
      row.required ? '(required)' : '',
      `— \`${row.type}\``,
      row.defaultValue ? `default \`${row.defaultValue}\`` : '',
    ].filter(Boolean)
    const head = parts.join(' ')
    const note = flow(row.description)
    return note ? `${head}. ${note}` : `${head}.`
  })
  return lines.join('\n')
}

/** One component, as the whole of what the site knows about it. */
export function componentText(entry: ComponentEntry): string {
  const source = PROPS[entry.dir]
  const primary = source?.components.find((component) => component.name === entry.name)
    ?? source?.components.find((component) => /^[A-Z]/.test(component.name))
  const examples = EXAMPLES[entry.dir] ?? []
  const out: string[] = [
    `# ${entry.name}`,
    '',
    `${entry.summary}`,
    '',
    `- Group: ${entry.group}`,
    `- Import: \`import { ${primary?.name ?? entry.name} } from '${entry.entry}'\``,
    `- Page: ${SITE}/components/${entry.slug}/`,
  ]

  if (entry.related?.length) out.push(`- Related: ${entry.related.join(', ')}`)
  out.push('')

  if (entry.when) out.push('## When to reach for it', '', entry.when, '')

  // Anatomy and best practices sit here, between the summary and the promises,
  // because that is where `packages/design/scripts/emit-agent.mjs` puts them —
  // and the two renderings of one catalog drifting apart is exactly the failure
  // this file exists to avoid. Match that file when either shape changes.
  if (entry.anatomy?.length) {
    out.push(
      '## Anatomy',
      '',
      ...entry.anatomy.map(
        (part) => `- **${part.element}**${part.required ? ' (required)' : ''} — ${part.description}`,
      ),
      '',
    )
  }

  if (entry.practices?.length) {
    // Split rather than interleaved: the two halves are read against each
    // other, and a reader scanning for what NOT to do should not have to filter
    // a mixed list to find it.
    out.push('## Best practices', '')
    for (const [kind, heading] of [
      ['do', 'Do'],
      ['dont', 'Don’t'],
    ] as const) {
      const half = entry.practices.filter((practice) => practice.kind === kind)
      if (half.length === 0) continue
      out.push(`### ${heading}`, '', ...half.map((practice) => `- ${practice.text}`), '')
    }
  }

  if (entry.accessibility?.length) {
    out.push('## Accessibility', '', ...entry.accessibility.map((line) => `- ${line}`), '')
  }

  if (entry.keyboard?.length) {
    out.push(
      '## Keyboard',
      '',
      ...entry.keyboard.map((row) => `- ${row.keys.join(' / ')} — ${row.does}`),
      '',
    )
  }

  for (const part of source?.components ?? []) {
    out.push(`## ${part.name}`, '')
    if (part.reexport) out.push(`Re-export of \`${part.reexport}\`.`, '')
    if (part.description) out.push(flow(part.description), '')
    if (part.props?.length) out.push('### Props', '', propTable(part.props), '')
    if (part.passthrough?.length) {
      out.push(`Also accepts: ${part.passthrough.map((name) => `\`${name}\``).join(', ')}.`, '')
    }
  }

  for (const example of examples) {
    out.push(`## Example — ${example.title ?? example.id}`, '', '```tsx', example.snippet, '```', '')
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n')
}

/** The index: what this is, and where everything lives. */
export function indexText(): string {
  // The website families are components with pages like any other, listed
  // apart because they ship from their own entry point and an agent pasting an
  // import from the wrong one gets a module-not-found rather than a component.
  const website = COMPONENTS.filter((entry) => entry.group === 'Website')
  const websiteEntries = [...new Set(website.map((entry) => `\`${entry.entry}\``))].join(', ')
  const link = (entry: ComponentEntry) =>
    `- [${entry.name}](${SITE}/components/${entry.slug}/llms.txt): ${entry.summary}`
  const out: string[] = [
    '# misoto22 design',
    '',
    '> A monochrome design system for software, writing and photography:',
    '> portable CSS tokens and accessible React primitives. Paper ground,',
    '> near-black mark, and status is the only chroma in the file.',
    '',
    `Install: \`npm install @misoto22/design\`. Styles: \`import '@misoto22/design/styles.css'\`.`,
    'Every component is a client-safe React 19 component; the token layer is',
    'plain CSS and works without React at all.',
    '',
    '## The laws',
    '',
    ...LAWS.flatMap((law) => [
      `${Number(law.n)}. **${law.title}** ${flow(law.body)}`,
      `   Rules out: ${flow(law.rules_out)}`,
    ]),
    '',
    '## Theming',
    '',
    'Attributes that re-point tokens the package already defines. No component',
    'reads any of them, and none of them introduces a token.',
    '',
    ...THEME_AXES.map(
      (axis) =>
        `- \`${axis.axis}\`: ${axis.values.join(' | ')}${axis.unset ? ` (unset = ${axis.unset})` : ''}`,
    ),
    '',
    'An unset attribute is the default; nothing is anchored to `:root`, so an',
    'axis set on any element applies to the subtree below it. `data-accent`',
    're-points one token, `--clay`, which every component reads through',
    '`--accent`; a brand that is none of the shipped values re-points that token',
    'in a stylesheet instead of setting the attribute.',
    '',
    '## When you get it wrong',
    '',
    'Some misuse fails silently — a `Field` whose child is a wrapper puts the',
    'label on the box; an icon-only `Button` with no accessible name renders',
    'perfectly and is invisible to a screen reader. The component says so in',
    'development, with the field that caused it and an imperative fix. Each code',
    'is stable, so it is safe to branch on:',
    '',
    ...WARNING_CODES.map((code) => `- \`${code}\``),
    '',
    '## Components',
    '',
    ...COMPONENTS.filter((entry) => entry.group !== 'Website').map(link),
    '',
    '## Website',
    '',
    `Page-shaped compositions of the components above, imported from ${websiteEntries}.`,
    'The host supplies content, routes and service state.',
    '',
    ...website.map(link),
    '',
    '## Foundations',
    '',
    ...FOUNDATIONS.map((page) => `- [${page.title}](${SITE}/foundations/${page.slug}/): ${flow(page.summary)}`),
    '',
    '## Templates',
    '',
    ...TEMPLATES.map((template) => `- [${template.name}](${SITE}/templates/${template.slug}/): ${template.summary}`),
    '',
    '## Optional',
    '',
    `- [Everything, inline](${SITE}/llms-full.txt) — every component in one file.`,
    `- [Themes](${SITE}/themes/) — the five presets, rendered.`,
    `- [Changelog](${SITE}/changelog/)`,
  ]
  return out.join('\n')
}

/** Everything, for a reader that would rather fetch once. */
export function fullText(): string {
  return [indexText(), '', '---', '', ...COMPONENTS.map(componentText)].join('\n')
}
