/**
 * The foundations pages.
 *
 * Most of them render a slice of the generated token data — the values
 * themselves are never written here, only which categories a page shows and the
 * prose that explains why they are what they are.
 *
 * Two of them have no token category to show. `getting-started` and `agents`
 * document how the package is INSTALLED and how it is READ, and neither
 * question has a custom property behind it. They carry `sections` instead of
 * `categories`, sit in the `guide` group in the rail, and are still foundations
 * pages rather than a second kind of page with its own view: the route, the
 * masthead, the breadcrumb and the search index all already exist here, and a
 * parallel set of them is how two page types drift apart.
 */

/** A term and what it is — an exports map, a set of endpoints, a requirement. */
export interface FoundationRow {
  term: string
  detail: string
}

/** One prose section on a page that documents something other than a token. */
export interface FoundationSection {
  /** Anchor id, so a heading can be linked to directly. */
  id: string
  title: string
  body: string[]
  rows?: FoundationRow[]
  /** Ids from `content/snippets.json`, highlighted at build time. */
  snippets?: string[]
  /**
   * Copy-pasteable blocks that are not in `snippets.json`, printed as typed.
   *
   * Deliberately unhighlighted. Shiki runs inside `generate.mjs` over that one
   * file, and a shell command has almost no syntax to colour — registering a
   * `npx` line in a second file for the sake of two bold words is how a command
   * ends up not being written down at all.
   */
  commands?: { label: string; source: string }[]
}

export interface FoundationPage {
  slug: string
  title: string
  summary: string
  /** Categories from the token extractor, in the order the page shows them. */
  categories: { key: string; title: string; note?: string }[]
  /** Paragraphs under the title. */
  intro: string[]
  /** Prose sections, for a page whose subject is not a set of tokens. */
  sections?: FoundationSection[]
  /**
   * Other foundations pages this one deliberately stops short of.
   *
   * Slugs rather than URLs, so `foundations.test.ts` can fail the build on a
   * pointer to a page that does not exist — which is the failure a "see also"
   * row has, silently, the moment a slug is renamed.
   */
  related?: string[]
  /** Which group in the rail. `foundations` unless said otherwise. */
  group?: 'guide' | 'foundations'
}

