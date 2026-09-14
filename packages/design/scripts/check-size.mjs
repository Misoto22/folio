#!/usr/bin/env node
/**
 * Two questions a design system should be able to answer about itself, and
 * usually cannot: how big is it, and does importing one component drag in the
 * other forty-six?
 *
 * The second is the one that matters. A package can be perfectly tree-shakeable
 * in principle and not be in practice — one `index.ts` side effect, one
 * component importing a barrel instead of a file, and every consumer ships the
 * calendar to render a badge. Nothing about that is visible in review; it shows
 * up as a bundle that grew and nobody knows when.
 *
 * So this bundles a single component with esbuild and asserts the result stays
 * a small fraction of the whole. The budgets are deliberately loose: they exist
 * to catch a step change, not to police a kilobyte.
 */
import { existsSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')

/** Budgets in kilobytes, minified, before network compression. */
const BUDGET = {
  /**
   * The compiled stylesheet, without the vendored font files.
   *
   * 210 → 115 when the website compositions moved out to `website.css` and
   * `website-base.css` (103.6 kB measured). The sheet still carries the
   * utilities those compositions use, because Tailwind scans all of `src`, but
   * none of their rules. Previously 100 → 210 for seventeen website composition
   * families (206.4 kB measured). Website compositions have their own JS entry
   * and tree-shaking checks below.
   */
  styles: 115,
  /**
   * Everything, bundled and minified — the worst case a consumer can hit.
   *
   * 440 → 445 for tab measurement, drag gestures and shared overlay behavior
   * (440.7 kB measured). The single-component budget remains unchanged.
   *
   * Previously, 435 → 440 for the icon set. Remix Icon carries each glyph as an inline
   * path string where lucide carried an `iconNode` array, and over the
   * thirty-five glyphs this package draws that is 432.9 kB → 436.0. Growth of
   * 0.7%, which is the noise this budget exists NOT to police — the point is a
   * step change, and a step change from swapping an icon set would have looked
   * like the whole set arriving in the bundle rather than three kilobytes.
   * (`diagrams` went the other way, 172.8 → 171.0, for the same reason.)
   */
  everything: 445,
  /**
   * One leaf component, bundled and minified. If this ever approaches
   * `everything`, tree shaking has stopped working and every consumer is
   * paying for the whole set.
   */
  singleComponent: 30,
  /**
   * The charts entry, with its two peers left external.
   *
   * Measured separately because that separation is the point: charts need a
   * rendering engine and an animation runtime, and neither belongs in a bundle
   * that renders a Badge. If this number ever appears inside `everything`, the
   * charts have leaked into the main barrel.
   *
   * Loose, like the others, and for the same reason: it exists to catch a step
   * change rather than a kilobyte. Twenty primitives, the annotation layer, and
   * the sonification, zoom and export subsystems are what this covers — about
   * 143 kB of the package's own code over a 27 kB `tailwind-merge` floor that a
   * consumer of the main entry has already paid for.
   */
  charts: 200,
  /**
   * ONE cartesian chart, bundled alone.
   *
   * The leaf-chart check below cannot see the failure this one exists for.
   * Sparkline needs no rendering engine and composes no chrome, so it stays
   * small however heavy the rest of the entry becomes; a cartesian root
   * statically reaches the brush, the zoom surface, the toolbar and the export
   * path whether or not the page composes them. That is where a UI dependency
   * pulled into optional chrome quietly becomes mandatory for every consumer —
   * it happened once, with Radix Menu and Radix Tooltip behind a five-button
   * toolbar row, and cost 90 kB before anything measured it.
   */
  cartesianChart: 110,
  /**
   * ONE chart, bundled alone.
   *
   * The number that actually matters for this entry, and the one an absolute
   * ceiling cannot express: a page that draws a single sparkline must not ship
   * the sankey layout, the brush and the eleven background patterns. If this
   * approaches `charts`, the entry has stopped being tree-shakeable and every
   * consumer is paying for the whole set.
   *
   * Read it against a floor of about 27 kB, not against zero — that is
   * `tailwind-merge` arriving with `cn`, which every component in the package
   * already pays for and a consumer of the main entry already has. Sparkline's
   * own contribution over that floor is under two kilobytes. Chasing the
   * absolute number here leads to auditing a dependency that is not the
   * charts' to begin with.
   */
  singleChart: 40,
  /**
   * The diagrams entry, which ships from `@misoto22/folio/diagrams`.
   *
   * Measured separately because that separation is the point: five renderers,
   * an orthogonal routing engine and a pan-zoom canvas have no business in a
   * bundle that renders a Badge. If this number ever appears inside
   * `everything`, the figures have leaked into the main barrel.
   *
   * Loose, like the others, and for the same reason — it exists to catch a step
   * change rather than a kilobyte. Most of it is the chrome: the export menu
   * pulls in the dropdown, which pulls in Radix.
   */
  diagrams: 190,
  /**
   * ONE figure, bundled alone.
   *
   * The number that actually matters for this entry: a page that draws one
   * sequence diagram must not ship the workflow lane solver, the minimap and
   * the export pipeline. Read it against a floor of about 27 kB rather than
   * against zero — that is `tailwind-merge` arriving with `cn`, which every
   * component in the package already pays for and a consumer of the main entry
   * already has.
   */
  singleFigure: 55,
  /** Seventeen website families, including their shared Radix primitives. */
  website: 275,
  /** A navigation link must not pull in conversations, galleries or charts. */
  singleWebsiteComponent: 40,
}

const kb = (bytes) => Math.round((bytes / 1024) * 10) / 10

async function bundleSize(contents, external = []) {
  const result = await build({
    stdin: { contents, resolveDir: ROOT, loader: 'js' },
    bundle: true,
    minify: true,
    format: 'esm',
    platform: 'browser',
    write: false,
    external: ['react', 'react-dom', 'react/jsx-runtime', ...external],
    logLevel: 'silent',
  })
  return result.outputFiles[0].contents.byteLength
}

async function main() {
  if (!existsSync(join(DIST, 'index.js'))) {
    throw new Error('dist is missing — run `pnpm build:design` first')
  }

  const failures = []
  const report = []

  const stylesBytes = statSync(join(DIST, 'styles.css')).size
  report.push(['styles.css', kb(stylesBytes), BUDGET.styles])
  if (kb(stylesBytes) > BUDGET.styles) failures.push('styles.css')

  const everything = await bundleSize(`export * from './dist/index.js'`)
  report.push(['whole package', kb(everything), BUDGET.everything])
  if (kb(everything) > BUDGET.everything) failures.push('whole package')

  const single = await bundleSize(
    `import { Badge } from './dist/index.js'\nconsole.log(Badge)`,
  )
  report.push(['one component', kb(single), BUDGET.singleComponent])
  if (kb(single) > BUDGET.singleComponent) failures.push('one component')

  // Recharts and motion are peer dependencies, so a consumer's bundler resolves
  // them once for the whole app. Counting them here would measure their size
  // rather than ours.
  const charts = await bundleSize(
    `export * from './dist/charts/index.js'`,
    ['recharts', 'motion', 'motion/react'],
  )
  report.push(['charts entry', kb(charts), BUDGET.charts])
  if (kb(charts) > BUDGET.charts) failures.push('charts entry')

  // Sparkline is the leaf case on purpose: it needs no rendering engine at
  // all, so anything recharts-shaped showing up in this number means the entry
  // is pulling in siblings a consumer did not ask for.
  const singleChart = await bundleSize(
    `import { Sparkline } from './dist/charts/index.js'\nconsole.log(Sparkline)`,
    ['recharts', 'motion', 'motion/react'],
  )
  report.push(['one chart', kb(singleChart), BUDGET.singleChart])
  if (kb(singleChart) > BUDGET.singleChart) failures.push('one chart')

  // AreaChart rather than Sparkline: this is the entry's heaviest single import
  // and the one that reaches the shared chrome, so it is what a dependency
  // added to an optional feature actually costs a consumer.
  const cartesianChart = await bundleSize(
    `import { AreaChart } from './dist/charts/index.js'\nconsole.log(AreaChart)`,
    ['recharts', 'motion', 'motion/react'],
  )
  report.push(['one cartesian chart', kb(cartesianChart), BUDGET.cartesianChart])
  if (kb(cartesianChart) > BUDGET.cartesianChart) failures.push('one cartesian chart')
  const diagrams = await bundleSize(`export * from './dist/diagrams/index.js'`)
  report.push(['diagrams entry', kb(diagrams), BUDGET.diagrams])
  if (kb(diagrams) > BUDGET.diagrams) failures.push('diagrams entry')

  // Sequence is the leaf case on purpose: it needs no boundary frames and no
  // routing engine, so anything router-shaped in this number means the entry is
  // pulling in siblings a consumer did not ask for.
  const singleFigure = await bundleSize(
    `import { SequenceFigure } from './dist/diagrams/index.js'\nconsole.log(SequenceFigure)`,
  )
  report.push(['one figure', kb(singleFigure), BUDGET.singleFigure])
  if (kb(singleFigure) > BUDGET.singleFigure) failures.push('one figure')

  const websitePeers = ['recharts', 'motion', 'motion/react']
  const website = await bundleSize(`export * from './dist/website/index.js'`, websitePeers)
  report.push(['website entry', kb(website), BUDGET.website])
  if (kb(website) > BUDGET.website) failures.push('website entry')

  const singleWebsite = await bundleSize(
    `import { SiteLink } from './dist/website/index.js'\nconsole.log(SiteLink)`,
    websitePeers,
  )
  report.push(['one website part', kb(singleWebsite), BUDGET.singleWebsiteComponent])
  if (kb(singleWebsite) > BUDGET.singleWebsiteComponent) failures.push('one website part')

  const share = Math.round((single / everything) * 100)
  for (const [name, size, budget] of report) {
    console.log(`  ${name.padEnd(20)} ${String(size).padStart(6)} kB   budget ${budget} kB`)
  }
  console.log(`  one component is ${share}% of the whole package`)

  // The proportion is the real test: an absolute budget can be met by a package
  // that ships everything and simply is not very big yet.
  if (share > 25) failures.push(`tree shaking (one component is ${share}% of everything)`)
  const websiteShare = Math.round((singleWebsite / website) * 100)
  console.log(`  one website part is ${websiteShare}% of the website entry`)
  if (websiteShare > 25) failures.push(`website tree shaking (one part is ${websiteShare}% of the entry)`)

  if (failures.length > 0) {
    console.error(`\ncheck-size: over budget — ${failures.join(', ')}`)
    process.exit(1)
  }
  console.log('check-size: within budget')
}

await main()
