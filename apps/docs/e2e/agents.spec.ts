import { expect, test } from '@playwright/test'
import { readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BRAND_NAME } from '../src/lib/brand'

/**
 * The components the built site actually published, read off the export.
 *
 * Not imported from the registry, because this job downloads `out/` and never
 * runs the generator — the registry now reads generated data, and importing it
 * here made a suite that tests an artifact depend on a source build. Reading
 * the directory is also the stronger assertion: it compares the text against
 * the pages that shipped beside it, rather than against the list both were
 * rendered from.
 */
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'out', 'components')
const SLUGS = readdirSync(OUT)
  .filter((entry) => statSync(join(OUT, entry)).isDirectory())
  .sort()

/**
 * The site has two audiences, and only one of them renders CSS.
 *
 * These check the second one is actually served: that the text exists, that it
 * is derived from the same registry the pages are, and that it carries the
 * parts an agent needs most and a rendered page spreads thinnest — every prop
 * with its type, the keyboard contract, the whole example source.
 */
test('llms.txt lists every component the site publishes', async ({ request }) => {
  const response = await request.get('/llms.txt')
  expect(response.status()).toBe(200)
  const body = await response.text()

  expect(body).toMatch(new RegExp(`^# ${BRAND_NAME.en}$`, 'm'))
  // The laws, the theme axes and the install line: the three things an agent
  // has to know before it writes a single line against this package.
  expect(body).toContain('The accent is ink')
  expect(body).toContain('data-surface')
  expect(body).toContain("npm install @misoto22/design")

  expect(SLUGS.length).toBeGreaterThan(0)
  for (const slug of SLUGS) {
    expect(body, `${slug} missing from llms.txt`).toContain(`/components/${slug}/llms.txt`)
  }
})

test('each component has its own file, with its props and its keyboard', async ({ request }) => {
  const response = await request.get('/components/button/llms.txt')
  expect(response.status()).toBe(200)
  const body = await response.text()

  expect(body).toContain('# Button')
  expect(body).toContain("import { Button } from '@misoto22/design'")
  // A prop table is the part a rendered page spreads over the most pixels.
  expect(body).toContain('`iconOnly`')
  expect(body).toContain('## Keyboard')
  expect(body).toContain('## Example')
})

test('a component names the specifier it actually ships from', async ({ request }) => {
  // The package ships from three entry points, and this line is the half an
  // agent acts on without checking. A component documented under the root
  // import is not a broken link — it is an instruction that throws in someone's
  // project, and both split entries printed the root one until the catalog was
  // taught which specifier each component lives behind.
  const cases = [
    ['button', 'Button', '@misoto22/design'],
    ['bar-chart', 'BarChart', '@misoto22/design/charts'],
    ['heatmap', 'Heatmap', '@misoto22/design/charts'],
    ['architecture-figure', 'ArchitectureFigure', '@misoto22/design/diagrams'],
  ] as const

  for (const [slug, name, specifier] of cases) {
    const body = await (await request.get(`/components/${slug}/llms.txt`)).text()
    expect(body, `${name} names the wrong entry point`).toContain(
      `import { ${name} } from '${specifier}'`,
    )
  }
})

test('a component with no page of its own is not published as text either', async ({ request }) => {
  const response = await request.get('/components/not-a-component/llms.txt')
  expect(response.status()).toBe(404)
})

test('llms-full.txt carries every component inline', async ({ request }) => {
  const response = await request.get('/llms-full.txt')
  expect(response.status()).toBe(200)
  const body = await response.text()

  for (const slug of SLUGS) {
    // The heading is the component's name; the slug is that name in kebab-case,
    // which is the one identity the package guarantees (see catalog.test.ts).
    const name = slug.replace(/(^|-)([a-z])/g, (_, dash, letter) => letter.toUpperCase())
    expect(body, `${name} missing from llms-full.txt`).toContain(`# ${name}\n`)
  }
})

test('the same text is served under the extension an agent guesses', async ({ request }) => {
  // An agent holding a page URL appends `.md` and fetches, because enough
  // documentation sites now serve that for the guess to be worth making. It has
  // to be the SAME bytes as the llms.txt beside it: two URLs that drift are
  // worse than one, and copying rather than re-rendering is what prevents it.
  const markdown = await request.get('/components/combobox.md')
  expect(markdown.status()).toBe(200)

  const canonical = await request.get('/components/combobox/llms.txt')
  expect(await markdown.text()).toBe(await canonical.text())

  const index = await request.get('/index.md')
  expect(index.status()).toBe(200)
  expect(await index.text()).toBe(await (await request.get('/llms.txt')).text())
})

test('every component published as text is published as markdown too', async ({ request }) => {
  // A partial mapping is the failure this catches: the head of every component
  // page promises a .md, so one missing is a 404 an agent was told to expect.
  for (const slug of SLUGS) {
    const response = await request.get(`/components/${slug}.md`)
    expect(response.status(), `/components/${slug}.md is not served`).toBe(200)
  }
})

test('a component page declares its markdown, in both languages', async ({ request }) => {
  for (const path of ['/components/combobox/', '/zh/components/combobox/']) {
    const html = await (await request.get(path)).text()
    expect(html, `${path} does not declare its markdown`).toContain(
      'type="text/markdown"',
    )
    expect(html).toContain('/components/combobox.md')
  }
})

test('a crawler is pointed at both the sitemap and the text', async ({ request, page }) => {
  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toContain('Sitemap: https://ui.misoto22.com/sitemap.xml')

  const sitemap = await (await request.get('/sitemap.xml')).text()
  expect(sitemap).toContain('https://ui.misoto22.com/components/button/')
  expect(sitemap).toContain('https://ui.misoto22.com/zh/components/button/')

  // Declared in the document too, so an agent that landed on a page rather
  // than on the root still finds it.
  await page.goto('/')
  await expect(page.locator('link[rel="alternate"][href="/llms.txt"]')).toHaveCount(1)
})

test('a component page points at its own text, not just the whole site', async ({ request }) => {
  // The root layout advertises the index and the everything-inline file. Landing
  // on one component and being offered only those two is the expensive path:
  // llms-full.txt is every component, and the reader wants the one it is on.
  //
  // Asserted against the served HTML rather than the hydrated DOM, because the
  // reader this is for does not run the JavaScript that would produce one.
  for (const path of ['/components/combobox/', '/zh/components/combobox/']) {
    const html = await (await request.get(path)).text()
    expect(html, `${path} does not offer its own text`).toContain(
      'href="https://ui.misoto22.com/components/combobox/llms.txt"',
    )
  }
})