export const FOUNDATIONS: FoundationPage[] = [
  {
    slug: 'getting-started',
    title: 'Getting started',
    summary: 'Install it, pick a stylesheet, and render the first control.',
    group: 'guide',
    categories: [],
    related: ['agents', 'colour'],
    intro: [
      'Components ship compiled. You import them; you do not copy them into your project, and there is no CLI that writes a Button into your source tree for you to maintain. That is the trade the package makes: an upgrade is a version bump rather than a diff across forty files you now own.',
      'Four peer dependencies, and only two of them are React. react and react-dom at ^19.0.0 are required; motion and recharts are declared optional and are the price of one entry point — @misoto22/folio/charts imports both, and without them installed it does not resolve. @misoto22/folio/diagrams asks for neither. Everything else the components need — Radix, cmdk, sonner, Remix Icon, react-day-picker, tailwind-merge — is a real dependency and comes down with the package. Node 24 or newer, and the package is ESM only: the exports map carries an import condition and no require, so a CommonJS build will not resolve it.',
      'The rest of this page is the part the README is thinnest on: which of the twelve entries in the exports map you actually want, and what each one leaves out.',
    ],
    sections: [
      {
        id: 'install',
        title: 'Install',
        body: [
          'One package. The styles are a separate import from the components — nothing pulls the CSS in on your behalf, and a project that imports only the components renders unstyled markup rather than an error.',
        ],
        snippets: ['install'],
      },
      {
        id: 'stylesheets',
        title: 'The CSS entry points',
        body: [
          'The choice is really between two recipes. `styles.css` is the whole compiled sheet: Tailwind, the primitives, the roles, the theming axes, the article styles, the keyframes, and the vendored @font-face rules appended to the end. One import, nothing else to decide, and Tailwind arrives with it.',
          'The other recipe is for an app that already compiles Tailwind and does not want a second copy of the utilities. It is three imports — `tokens.css`, `semantic.css`, `keyframes.css` — and the thing worth knowing before you pick it is what those three do not carry.',
          '`data-mode="dark"` and `data-density="compact"` are declared in `tokens.css` and survive. The other five axes — `data-surface`, `data-radius`, `data-rules`, `data-type`, `data-motion` — are declared only in `themes.css`, which is a separate export and is in neither the README recipe nor the snippet above. Write `data-radius="sharp"` without it and the attribute lands on the element and changes nothing. The faces are in `fonts.css`, also separate; the long-form article styles are in `article.css`. Add the ones you want by name.',
        ],
        rows: [
          { term: '@misoto22/folio', detail: 'The components, the types, `cn`, `CONTROL_BASE`, `CONTROL_BORDER`, `isInvalid`, `BRAND`.' },
          {
            term: '/charts',
            detail:
              'The charts, and the only reason the two optional peers exist — it imports `recharts` and `motion/react`. Behind its own entry so a page that renders a Badge pays for neither.',
          },
          {
            term: '/diagrams',
            detail:
              'Five figure renderers and the canvas, toolbar, legend, minimap and inspector a reader explores one with. No peer beyond React.',
          },
          {
            term: '/styles.css',
            detail:
              'Everything the primitives need, compiled: Tailwind, the token, semantic, theme, article and keyframe layers, and the vendored faces. The single-import path. The website stylesheets are not in it.',
          },
          {
            term: '/website.css',
            detail:
              'The styles for `@misoto22/folio/website`, scoped to the compositions. Import it beside `styles.css` or the portable layers when you render one.',
          },
          {
            term: '/website-base.css',
            detail:
              'Document defaults for a page that is a website — body type, heading margins, the site-wide focus ring. Opt-in: an application that embeds a composition leaves it out.',
          },
          { term: '/tokens.css', detail: 'The primitives, plus the default dark swap and the compact density axis.' },
          { term: '/semantic.css', detail: 'The roles a component actually reads — `--background`, `--foreground-muted`, `--border-color`.' },
          { term: '/keyframes.css', detail: 'The animations, and the one reduced-motion rule that stops them.' },
          { term: '/themes.css', detail: 'The five remaining theming axes. Not in the three-layer recipe; add it if you set any of them.' },
          { term: '/fonts.css', detail: 'The vendored @font-face rules. Already appended inside `styles.css`.' },
          { term: '/article.css', detail: 'Long-form prose styling, for the `Article` component.' },
          { term: '/tokens.json + /tokens', detail: 'The same tokens as data — JSON for a build script, and a typed `TOKENS` record with a `TokenName` union for TypeScript.' },
        ],
      },
      {
        id: 'tailwind',
        title: 'Tailwind interop',
        body: [
          'Semantic colours are deliberately not promoted to Tailwind colour utilities. They are consumed with the arbitrary-property syntax — `text-(--ink)`, `bg-(--paper)`, `border-(--rule)` — so adding or recolouring a role is one edit in `semantic.css` and nothing anywhere else. There is no `bg-paper` class and there is not going to be one.',
          'If you compile your own Tailwind, point `@source` at the package’s `dist` so the utilities used inside a library component are generated for your build too, and declare the dark variant against the attribute rather than a class. The `data-mode` attribute goes on `<html>` on purpose: it can be written by an inline script before first paint, with no class list to reconcile and no flash of the wrong theme.',
        ],
        snippets: ['tailwind', 'theme'],
      },
      {
        id: 'first-component',
        title: 'The first component',
        body: [
          'A labelled, required field and the button that submits it. `Field` does the ARIA wiring — `aria-describedby`, `aria-required`, `aria-invalid` — onto the single element child it wraps, which is why hand-rolling a `<label>`, an input and an error div is the one shape this system will not help you with. Two controls inside one `Field` wires neither, silently.',
          'Errors go in `Field`’s `error` prop rather than beside its `hint`: they are one slot, not two stacked messages, and passing `error` already sets `aria-invalid` on the control — so do not also pass `invalid`.',
        ],
        snippets: ['usage'],
      },
    ],
  },
  {
    slug: 'colour',
    title: 'Colour',
    summary: 'A white ground, a near-black mark, three rule weights, and status.',
    related: ['elevation'],
    intro: [
      'The system is monochrome. The ground is paper-white, the mark is near-black, and the only chroma left in the file is status — which is bound to state and never to brand. What used to be carried by hue is carried by weight, by rule, and by reversal.',
      'There are two text steps and nothing lighter. The floor is --ink-3-aa, which clears WCAG AA on white at 6.7:1; every step above it is darker. A tint that would sit below that line is not a colour choice available to this system.',
      'Dark mode is a value swap on the same names, not a second palette. That is why a component never reads a primitive directly: it reads a semantic alias, and the alias re-resolves on its own when the mode attribute flips.',
    ],
    categories: [
      { key: 'colour', title: 'Colour tokens' },
      {
        key: 'data',
        title: 'Data',
        note: 'The one place the system had to answer a question monochrome would rather not be asked: how do you tell six series apart with no hue to spend? Texture answers it — every chart ships fill variants, and this ramp is the SECOND encoding rather than the first. The eight steps are interleaved, so neighbouring series sit as far apart on the lightness ramp as eight steps allow (ΔE 21, against a floor of 15) and each one clears 3:1 on its own ground. Two of the six checks a chromatic palette would pass fail here by design and are stated rather than hidden: the chroma floor (these are greys) and the lightness band (--series-1 is ink). A consumer who needs hue sets data-chart-palette="chroma" rather than hand-picking hexes, or data-chart-palette="accent" to ladder the same eight names out of --clay when the charts have to wear a brand rather than eight categories. --chart-fill and --chart-texture are the only pair in the system that is not the same number on both grounds: ink at 14% over paper is a legible band, and paper-white at 14% over near-black is nothing.',
      },
      {
        key: 'depth',
        title: 'Depth',
        note: 'Four of these draw nothing on purpose: --shadow-sm, --shadow and --shadow-lg resolve to none, and --shadow-color to transparent. A box-shadow in this system is never blurred; --lift is the hard ink offset that replaces the elevation ramp.',
      },
      { key: 'focus', title: 'Focus' },
    ],
  },
  {
    slug: 'typography',
    title: 'Typography',
    summary: 'Three faces, one heading ladder, and nothing above the page title.',
    intro: [
      'Hanken Grotesk for interface, Newsreader for headings and editorial voice, IBM Plex Mono for labels and data. Each stack names a CJK fallback, so a Chinese page renders in a matched face rather than in whatever the platform substitutes.',
      'The heading scale is a single ladder every surface climbs, fluid between a phone and the 1288px page. Nothing sits above --fs-title: a page has exactly one thing larger than its own records. Steps sit close together deliberately — the ladder separates records of the same kind, not a heading from its own sub-heading, so two headings that nest must skip a step.',
    ],
    categories: [{ key: 'type', title: 'Type tokens' }],
  },
  {
    slug: 'space',
    title: 'Space & shape',
    summary: 'The page gutter, the measures, and the five radii.',
    related: ['shape', 'icons', 'elevation'],
    intro: [
      'Measures are capped in ch rather than px, so they track the type they are set in. --measure-record is a ceiling on a listed record’s description, not a width: a narrower column still wins.',
      'One ladder, and one factor that moves the whole of it: every step is a multiple of --radius-factor, so a theme sets one number and the steps keep their proportions. That is what makes nesting safe — two rounded edges separated by a gap of p are concentric only when the inner radius is the outer minus p, and --radius-row and --radius-frame name both directions. A 50% circle is geometry rather than a corner and is not on the ladder at all.',
      'Every component is written in logical properties — ps- and pe- rather than pl- and pr-, start- and end- rather than left- and right- — so a right-to-left document mirrors without a stylesheet of its own. A test fails the build on a physical one, because retrofitting direction into forty components after the fact is a sweep nobody schedules and a failure nobody sees. Flip any example above to RTL.',
    ],
    categories: [
      { key: 'space', title: 'Layout' },
      { key: 'radius', title: 'Radius' },
      {
        key: 'density',
        title: 'Density',
        note: 'The second theming axis, and the only other one. Set data-density="compact" on any container and every control below it tightens — nothing has to be told twice. At the default, a medium control is 44px, the pointer target WCAG 2.5.5 asks for; compact drops it to 36px, which still clears 2.5.8 with room and no longer meets 2.5.5. It is for a dense desktop tool driven by a mouse, and it is a real trade rather than a free one. Flip it on any example above to watch.',
      },
      { key: 'icon', title: 'Icons' },
      { key: 'layer', title: 'Stacking order' },
    ],
  },
  {
    slug: 'shape',
    title: 'Shape',
    summary: 'Five steps from one number, and the arithmetic that keeps two of them concentric.',
    related: ['space', 'elevation'],
    intro: [
      'Five steps, and one number moves all of them. 4px, 6px, 8px, 12px and 999px, each written as calc(N * var(--radius-factor)) rather than as a literal — so a theme sets the factor and the steps keep their ratios instead of drifting out of proportion the way four independently re-typed numbers always do. data-radius="sharp" sets the factor to 0 and the whole system squares off; data-radius="round" sets it to 2 and every step doubles. Both values live in themes.css, which is a separate CSS entry point.',
      'Each step names what it is for, and the assignments are not interchangeable. --radius-xs, 4px, is a mark inside a tight box. --radius-sm, 6px, is a chip, a key, a list row. --radius, 8px, is the CONTROL step — a button, an input, a select trigger and a textarea all draw the same corner, and that agreement is recent: the button used to be a capsule, which beside an 8px field is two different ideas of what a control is, and it was the one inconsistency in the system every reader noticed and no component page could explain. --radius-lg, 12px, is a card, a dialog, a menu panel. --radius-pill is the capsules and the counters — a badge, a status pill, a segmented strip, a progress track.',
      'A true circle is not on the ladder and never squares off with the theme. An avatar, a status dot, a spinner and a radio are rounded-full, because a radio is round so that it cannot be mistaken for a checkbox — that is geometry carrying meaning, not a corner treatment.',
      'THE NESTING LAW. Two rounded edges separated by a gap of p are concentric only when the inner radius is the outer minus p. Anything else pinches: the gap narrows as it turns, and that is the mismatch you see a moment before you can name it. Both directions are named so no surface has to guess. --radius-row subtracts — max(0px, calc(var(--radius-lg) - 0.375rem)), which is 12px minus the 6px a panel pads its rows by, so 6px. --radius-frame adds — calc(var(--radius-lg) + 1rem * var(--radius-gate)), so 28px for a frame sitting 16px outside a 12px panel.',
      '--radius-gate is min(1, var(--radius-factor)), and it guards the adding direction only. A frame’s air is a fixed number of pixels, so an ungated --radius-lg + 16px would leave a rounded frame around a perfectly square panel the moment the theme went sharp; gated, the frame collapses with everything else. The subtracting direction needs no gate because max(0px, …) already floors it. Do the arithmetic once at factor 1 and it holds at 0 and at 2, which is the only reason a theming axis this blunt is safe to ship.',
    ],
    categories: [
      {
        key: 'radius',
        title: 'Radius',
        note: 'Read out of the package CSS at build time. The authority on which step goes where is the prose above — xs a mark inside a tight box, sm a chip or a list row, --radius a control, lg a card or a panel, pill a capsule or a counter.',
      },
    ],
  },
  {
    slug: 'elevation',
    title: 'Elevation',
    summary: 'Nothing rises. Four shadow tokens exist to make sure of it.',
    related: ['colour', 'space'],
    intro: [
      'There is no elevation ramp, and the four tokens named after one are there to neutralise it. --shadow-sm, --shadow and --shadow-lg all resolve to none, and --shadow-color to transparent. That is not an oversight waiting to be filled in: a component ported from a shadowed system keeps its shadow class, draws nothing, and stays flat, which is the entire point of declaring them. Law 2 — a box-shadow is never blurred — is enforced by the values rather than by a reviewer.',
      'The one depth cue the system does own is --lift: 3px 3px 0 0 var(--shadow-offset), a hard ink offset with no blur at all, and --lift-sm at 2px. --shadow-offset points at --clay, so the offset is the accent rather than a grey and it re-points when the accent does. Worth knowing before you reach for it: no component in the package uses either one — there is not a single shadow-(--lift) in the library. It is published as the sanctioned idiom for a consumer building a plate of their own, not as something the library leans on.',
      'What the library actually separates with is three things, in this order. A hairline: --rule between rows, --rule-2 around a box. A change of ground: --paper, --paper-2, --stone, three steps and no fourth. And reversal, which is what Card variant="plate" reaches for — it fills with the one reversed surface and carries its own title colour, because a hardcoded ink title on a reversed plate came out at 1.25:1 and was invisible on the one variant whose whole job is to look different. Use at most one plate per screen; two of them is a page with no ground left.',
      'Height and stacking are separate questions here, and only the second one is real. Seven ranks — --z-rule at 1 through --z-toast at 300 — say what sits over what, and none of them implies a shadow, because there is none to cast. A surface’s rank is decided by what it has to survive: a drawer has to clear a sticky header, a scrim has to cover both, a modal has to sit on its own scrim, an ANCHORED panel has to clear the modal it was opened from — a select inside a dialog is one of the most ordinary shapes there is, and ranked under the modal the panel paints behind the very dialog that summoned it — and a toast has to be visible over a modal that is asking a question. The ladder itself is tabled on Space & shape rather than repeated here.',
      'Two of the seven have component-facing aliases in the semantic layer, --z-dropdown and --z-overlay. Reach for those from a component and for the primitive ranks only when you are placing something the system has no name for.',
    ],
    categories: [
      {
        key: 'depth',
        title: 'Depth',
        note: 'Four of these draw nothing on purpose: --shadow-sm, --shadow and --shadow-lg resolve to none, and --shadow-color to transparent. --lift and --lift-sm are the offsets that replace the ramp — currently used by no component in the package, and published for consumers rather than consumed here.',
      },
    ],
  },
  {
    slug: 'icons',
    title: 'Icons',
    summary: 'Filled paths rather than strokes, three size tokens over six sizes in the source, and a set that ships brand marks again.',
    related: ['typography', 'space'],
    intro: [
      'Every icon in the package comes from @remixicon/react, the Line variants, drawn on a 24px grid. They are FILLED PATHS rather than strokes, which is the one difference worth carrying in your head: there is no strokeWidth to set, so the exception that used to live on this page — seven small marks pushed to 2, 2.5 or 3 because 1.5 thinned below a hairline at twelve pixels — went with the prop that made it possible. A filled path scales its own weight with its box, so a 12px mark is lighter than a 16px one and no API will change that. The two places that leaned hardest on the old escape hatch are the checkbox tick and the dash beside it, both drawn at 12px on a filled accent ground where the contrast carries what the weight no longer can.',
      'Sixteen pixels is the default and carries most of the system: a chevron, a close, a check, a caret. 14px is for a mark inside a control’s own padding, where 16 would crowd the label — a select’s indicator, a popover’s close, a combobox’s clear. 18px is for a leading mark that opens a row rather than sitting inside one: a nav item, an alert’s tone mark, the command palette’s search. 20px is the app shell’s menu toggle, and 24px is reserved for an EmptyState, where the icon is the only thing on the surface. 12px is not really a size but a mark inside an 18px box — a checkbox tick, a chip’s close, a table’s sort caret.',
      'Three of those six sizes are named: --ico-s is 14, --ico-m is 16, --ico-l is 20. There were four. --ico-stroke went when the stroke did, because a token naming a weight nothing in the system can set is worse than no token at all. 12px, 18px and 24px have never had one. Read the three as the specification, not as the mechanism — nothing in the package reads them. Every icon in src/components is written as size={16} in TSX, because the size lands on the SVG as an attribute rather than as a style. So the tokens are what a review checks against, and the numbers are what you will find in the source. Do not go looking for the var() that wires them together; there isn’t one.',
      'An icon aligns by flex, never by baseline. Button sets inline-flex items-center gap-(--control-gap) on every variant, so the glyph centres against its label and the gap comes off the density axis rather than off a margin written at the call site. Centring is right on a line of text and wrong against a block of it: Alert’s tone mark sits beside a title and a paragraph, so it takes mt-px shrink-0 instead. shrink-0 is on most icons in the package and it is not decoration — without it a flex row squashes the glyph before it wraps the label, and a 16px icon compressed to 11 is the artefact everyone sees and nobody can name.',
      'An icon is decoration until proven otherwise, so aria-hidden is the default and nearly every icon in the package carries it. A chevron on an accordion, a tick in a checkbox, a tone mark on an alert whose words already say what went wrong — announcing any of those is the same sentence twice. IT IS NOW WRITTEN RATHER THAN INHERITED. lucide stamped aria-hidden="true" onto any icon it had not been handed an aria- prop or a role for; @remixicon/react adds nothing and spreads what it is given straight onto the svg. Every decorative glyph therefore carries the attribute at its own call site, which makes it a line of review instead of a library default — and the one thing a review must not miss, because a control with no text at all has nothing else to announce. FloatingIconButton makes that the type’s problem: label is a required prop, so the code does not compile without it. Button does not — its JSDoc says an icon-only button REQUIRES aria-label and nothing checks it. An icon-only control with no accessible name is the single most common way a design system ships something unusable.',
      'BRAND MARKS ARE BACK. lucide dropped every one of them: there was no Github export, and no Twitter, Slack, Figma, Gitlab, Linkedin, Youtube, Chrome, Codepen, Framer, Dribbble, Instagram or Facebook either, so import { Github } from "lucide-react" was a compile error rather than a missing glyph. This site paid for that with a hand-drawn octocat in apps/docs/src/components/GithubMark.tsx. Remix Icon ships them — RiGithubFill, RiTwitterXFill, RiDiscordFill, RiFigmaFill, RiSlackFill and a couple of hundred more, most in both a Fill and a Line — so that file is deleted and the masthead imports RiGithubFill like anything else. @misoto22/folio depends on @remixicon/react at ^4.9.0 as a dependency rather than a peer, so an app importing it directly resolves its own copy against its own range, and the failure lands on its upgrade rather than on ours.',
    ],
    categories: [
      {
        key: 'icon',
        title: 'Icon tokens',
        note: 'The written-down version of the rule. No component reads these — the numbers are literals at each call site — so treat a token here as the value a review asserts against rather than as the value a component resolves.',
      },
    ],
  },
  {
    slug: 'motion',
    title: 'Motion',
    summary: 'One curve, three durations, and a reduced-motion rule that is not optional.',
    intro: [
      'One easing curve for the whole system. Three durations: --fast for a state flip, --mid for a panel, --slow for something the size of a page. A component that needs a fourth is usually doing two things.',
      'Every animation in the package is gated behind motion-safe, and the keyframe layer carries one reduced-motion rule that stops anything marked data-folio-animated. A reader who asked for less motion gets the end state, not a faster version of the same move.',
    ],
    categories: [{ key: 'motion', title: 'Motion tokens' }],
  },
  {
    slug: 'agents',
    title: 'Working with AI',
    summary: 'The package documents itself twice. This is the half a browser cannot open.',
    group: 'guide',
    categories: [],
    related: ['getting-started'],
    intro: [
      'There are two audiences for this package and only one of them can open a browser. The second one has usually installed it — which means the version it is writing against is sitting in node_modules, while the documentation it would otherwise read is on a website that has moved on. Everything below is generated from the source in the same tarball, so it describes the version you actually have rather than whatever shipped last.',
      'This matters most exactly where a model is most confident. The names diverge from shadcn/ui in a handful of places a model writing from habit gets wrong — CardBody not CardContent, THead/TBody/TR/TH/TD not TableHeader and friends, title as a prop on DialogContent rather than a DialogTitle child. Guessing produces imports that do not exist, and the fastest fix is to stop guessing.',
    ],
    sections: [
      {
        id: 'cli',
        title: 'In the terminal',
        body: [
          'The package ships a binary. `docs <Component>` prints one component in full — every prop with its type and default, the exported unions, the keyboard contract, the accessibility promises, and the `@example` blocks off the component’s own JSDoc.',
          'It resolves parts and types, not only components: `docs CardBody`, `docs TH` and `docs ButtonVariant` all land on the right file, and it says which component owns the name it redirected you to. That is the command to reach for when an import has just failed, because the identifier you are holding is usually a part rather than the thing that exports it.',
          '`docs --installed` is the cheap half of the deal: the resolved version and the names, grouped, with no prop tables. It is what belongs at the top of a session. `--json` gives the same thing machine-readably, including the four stylesheet specifiers.',
        ],
        commands: [
          {
            // Named apart from the `init` block below it. The label is the
            // scroll region's accessible name as well as the strip's caption,
            // and two regions called "terminal" are two landmarks a reader
            // navigating by landmark cannot tell apart.
            label: 'terminal — docs',
            source: `npx folio-design docs Button          # one component, in full
npx folio-design docs CardBody        # resolves a part to its owner
npx folio-design docs ButtonVariant   # …and an exported type
npx folio-design docs --list          # every component, one line each
npx folio-design docs --installed     # version + names, no prop tables
npx folio-design docs --installed --json`,
          },
        ],
      },
      {
        id: 'skill',
        title: 'Install the skill',
        body: [
          'The package carries an agent skill under `skills/folio-design/`, and `init` copies it into your project at `.claude/skills/folio-design/`. `--agents-md` also appends a short section to your `AGENTS.md` pointing at it, and leaves the file alone if it already mentions the package.',
          'The skill is progressive on purpose. Its name and description are all that sit in a session until something actually touches this package; the body loads when the work reaches it, and five rule files — tokens, composition, forms, accessibility, naming — load one at a time after that. It leads with the shadcn/ui naming table, and the package’s own test suite fails the build if any row of it stops being true.',
          'Re-run it after upgrading. The skill is a copy, not a link, so a project that installed it once is holding whatever the version at that time said.',
        ],
        commands: [
          {
            label: 'terminal — init',
            source: `npx folio-design init              # writes .claude/skills/folio-design/
npx folio-design init --agents-md  # …and points AGENTS.md at it`,
          },
        ],
      },
      {
        id: 'web',
        title: 'On the web',
        body: [
          'The same content is served as plain text from this site, for an agent that can fetch a URL but has not installed anything. Three shapes, and the choice between them is a budget: the index is a page, one component is a page, and everything inline is the whole system.',
          'Prefer the CLI when the package is installed. The site documents whatever shipped last; `node_modules` holds what your code is actually compiled against, and neither side can see the disagreement.',
        ],
        rows: [
          { term: 'ui.misoto22.com/llms.txt', detail: 'The index — what the system is, the eight laws, the theming axes, and a line per component.' },
          { term: 'ui.misoto22.com/components/<slug>/llms.txt', detail: 'One component: props, types, keyboard, accessibility, examples. One fetch, one component.' },
          { term: 'ui.misoto22.com/llms-full.txt', detail: 'The index followed by every component inline. Reach for it only when you genuinely need all of them.' },
        ],
      },
      {
        id: 'emitted',
        title: 'What is in the tarball',
        body: [
          'The generated documentation is a build artifact and ships inside the published package, so none of it needs a network. `dist/agent/` holds one Markdown file per component, an `index.md` with a name and a line each, and a `catalog.json` the CLI reads to resolve a part or a type back to its owner. The CLI is a thin reader over that directory; in a source checkout it is built by `pnpm build:agent` and the CLI says so rather than printing nothing.',
          '`skills/folio-design/` ships alongside it, which is what `init` copies. Both are listed in the package’s `files` field, so `npm pack` carries them.',
        ],
      },
    ],
  },
]

export const FOUNDATION_BY_SLUG = new Map(FOUNDATIONS.map((page) => [page.slug, page]))

/** The rail groups the pages; `foundations` is the default for a token page. */
export function foundationsInGroup(group: 'guide' | 'foundations'): FoundationPage[] {
  return FOUNDATIONS.filter((page) => (page.group ?? 'foundations') === group)
}
