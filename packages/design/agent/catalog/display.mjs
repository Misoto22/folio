/**
 * The Display entries, and nothing else.
 *
 * `catalog.mjs` is still the module: it keeps the typedefs, the group list, the
 * slug rule and the axis table, and it assembles `CATALOG` by concatenating these
 * files in `GROUPS` order. Nothing imports this one directly.
 *
 * A group is the unit because an entry is prose, not a row — several paragraphs
 * per component — and ninety-two of them in one file is a file only one person can
 * be writing at a time.
 */

/** @type {import('../catalog.mjs').CatalogEntry[]} */
export const DISPLAY = [
  {
    name: 'Badge',
    group: 'Display',
    summary: 'A count or a state, set in mono so it reads as metadata.',
    when: 'One fact about one record. If it names what something is ABOUT, that is a Tag.',
    anatomy: [
      {
        element: 'Chip',
        required: true,
        description:
          'The <span>: inline-flex on the --radius-sm corner, mono at 12px with wide tracking. The mono face is the whole signal — it is what tells a reader this is metadata rather than a word of the sentence it sits in.',
      },
      {
        element: 'Ground',
        required: true,
        description:
          'The tone’s fill — --stone for neutral, the soft tint of --ok, --warn or --danger for the three status tones, and nothing at all for outline.',
      },
      {
        element: 'Border',
        required: true,
        description:
          'Always drawn, and transparent for every tone but outline, so the box reserves the pixel either way and swapping tone at runtime moves nothing beside it.',
      },
      {
        element: 'Content',
        required: true,
        description:
          'children, with a 6px gap between them — so a StatusDot or a Kbd set beside the text spaces itself without a wrapper.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Leave tone at neutral unless the badge names a STATE: the three status tones are the only chroma this system spends, and a badge that is red because the page wanted red is the thing the scale exists to prevent.',
      },
      {
        kind: 'do',
        text: 'Reach for outline when the badge sits on --stone already — every other tone fills its own ground, and a neutral badge on stone is a chip with no visible edge at all.',
      },
      {
        kind: 'do',
        text: 'Keep it to a count, a word, or a short state. It is 12px mono sized for one line, so a phrase in it is prose set in the metadata face and wraps inside a box that was never given a second line.',
      },
      {
        kind: 'dont',
        text: 'A row of them is a Tag list drawn in the wrong component: Badge has no active state, so the filter bar it turns into cannot show which facet is on.',
      },
      {
        kind: 'dont',
        text: 'A neutral Badge and an inactive Tag are the same corner, the same padding and the same 12px mono, separated by one ink step — so a row that mixes states and topics reads as one undifferentiated run of chips.',
      },
      {
        kind: 'dont',
        text: 'There is no dismiss affordance here. A × written into children is text inside the accessible name, so the badge is announced as “beta ×” and the close it advertises does not exist.',
      },
    ],
    accessibility: [
      'Not interactive. A badge with an onClick is a control a keyboard cannot reach.',
      'The status tones double their colour with words, so the meaning survives monochrome and colour-blindness.',
    ],
    related: ['tag', 'status-pill'],
  },
  {
    name: 'Tag',
    group: 'Display',
    summary: 'A subject label — a topic, a technology, a filter facet — that filters with onClick and is dismissed with onRemove.',
    when: 'Several sit together and the reader scans them. One fact about one record is a Badge. A chip the reader can toggle or dismiss is this one with onClick or onRemove, not a fourth component.',
    anatomy: [
      {
        element: 'Chip',
        required: true,
        description:
          'The <span>: the same --radius-sm corner, the same 10px by 4px padding and the same 12px mono as a Badge, with no border of its own.',
      },
      {
        element: 'Ground',
        required: true,
        description:
          '--stone at rest, --accent once active, cross-fading over --duration-fast. The accent is the system’s one pointer at a choice, which is why it is what selection is drawn in.',
      },
      {
        element: 'Label',
        required: true,
        description:
          'children, in --ink-3-aa — the AA floor rather than a light grey — and in --accent-foreground once active.',
      },
      {
        element: 'Remove button',
        description:
          'On onRemove only: a real <button type="button"> after the label, holding a 12px X and named by removeLabel. The drawn box is 16px, under the 24px WCAG 2.5.8 floor, so an inset pseudo-element takes the hit area out to 24 without changing the drawing or pushing the chips apart.',
      },
      {
        element: 'Filter control',
        description:
          'On onClick only: the chip itself becomes the <button>, carrying aria-pressed from active. Given onRemove as well, the label splits into its own button beside the X — two siblings, never one inside the other — and takes the leading padding with it so the target is the chip up to the X rather than just the words.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Filter with onClick, not with a wrapper. The chip becomes the button itself, so the padding is part of the target and the focus ring is drawn around what the reader sees — and a removable chip does not end up with a button inside a button.',
      },
      {
        kind: 'do',
        text: 'Pass active on a chip that toggles, and leave it off one that does not. aria-pressed is read off that same value, so the accent fill and the state assistive tech hears cannot drift apart; omitted, nothing is announced, which is the right answer for a chip that navigates rather than toggles.',
      },
      {
        kind: 'do',
        text: 'Give a filter row an off state to come back to — active is the accent, and a row in which every tag is active spends the mark that means “this one” on all of them.',
      },
      {
        kind: 'dont',
        text: 'It carries no tone at all, so a tag cannot say success or danger. Colouring one in through className puts a hue into the system by hand and leaves the accent as the only thing that still reads as selected.',
      },
      {
        kind: 'dont',
        text: 'One tag on its own is a Badge that lost its tone. The component is built to be scanned in a row, and a single chip beside a record is one fact about one record.',
      },
      {
        kind: 'do',
        text: 'Name the subject in removeLabel — "Remove Rust filter", not "Remove". It is required alongside onRemove because eight chips whose controls are all called Remove is eight controls a screen reader cannot tell apart.',
      },
      {
        kind: 'dont',
        text: 'Do not wrap it in a button of your own. Around a removable chip that is a button inside a button — invalid markup a parser splits into siblings, leaving a DOM neither the author nor the accessibility tree expects. onClick is what that wrapper was for.',
      },
    ],
    accessibility: [
      'Presentational until it is given a handler. onClick makes the chip a real button carrying aria-pressed from active, so the focus ring and the pressed state stay on the element that draws them.',
      'Both controls are real <button type="button">s and siblings, so Tab reaches each, Enter and Space fire each, and neither submits the form it happens to sit in.',
      'removeLabel is required with onRemove and is the button’s whole accessible name — the X itself is aria-hidden.',
    ],
    related: ['badge', 'status-pill'],
  },
  {
    name: 'Kbd',
    group: 'Display',
    summary: 'A key on a keyboard, set as one.',
    anatomy: [
      {
        element: 'Key',
        required: true,
        description:
          'The <kbd>: a --rule-2 hairline on the --radius-sm corner, min-w-[1.6em] so a single character is a cap rather than a sliver, and 0.8em type so the whole cap scales with the copy around it.',
      },
      {
        element: 'Legend',
        required: true,
        description:
          'children, printed verbatim. One key per element — the space between two of them is a real space in the markup, not a separator the component draws.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Write one Kbd per key. A whole chord in one box — ⌘K — is a single cap with two glyphs in it, and the min-w-[1.6em] that makes one character square just stretches to hold both.',
      },
      {
        kind: 'do',
        text: 'Let it take its size from its surroundings: it is set in em, so the same shortcut printed in a heading and in body copy comes out right in both. Pinning it to px is how one shortcut ended up three sizes on one page.',
      },
      {
        kind: 'do',
        text: 'Give a glyph-only key an aria-label — ⌘, ⌥ and ⇧ are read out as their Unicode names or skipped entirely, so a Mac shortcut written in symbols alone is a silent instruction.',
      },
      {
        kind: 'dont',
        text: 'An outline Badge and a Kbd are near enough identical on screen, so the choice between them is entirely about meaning: <kbd> says the reader presses this, and a badge shaped like a key invites a press nothing answers.',
      },
      {
        kind: 'dont',
        text: 'Nothing here binds anything. The element is typography, so a key printed for a shortcut no handler listens for is documentation of a feature the page does not have.',
      },
    ],
    accessibility: [
      'Renders <kbd>, which carries the meaning a styled <span> does not.',
    ],
    related: ['badge'],
  },
  {
    name: 'Avatar',
    group: 'Display',
    summary: 'A person, as a circle, with initials until the image lands.',
    anatomy: [
      {
        element: 'Circle',
        required: true,
        description:
          'The Radix root: a --rule hairline over --stone, overflow hidden, and one of three fixed squares — 28px, 36px or 48px. It carries role="img" and alt as its own name, because it is the one element in here that is always rendered.',
      },
      {
        element: 'Image',
        description:
          'Rendered only when src is given, object-cover so a portrait crops to the circle instead of distorting. Its own alt is empty on purpose — the circle around it is what names the person, and a second name here is the same person read twice.',
      },
      {
        element: 'Initials',
        description:
          'The Radix fallback: mono, uppercase, --ink-3-aa, and aria-hidden. Radix shows it while the image is loading and once it has failed, which is why it does not flash on every render the way a hand-rolled onError swap does.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Write alt for the person, not for the row: the circle carries it whether or not a photograph ever arrives, so a list where photographs are optional announces every person rather than every second one.',
      },
      {
        kind: 'do',
        text: 'Pass initials that hold up on their own: fallback is required because the image is the optional half, and most rows of a real list render as this element rather than as a photograph.',
      },
      {
        kind: 'do',
        text: 'Let Radix own the swap rather than reaching for onError — it flips to the fallback only once the image has actually failed, which is what keeps the initials from appearing for a frame before the cache answers.',
      },
      {
        kind: 'dont',
        text: 'The avatar is not the control. sm is 28px and md is 36px, both under the 44px pointer-target floor (WCAG 2.5.8), and the root is a <span> nothing has made focusable — an account menu made by hanging onClick on it is unreachable and undersized at once.',
      },
      {
        kind: 'dont',
        text: 'children is deliberately omitted from the props: the image and the fallback are the only two things that go in the circle, and the root is overflow-hidden, so a presence dot placed inside it is clipped by the very border that makes it round.',
      },
    ],
    accessibility: [
      'alt names the circle itself, as role="img", so an avatar with no photograph still says who it is.',
      'An empty alt is correct when the name is already printed beside it: the circle then takes no role at all rather than an unnamed one, and leaves the tree entirely.',
      'The initials are aria-hidden — read aloud beside a name the root already gives, they are noise.',
    ],
  },
  {
    name: 'StatusDot',
    group: 'Display',
    summary: 'The dot beside a status word.',
    anatomy: [
      {
        element: 'Box',
        required: true,
        description:
          'The aria-hidden <span> the whole thing lives in — 8px square at md, 7px at sm, inline-grid and shrink-0 so it stays circular in a flex row however long the label beside it runs.',
      },
      {
        element: 'Dot',
        required: true,
        description:
          'An absolutely-positioned filled circle in --ok, --warn, --danger or --ink-3-aa. It is the only part of this component tone touches.',
      },
      {
        element: 'Halo',
        description:
          'A second ring of the same colour on the folio-halo keyframes, present only while pulse is true. A separate element rather than a box-shadow, because a shadow in this system is never blurred.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Set pulse={false} for anything settled. It defaults to true, so a dot for a build that finished or a status that will not change today carries a halo announcing that something is happening right now.',
      },
      {
        kind: 'do',
        text: 'Reach for StatusPill the moment you find yourself writing the dot and its label together — that pairing assembled per call site is how one site ended up with three dot sizes and two pulse timings for the same state.',
      },
      {
        kind: 'do',
        text: 'Let it sit directly in the flex row beside its label: shrink-0 is what keeps it round, and a dot wrapped in a div that can shrink comes out an ellipse as soon as the label runs long.',
      },
      {
        kind: 'dont',
        text: 'An aria-label on the dot buys nothing — aria-hidden is still set, and a hidden element has no name to give. A call site with no visible label is a state no screen reader ever reports.',
      },
      {
        kind: 'dont',
        text: 'sm and md are 7px and 8px, one pixel apart. That is an optical adjustment for sitting beside smaller type, not a size scale, and nothing in a layout should be built on the difference.',
      },
    ],
    accessibility: [
      'aria-hidden without exception: it repeats a state the adjacent label already names.',
      'The halo is motion-safe, so a reader who asked for less motion gets a still dot.',
    ],
    related: ['status-pill'],
  },
  {
    name: 'Steps',
    group: 'Display',
    summary: 'A numbered sequence, as a rail — one thing after another, with a rule through them.',
    when: 'A pipeline, a migration, a recipe: an order with no branches. The moment something forks or points at something else it is a Diagram, and drawing a fork as a list hides it.',
    anatomy: [
      {
        element: 'Rail',
        required: true,
        description:
          'The <ol>, carrying --step-size — one number that three rules read: the marker’s own box, where the connector starts, and where it is centred.',
      },
      {
        element: 'Marker',
        required: true,
        description:
          'A 2rem circle per step, aria-hidden: the position number, or a blank hairline node when marker is "rule". Filled with --accent for the current one.',
      },
      {
        element: 'Connector',
        description:
          'A hairline drawn on every item but the last, placed absolutely from the foot of that marker to the foot of its row — so it spans the gap rather than running behind the markers, and no tail hangs off the end of the sequence.',
      },
      {
        element: 'Title',
        required: true,
        description:
          'step.title, at 15px in the interface face. The step’s name — a noun, not a description of what happens in it.',
      },
      {
        element: 'Note',
        description:
          'step.note, a mono line under the title: what the step is made of, what it costs, what it uses.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Use marker="rule" for a sequence of states. “Queued, running, done” is an order rather than an instruction list, and a digit in front of each one tells the reader they are steps to perform.',
      },
      {
        kind: 'do',
        text: 'Mark at most one step current: it is the one thing the rail states rather than draws, and two filled markers put the process in two places at once.',
      },
      {
        kind: 'do',
        text: 'Pass label when no heading names the sequence — it is the list’s only name, so without it the rail is announced as five items belonging to nothing.',
      },
      {
        kind: 'do',
        text: 'Retune the rail through --step-size on the list rather than by restyling the marker: the marker box, the connector’s start and its centring all read that one number, and moving one of the three leaves the line beginning in mid-air.',
      },
      {
        kind: 'dont',
        text: 'A fork drawn here is a fork the reader never sees. The connector runs from each step to the next one in the array and to nothing else, so two branches flatten into four consecutive steps and the choice between them leaves the figure entirely.',
      },
      {
        kind: 'dont',
        text: 'steps={[]} renders null rather than an empty rail, so a list filtered down to nothing leaves a heading standing over a gap unless the call site checks the length itself.',
      },
      {
        kind: 'dont',
        text: 'Nothing here is clickable and the props spread onto the <ol>, so an onClick meant for a step lands on the whole list. A sequence the reader is meant to move through is a Breadcrumb or a Tabs.',
      },
    ],
    accessibility: [
      'An <ol>, because the order IS the content — a stack of divs says nothing about sequence.',
      'aria-current="step" marks the filled one, which is the only thing here a reader could not infer from the reading order.',
      'The markers and the connector are aria-hidden: the number is the list position, and screen readers already announce that.',
    ],
    related: ['diagram', 'article'],
  },
  {
    name: 'StatusPill',
    group: 'Display',
    summary: 'A live state, named: a dot plus an uppercase mono label.',
    anatomy: [
      {
        element: 'Pill',
        required: true,
        description:
          'The outlined <span>: --radius-pill, a --rule-2 hairline, --paper ground, and deliberately uneven padding — 10px before the dot, 12px after the label — so the pair sits optically centred rather than mathematically.',
      },
      {
        element: 'Dot',
        required: true,
        description:
          'A StatusDot handed tone and pulse. It is aria-hidden, so it is not where the tone reaches a reader who cannot see it.',
      },
      {
        element: 'Label',
        required: true,
        description:
          'children in the eyebrow idiom — 11px uppercase mono, tracking pulled back from 0.2em to 0.12em because a pill is a shorter run than a section kicker.',
      },
      {
        element: 'Severity',
        description:
          'A visually-hidden “Warning” or “Error” at the warning and danger tones, so those two reach a reader through something other than a colour on a hidden dot. success and neutral add nothing: they are the absence of alarm, which is what a reader already assumes.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Put the state in the words anyway. The severity word reaches a screen reader and nothing else — the pill’s own text is --ink-2 at every tone, so on a monochrome screen “Degraded” in a warning pill and in a neutral one are still the same pill.',
      },
      {
        kind: 'do',
        text: 'Set pulse={false} once the state has settled — the default halo means “right now”, and an archived or shipped pill pulsing forever tells the reader something is live when nothing is.',
      },
      {
        kind: 'do',
        text: 'Take the whole pill rather than composing a dot and a span at the call site: that assembly is how the same “available for work” chip came out at three dot sizes and two pulse timings on one site.',
      },
      {
        kind: 'dont',
        text: 'It is not a live region. The pill is a plain <span>, so a state flipping from Available to Degraded while the reader is on the page changes silently — if the change is the news, the call site owns the role="status" around it.',
      },
      {
        kind: 'dont',
        text: 'One per view, not one per row. The label is an uppercase eyebrow at 0.12em tracking — the loudest small type the system has — and a column of them down a table is Badge’s job, which is why Badge carries the same status tones in plain 12px mono.',
      },
    ],
    accessibility: [
      'The warning and danger tones are doubled by a visually-hidden severity word, because the dot that carries the colour is aria-hidden and has no name to give.',
      'success and neutral are silent on purpose: announcing “OK” before every settled pill is noise charged to the two tones worth interrupting for.',
      'Not a live region. A state that flips while the reader is on the page changes silently unless the call site owns a role="status" around it.',
    ],
    related: ['status-dot', 'badge'],
  },
  {
    name: 'LinkArrow',
    group: 'Display',
    summary: 'The mark on a link that leaves the page.',
    anatomy: [
      {
        element: 'Marker box',
        required: true,
        description:
          'An aria-hidden inline-block <span> carrying the 0.22em of lead-in, the 0.28em baseline lift and --ink-3-aa. inline-block is load-bearing twice over: it stops an underlined parent drawing its rule through the glyph, and it is what the alignment is measured against.',
      },
      {
        element: 'Glyph',
        required: true,
        description:
          'The ↗ itself at 0.68em, so it tracks the type beside it instead of competing with it. Exported as EXTERNAL_LINK_ARROW, so a surface that is not React uses the same character.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Put it inside the <a>, as the last child. Outside it, it is an arrow pointing at a link the pointer misses by 0.22em.',
      },
      {
        kind: 'do',
        text: 'Reach for EXTERNAL_LINK_ARROW when the surface is not React — a Markdown pipeline, an OG image, an email — so the mark stays one character rather than three near-identical arrows across a site.',
      },
      {
        kind: 'do',
        text: 'Pass a colour through className on a reversed plate: it is set in --ink-3-aa, which is the AA floor against paper and close to invisible on ink.',
      },
      {
        kind: 'dont',
        text: 'The arrow is not the announcement. It is aria-hidden, and target="_blank" is not announced either, so a link that opens a new tab has to say so in its own accessible name — otherwise this glyph is the only warning anyone gets, and only if they can see it.',
      },
      {
        kind: 'dont',
        text: 'Do not pin it to a px size. 0.68em is what makes one component right in body copy and in a heading; fixed at 11px it is correct in one of them and a speck in the other.',
      },
      {
        kind: 'dont',
        text: 'Do not put it on every row of an index. It marks a change of destination, so a list where every link leaves the site marks nothing at all and pays 0.22em a row for it.',
      },
    ],
    accessibility: [
      'aria-hidden, so it is not read as “north east arrow” in the middle of a sentence.',
      'Sized in em, so it tracks whatever type it sits beside instead of competing with it.',
    ],
  },
  {
    name: 'Separator',
    group: 'Display',
    summary: 'A rule, in the three weights a monochrome page needs — with words in it when the break has something to say.',
    when: 'Hairline between rows, edge between blocks, hard under a masthead. label puts words in the break: "or continue with", "Older".',
    anatomy: [
      {
        element: 'Rule',
        required: true,
        description:
          'One <div>. A pixel on its cross axis and 100% on its main axis, so it takes the width — or the height — of whatever contains it, and nothing else.',
      },
      {
        element: 'Ink',
        required: true,
        description:
          'The only thing weight changes: --rule inside a block, --rule-2 between blocks, --rule-hard under a masthead. The hard one is not a darker grey, it is --ink itself.',
      },
      {
        element: 'Label',
        description:
          'label, horizontal only. It changes the construction rather than the styling: the rule is drawn TWICE, one aria-hidden piece either side of the words in mono-meta at --ink-3-aa, and the gap between them is a gap.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Give a vertical separator a height. It is h-full, which against a parent with no height of its own resolves to zero — the element renders, occupies nothing, and reads as a component that failed to load.',
      },
      {
        kind: 'do',
        text: 'Pass decorative={false} when the rule is the only thing dividing two sections a screen reader should hear as distinct: that is what swaps role="none" for role="separator" and sets aria-orientation with it.',
      },
      {
        kind: 'dont',
        text: 'Do not pick the weight by eye. The three are ordered, so a hard rule between two table rows tells the reader the table ended there.',
      },
      {
        kind: 'dont',
        text: 'Do not hand-tune a fourth grey through className. Three named weights are the whole set, and the names exist because a monochrome page drifts into five slightly different rules the moment one of them is chosen by feel.',
      },
      {
        kind: 'do',
        text: 'Use label rather than building "or continue with" out of two Separators and a span. The two rules are drawn for you and neither of them needs to know the ground it is on.',
      },
      {
        kind: 'dont',
        text: 'Do not lay the label over a single rule with a background colour to punch a hole in it. That version has to be told the ground it is sitting on, and a --paper notch on a --stone card reads as a rendering bug.',
      },
    ],
    accessibility: [
      'role="none" by default. A rule that only groups things visually must not be announced.',
      'With a label, the words are the content and the two rules are aria-hidden decoration — so decorative no longer applies, and nothing announces a separator over the top of the text.',
      'A label on a vertical rule is ignored rather than silently redrawn as a horizontal bar: there is no sensible place for words inside a one-pixel column.',
    ],
  },
  {
    name: 'Diagram',
    group: 'Display',
    summary: 'A flow or architecture figure, drawn out of the system’s own parts.',
    when: 'A picture of structure, in a page rather than in a terminal. Nesting is containment and an edge is a step between siblings — a diagram that needs arbitrary wiring wants a drawing, not this.',
    anatomy: [
      {
        element: 'Frame',
        required: true,
        description:
          'The <figure role="group"> and the panel inside it: a --rule hairline on the --radius-lg corner over --paper-2, with fluid padding and overflow-x-auto on a hairline scrollbar — so a wide figure scrolls inside its own box instead of widening the page.',
      },
      {
        element: 'Leaf plate',
        description:
          'A node with NO children: a bordered card on --paper, or filled with --accent when accent is set. Its label breaks inside itself, because an identifier like TenantMainMiddleware has no break opportunity and would otherwise run into the plate’s edge.',
      },
      {
        element: 'Container band',
        description:
          'A node WITH children: a labelled hairline — ink at the top rank, --rule-2 below it — with its children underneath and no frame of its own. That is the whole design: drawing a container as another box puts three borders around anything two levels deep.',
      },
      {
        element: 'Node note',
        description:
          'node.note, a mono line beside a band’s label or under a plate’s. One short line, a step back from the name.',
      },
      {
        element: 'Edge mark',
        description:
          'The arrow between two adjacent siblings an edge names, with the edge’s label under it. aria-hidden, and rotated a quarter turn below the sm breakpoint, where a row of nodes stacks into a column and the arrow has to point the way the layout actually runs.',
      },
      {
        element: 'Caption',
        description:
          'spec.caption, printed under the frame — as a <div>, not a <figcaption>, because an article stylesheet styles figcaption unlayered and an unlayered rule beats a utility whatever the specificity.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Write an edge from a node to the node immediately after it in the same rank, in that order. An edge between non-adjacent nodes, or one written to→from, draws no arrow — and now says so in the console rather than leaving the author to spot a missing arrow in a picture that otherwise looks finished.',
      },
      {
        kind: 'do',
        text: 'Keep ids unique across the whole spec. Each edge is now spent at the first pair that matches it, so a reused pair no longer draws the arrow twice — but the arrow lands on whichever pair comes first, which is a diagram asserting something nobody wrote.',
      },
      {
        kind: 'do',
        text: 'Give the spec a caption or a label. The figure’s role="group" is named by whichever is present, and with neither the reader is told there is a group and never told what of.',
      },
      {
        kind: 'dont',
        text: 'accent is read only in the plate branch, so setting it on a node with children compiles, type-checks and paints nothing — a container is a band, and a band has no fill to take. Development says so; a production build does not.',
      },
      {
        kind: 'dont',
        text: 'direction is read only from a node that HAS children. Set on a leaf it is ignored, because the axis a leaf sits on belongs to its parent — and, like accent on a band, it is reported in development rather than silently dropped.',
      },
      {
        kind: 'dont',
        text: 'Do not put six nodes across the top rank. A row is flex-col below sm and only flex-row above it, so a figure that reads as a pipeline on a desktop is six stacked plates and five arrows on a phone.',
      },
    ],
    accessibility: [
      'A <figure> with role="group", named by its caption, so the whole picture is one thing a reader can skip.',
      'Arrows are aria-hidden: assistive tech reads the nodes in document order and has no use for a glyph pointing at the next one.',
      'Server-rendered markup, not a canvas — every label is real text a screen reader and a search engine can read.',
      'A spec the renderer cannot honour — an unmatched edge, a duplicate id, accent on a band, direction on a leaf — prints a named warning in development, because the alternative is a confident picture of something else.',
    ],
    related: ['card', 'figure-band'],
  },
  {
    name: 'FigureBand',
    group: 'Display',
    summary: 'A row of counted facts, divided by hairlines and nothing else.',
    anatomy: [
      {
        element: 'Query wrapper',
        required: true,
        description:
          'A plain <div> around the list, and it has to be: a container query resolves against an ANCESTOR container, never against the element declaring one. Its w-full is load-bearing too — contain: inline-size computes width without looking at the contents, so as a shrink-to-fit flex item it resolved to zero and the band rendered as two 0px columns.',
      },
      {
        element: 'Band',
        required: true,
        description:
          'The <dl>: ruled top and bottom in --rule, two columns until the wrapper reaches @3xl and four after — a decision about how wide THIS band is, not how wide the window is.',
      },
      {
        element: 'Cell',
        required: true,
        description:
          'One <div> per figure. Each divider width names the cells that do NOT open a row rather than adding a rule and taking it back, so no edge is ever painted past the last column.',
      },
      {
        element: 'Label',
        required: true,
        description:
          'The <dt>: the mono uppercase kicker over the value.',
      },
      {
        element: 'Value',
        required: true,
        description:
          'The <dd>, set in the heading face at --fs-lead or --fs-sub depending on scale.',
      },
      {
        element: 'Note',
        description:
          'A second <dd> under the same term — a trend, a qualifier, a second fact.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Give it two or four figures. The grid is two columns until @3xl and four after, so three leaves a hole in both arrangements and five leaves three holes once the band goes four across.',
      },
      {
        kind: 'do',
        text: 'Use scale="sub" for a band that supports the page rather than being it: --fs-lead is the band-heading step, so a supporting figure set at lead is competing with the page’s own subject.',
      },
      {
        kind: 'do',
        text: 'Key each figure by the fact it counts — id is required rather than optional, because it is the React key and an index puts the next render’s number under the previous label as soon as the list reorders.',
      },
      {
        kind: 'dont',
        text: 'Do not put a sentence in note. The value and the note are two <dd>s under one <dt>, so a screen reader reads them as two values of the same term: “Posts: 48, +6 this year” works, a clause does not.',
      },
      {
        kind: 'dont',
        text: 'Do not set the column count with a viewport breakpoint through className. The band reads a container query, so a sm:grid-cols-4 written on it is wrong in a 390px sidebar of a 1440px window — which is the arrangement this replaced.',
      },
      {
        kind: 'dont',
        text: 'figures={[]} renders null, so a band fed a filtered-empty array leaves no rules behind and no zero state either — if the absence is the news, the call site has to say so.',
      },
    ],
    accessibility: [
      'A <dl>: each cell is a term and its value, which a grid of divs cannot express.',
    ],
    related: ['table'],
  },
  {
    name: 'Text',
    group: 'Display',
    summary: 'The system’s paragraph, on the second rung of the ink ladder.',
    when: 'One paragraph, or one run of text, outside a reading column. A whole column of prose is an Article.',
    anatomy: [
      {
        element: 'Box',
        required: true,
        description:
          'The element `as` names — a <p> unless told otherwise. It carries the size, the tone and margin: 0, so the spacing between blocks belongs to the surface rather than to the paragraph.',
      },
      {
        element: 'Type step',
        required: true,
        description:
          'size, one of four: xs, sm, base and lead. lead is --fs-item, the bottom rung of the heading ladder, and is the standfirst that carries a piece.',
      },
      {
        element: 'Ink step',
        required: true,
        description:
          'tone, one of three, because the ink ladder has three rungs: body is --ink-2, strong is --ink, muted is --ink-3-aa.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Leave tone alone for body copy. The default is --ink-2 on purpose: a page whose paragraphs are all full-strength ink has spent the top of the ladder on its body text and has nothing left for the headings.',
      },
      {
        kind: 'do',
        text: 'Use as="span" for a run inside a sentence. A <p> nested inside a <p> is not nesting — the HTML parser closes the outer one and you get two paragraphs and a broken layout.',
      },
      {
        kind: 'do',
        text: 'Reach for size="lead" for the standfirst under a title, and stop there. It is --fs-item, the same step an in-card title uses; anything larger is a heading that has not admitted it.',
      },
      {
        kind: 'dont',
        text: 'Do not set spacing on it. Every Text is margin: 0, so a stack of them inside a plain <div> has no rhythm by design — put them in an Article or give the container the gap, or every surface ends up with its own idea of what a paragraph gap is.',
      },
      {
        kind: 'dont',
        text: 'tone="muted" is --ink-3-aa, never --ink-3. The two look identical on paper and are not the same token: --ink-3 is a translucent tint that takes on whatever is under it, so it clears AA on the page ground and quietly fails on a card or a code plate.',
      },
      {
        kind: 'dont',
        text: 'Do not use it as a heading with a bigger size. The element is what a screen reader navigates by, and a <p> at --fs-item is invisible to a heading list.',
      },
    ],
    accessibility: [
      'as changes the element and nothing else, so the markup can say what the content is without the look changing under it.',
      'Every tone is an AA-safe rung; the muted step is --ink-3-aa rather than the translucent --ink-3.',
    ],
    related: ['heading', 'article', 'markdown'],
  },
  {
    name: 'Heading',
    group: 'Display',
    summary: 'A heading whose element and whose size are two decisions.',
    when: 'Any heading. level follows the document outline; size follows the design, and defaults from level.',
    anatomy: [
      {
        element: 'Element',
        required: true,
        description:
          'level, 1 to 6, rendered as the matching <h1>–<h6>. This is the document outline — what a screen reader navigates by — so it follows the section the heading opens, never the size it wants to be.',
      },
      {
        element: 'Step',
        required: true,
        description:
          'size, one of title, lead, heading, sub, item and label. Defaults from level through the system ladder, so writing only level is correct.',
      },
      {
        element: 'Anchor offset',
        required: true,
        description:
          'scroll-margin-top: var(--scroll-offset), carried by every heading, so one given an id and linked from a table of contents comes to rest below the masthead instead of under it.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Write level alone unless the outline and the design genuinely disagree. The default ladder is 1→title, 2→heading, 3→sub, 4→item, 5 and 6→label — the same map article.css applies to rendered Markdown, which is what makes a post and a component page read as one publication.',
      },
      {
        kind: 'do',
        text: 'Notice that the default ladder SKIPS lead between levels 1 and 2, and skip a step yourself when you set size by hand: --fs-lead over --fs-heading is a ratio of 1.14 and reads as a rendering accident, where --fs-title over --fs-heading is 1.86 and reads as a hierarchy.',
      },
      {
        kind: 'do',
        text: 'Give a heading an id when anything links to it. The component already carries the scroll offset the anchor needs; nothing else on the page does.',
      },
      {
        kind: 'dont',
        text: 'Do not raise level to get a bigger heading. Two <h1>s on a page make its outline unnavigable, and size is one prop away.',
      },
      {
        kind: 'dont',
        text: 'Do not reach past size="title". The ladder ends there because a page has exactly one thing larger than its own records; a bigger heading is className territory and it is the moment the page stopped being in the system.',
      },
      {
        kind: 'dont',
        text: 'size="label" is the mono kicker at 11px and --ink-3-aa, not a small serif heading — it is what levels 5 and 6 should look like, and setting it on an <h2> makes the section title read as metadata.',
      },
    ],
    accessibility: [
      'level renders the real heading element, so the outline is navigable rather than merely visible.',
      'The two decisions are separate props, which is what lets a semantically-correct h3 look like a page title without bending the outline.',
      'Carries scroll-margin-top so an anchored heading is not hidden under a fixed masthead (WCAG 2.4.7 in practice).',
    ],
    related: ['text', 'article', 'markdown'],
  },
  {
    name: 'Code',
    group: 'Display',
    summary: 'A function name or a flag, inside a sentence.',
    when: 'Inline code within running text. A multi-line snippet is a CodeBlock.',
    anatomy: [
      {
        element: 'Chip',
        required: true,
        description:
          'A real <code> on the --radius-sm corner, filled with --stone. Sized at 0.85em rather than in pixels, so the same token is proportionate in body copy, in a caption and in a table cell.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Use it for anything the reader would type or the machine would read: a flag, a path, a function, an env var name. The mono face is the signal that the string is literal.',
      },
      {
        kind: 'do',
        text: 'Let it inherit its size. It is set in em on purpose — fixed at one pixel value, the identical token comes out three different sizes on one page depending on where it landed.',
      },
      {
        kind: 'dont',
        text: 'Do not hand it a multi-line string. It keeps no whitespace and draws no plate, so the snippet collapses into one run — that is CodeBlock’s job.',
      },
      {
        kind: 'dont',
        text: 'Do not style a <span> to look like this instead. The element is the whole point: a mono span reads identically and tells a screen reader nothing, and "pass dash dash force" is not what the sentence said.',
      },
    ],
    accessibility: [
      'Renders <code>, which is what tells assistive tech the run is literal rather than prose.',
    ],
    related: ['code-block', 'kbd'],
  },
  {
    name: 'CodeBlock',
    group: 'Display',
    summary: 'A multi-line snippet, on a plate, with a way to take it away.',
    when: 'Any snippet longer than a word. Pass html when a build-time highlighter has already run; pass code alone when it has not.',
    anatomy: [
      {
        element: 'Plate',
        required: true,
        description:
          'The --paper-2 box on the --radius-lg corner with a --rule hairline. One elevated step, not a second surface colour.',
      },
      {
        element: 'Strip',
        description:
          'The bar along the top: title at the start, the language label at the end, the copy button after it. Present whenever there is anything to put in it, and never a hover-only affordance.',
      },
      {
        element: 'Copy button',
        description:
          'A ghost iconOnly Button that puts code — the string, never the rendered markup — on the clipboard, and flips its own accessible name to “Copied” for 1.6 seconds.',
      },
      {
        element: 'Body',
        required: true,
        description:
          'A focusable, named role="group" that scrolls in both axes. Focusable because a scrollable box containing nothing focusable is unreachable by keyboard: there is nothing to Tab to, so the right-hand half of a long line does not exist without a mouse. A group and not a region, because a region is a landmark and a snippet is not one — three fenced blocks in an article would be three landmarks all called Code.',
      },
      {
        element: 'Line row',
        description:
          'One <span data-line> per line on the plain path, carrying its own number and its own highlight band. The number is a child of the line it numbers, so the two cannot come apart.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Always pass code, even alongside html. It is what the copy button copies: a block that copies its rendered markup hands the reader a wall of spans, and one that scrapes textContent back out of the DOM is a non-breaking space away from pasting something that does not run.',
      },
      {
        kind: 'do',
        text: 'Highlight at build time and pass html. A highlighter is a few hundred kilobytes of grammar shipped to re-derive spans that never change, which would be the largest thing on the page.',
      },
      {
        kind: 'do',
        text: 'Give maxHeight to a long snippet rather than letting it run. The body scrolls and is focusable, so what is past the fold stays reachable by keyboard.',
      },
      {
        kind: 'dont',
        text: 'lineNumbers and highlightLines are typed out of the html form and passing both is a compile error. They are a per-line structure, and html is one opaque string the component does not parse — which is why the type says so rather than the prop quietly rendering nothing.',
      },
      {
        kind: 'dont',
        text: 'html is dangerouslySetInnerHTML. It is for the output of your own highlighter over your own source; markdown a reader wrote goes to code as a string, where it renders as text and cannot be mis-executed.',
      },
      {
        kind: 'dont',
        text: 'Do not drop copyable to tidy the strip. The button is the reason a reader stops selecting a wrapped command by hand, and on a touch screen a manual selection is most of the interaction.',
      },
    ],
    accessibility: [
      'The scrolling body is tabbable and carries role="group" with a name, so its overflow is reachable with a keyboard and the tab stop announces what it is. Deliberately not role="region": that is a landmark, and a page with two code samples would put two of them in the landmark map under one name.',
      'The copy button is an iconOnly Button with a required aria-label that becomes “Copied” on success — the state change is announced rather than only drawn.',
      'The copy control clears the 44px pointer target on a coarse pointer, where the compact strip alone would not (WCAG 2.5.5).',
    ],
    related: ['code', 'markdown', 'article'],
  },
  {
    name: 'Markdown',
    group: 'Display',
    summary: 'A Markdown string, rendered as this system’s components.',
    when: 'Content nobody on this side wrote — a comment, a README, a model’s answer. Trusted HTML from your own pipeline is an Article.',
    anatomy: [
      {
        element: 'Fragment',
        required: true,
        description:
          'What it renders. There is no wrapper element, because Article’s rhythm is a direct-child combinator — anything between the two, display: contents included, would cost every paragraph its spacing.',
      },
      {
        element: 'Parser',
        required: true,
        description:
          'parseMarkdown by default: ATX headings, paragraphs, fenced code, blockquotes, nested lists, thematic breaks, and inline emphasis, strong, code, links, images and escapes. Raw HTML is dropped rather than rendered, so this path has no dangerouslySetInnerHTML in it at all.',
      },
      {
        element: 'Nodes',
        required: true,
        description:
          'The system’s own components: Heading, Text, Code, CodeBlock and Separator. That is what makes it styled on its own rather than only inside a reading column. One of them is not server-only — a fenced block renders CodeBlock, which is ‘use client’ with useState, useEffect and two icons, so content containing code brings a client component with it.',
      },
      {
        element: 'Heading ids',
        required: true,
        description:
          'Slugged from each heading’s own text, in any script, deduplicated within the document with -2, -3. Exported as slugify, so a table of contents can arrive at the same ids without reading them back off the DOM.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Set headingLevelStart to the level BELOW the heading the content sits under. Markdown is written as a document, so its # is an <h1>; dropped into a page that already has one, that is two first-level headings and an outline nobody can navigate.',
      },
      {
        kind: 'do',
        text: 'Put it inside an Article — <Article as="div"> for a comment or an answer, <Article> for a document. Markdown makes the nodes, Article is the column they sit in and the only thing that spaces them, which is also why Markdown renders no element of its own.',
      },
      {
        kind: 'do',
        text: 'Pass idPrefix when two documents share a page. Both would otherwise claim #installation, and a fragment link lands on whichever the browser found first.',
      },
      {
        kind: 'do',
        text: 'Bring your own parser through parse for tables, footnotes or task lists. The package ships no parser dependency on purpose: markdown-it measures 110.7 kB minified against the 38.9 kB this package had left under its bundle budget.',
      },
      {
        kind: 'dont',
        text: 'Do not hand it HTML. It parses Markdown; a string of tags renders as the text of those tags, which is the safe answer and not the one you wanted — trusted HTML belongs in Article.',
      },
      {
        kind: 'dont',
        text: 'Do not expect the rhythm without a surface, and do not try to buy it with a gap. Every node renders m-0 into a bare fragment, and prose spacing is not uniform — article.css gives a heading 2.25em above and 0.75em below, which is what sits it with the paragraph it introduces. A uniform gap on a container cannot reproduce that; <Article as="div"> can.',
      },
      {
        kind: 'dont',
        text: 'Do not assume the full GFM surface. Tables, footnotes, task lists, setext headings, reference links and hard breaks are outside the built-in parser, and asking for one silently gets you a paragraph.',
      },
    ],
    accessibility: [
      'headingLevelStart shifts the whole document at once, so nested content keeps a valid outline instead of restarting at h1.',
      'Every heading gets a stable, script-preserving id, deduplicated in document order, so a table of contents can link into it.',
      'A link whose href carries a scheme that is not http, https, mailto or tel renders as plain text — javascript: never becomes a control.',
      'A link that leaves for another site carries rel="noreferrer nofollow", so an untrusted author cannot spend the page’s ranking or read its URL out of the Referer. It is not configurable; markExternalLinks adds the visible outbound arrow and is off by default.',
      'A malformed or empty string renders nothing rather than throwing, which is the normal case for content a reader wrote.',
    ],
    related: ['article', 'code-block', 'heading', 'text'],
  },
{
    name: 'Timestamp',
    group: 'Display',
    summary: 'A date or a time, rendered the one way the system renders them.',
    when: 'Any instant on screen. The alternative is toLocaleString() at the call site, which is how a product ends up with four date formats on one screen.',
    anatomy: [
      {
        element: 'Element',
        required: true,
        description:
          'A <time> whose datetime is the full ISO instant from the very first render and never changes, so anything parsing the markup gets the exact moment whether or not the effect has run.',
      },
      {
        element: 'First paint',
        required: true,
        description:
          'The UTC calendar date, sliced straight out of the ISO string with no Intl anywhere near it. It is what the server renders and what the client renders while hydrating — both sides compute it from the same characters, so they cannot disagree.',
      },
      {
        element: 'Local reading',
        required: true,
        description:
          'Applied after mount, in an effect, where there is a reader to be local to: Intl.RelativeTimeFormat with numeric "auto" for the relative form, Intl.DateTimeFormat at dateStyle medium for the absolute one.',
      },
      {
        element: 'Missing value',
        description:
          'A value nothing can parse renders an em dash at --ink-3-aa and no <time> at all, because an element whose datetime cannot be written is not a time.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Leave format on auto for a record list. It reads relative while the gap is under relativeWithin — a week by default — and switches to the calendar date past it, which is both the more useful fact and the one that stops changing.',
      },
      {
        kind: 'do',
        text: 'Pass the instant, not a formatted string. A Date, an ISO string or epoch milliseconds all work, and all three end up as the same ISO datetime attribute.',
      },
      {
        kind: 'do',
        text: 'Re-render from above when a list has to tick. It formats once per mount on purpose: a hundred rows each holding an interval to keep "3 minutes ago" honest is a cost nobody asked for.',
      },
      {
        kind: 'dont',
        text: 'Do not expect the relative text in the server-rendered HTML. The first paint is deliberately the UTC date — a crawler, a static export and a test reading markup all see 2026-01-14, and only a mounted browser sees "3 hours ago".',
      },
      {
        kind: 'dont',
        text: 'Do not format a date beside it with toLocaleString. The two would disagree the moment one page renders on a build server, which is exactly the hydration mismatch this component is built around.',
      },
      {
        kind: 'dont',
        text: 'Do not use it for a duration. It renders an instant relative to now; "2m 14s of build time" is a length, not a moment, and belongs in a plain string.',
      },
    ],
    accessibility: [
      'The datetime attribute carries the exact ISO instant from the first render, so assistive technology reading the machine value never depends on an effect having run.',
      'The visible text changes once after mount and the machine value never does, which keeps the announced value and the parsed value in agreement.',
      'An unparseable value renders an em dash rather than the browser’s literal "Invalid Date" string, which is an engineering artefact and not something to put in front of a reader.',
    ],
    related: ['text', 'badge', 'description-list'],
  },
]
