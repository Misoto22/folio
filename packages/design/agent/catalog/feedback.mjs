/**
 * The Feedback entries, and nothing else.
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
export const FEEDBACK = [
  {
    name: 'Spinner',
    group: 'Feedback',
    summary: 'The one “working” indicator — a ring, never a shimmer.',
    when: 'A wait short enough that the shape of what is coming does not matter. Longer than that, use a Skeleton.',
    anatomy: [
      {
        element: 'Live region',
        required: true,
        description:
          'The outer span, and the only part with a voice. It carries role="status" while there is a label; pass label={null} and it turns into an aria-hidden box with no role at all.',
      },
      {
        element: 'Ring',
        required: true,
        description:
          'The inner span — 14px, 18px or 26px of border on a transparent box, and the only element size, tone and className reach.',
      },
      {
        element: 'Leading quarter',
        required: true,
        description:
          'border-t, drawn in --ink at the default tone and in the inherited colour at current. It is the whole difference between a ring and a plain circle, which is why a still ring still reads as unfinished.',
      },
      {
        element: 'Screen-reader label',
        description:
          'An sr-only span holding label, present unless label is null. Announced once, when the spinner mounts, and never again.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Pass tone="current" for a spinner on any filled ground: the default draws the leading quarter in --ink over a --rule-2 track, and inside a primary Button both of those are the ground it is sitting on.',
      },
      {
        kind: 'do',
        text: 'Announce the arrival somewhere else. The label is read once on mount and nothing is said on the way out, so a reader who heard “Loading projects” is never told the projects came.',
      },
      {
        kind: 'do',
        text: 'Reach for label={null} only inside a control that already names the operation — it hides the whole element from assistive tech rather than merely dropping the text, so a silenced spinner standing on its own is a wait nobody is told about.',
      },
      {
        kind: 'dont',
        text: 'label defaults to the bare word “Loading”, so a Spinner written without the prop ships the exact announcement the prop exists to prevent — the default is a placeholder, not a value.',
      },
      {
        kind: 'dont',
        text: 'className is merged onto the ring AFTER size and tone, so it beats both: <Spinner size="lg" className="size-4" /> is a 16px ring, and the prop whose whole job was naming the size is the one that lost.',
      },
      {
        kind: 'dont',
        text: 'Nothing here sets aria-busy — Button does that for its own control — so a spinner laid over a panel leaves the panel announced as ready while its contents are stale and its buttons still take clicks.',
      },
    ],
    accessibility: [
      'label names the specific thing being waited on; three spinners all saying “Loading” tell a screen reader nothing.',
      'label={null} silences it for use inside a control that already announces the operation.',
      'Spins under motion-safe only; the static ring still reads as unfinished because the leading quarter is darker.',
    ],
    related: ['skeleton', 'progress'],
  },
  {
    name: 'Skeleton',
    group: 'Feedback',
    summary: 'The shape of the page, before the page.',
    when: 'A wait the reader would otherwise think was a broken page. A shape that describes what is coming beats a dot that describes nothing.',
    anatomy: [
      {
        element: 'Frame',
        required: true,
        description:
          'SkeletonPage: the div carrying role="status", aria-busy="true" and the single pulse. It is the only part that speaks and the only part that moves — the shapes inside it do neither.',
      },
      {
        element: 'Label',
        required: true,
        description:
          'The sr-only sentence inside the frame, from the required label prop. Every shape is aria-hidden, so this one sentence is the entire loading state for a screen reader.',
      },
      {
        element: 'Fill',
        description:
          'Skeleton itself: a --stone rectangle one line tall — h-3 — and, being a div, already full width. Height is the one dimension the element does not have on its own, so that is the one the base supplies; anything in className replaces it.',
      },
      {
        element: 'Line, Block and Circle',
        description:
          'The three presets over that fill. SkeletonLine is a 12px pill and takes its width from the caller, SkeletonBlock only sets --radius-sm, and SkeletonCircle is a fixed 36px round.',
      },
      {
        element: 'Paragraph',
        description:
          'SkeletonText: three lines by default, the last at 62% so it ends mid-measure the way prose does rather than squaring off into a table.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Wrap the shapes in SkeletonPage even when there is only one bar. The role, the aria-busy and the pulse all live on the frame, so parts used loose are aria-hidden, silent and completely still — a grey rectangle that never resolves.',
      },
      {
        kind: 'do',
        text: 'Give every Skeleton the height of the thing it stands in for. The base falls back to one line, so a block left unsized is no longer invisible — it is a 12px bar where a 160px plate is about to land, and the page jumps by the difference.',
      },
      {
        kind: 'do',
        text: 'Make whatever replaces the skeleton announce itself or take focus. aria-busy never flips to false here — the frame is unmounted, not updated — so the end of the wait is the disappearance of the only thing that was speaking.',
      },
      {
        kind: 'dont',
        text: 'Do not add animate-pulse to a part. The frame already animates opacity and a second ramp on a child multiplies with it, so the part beats at a rate the shape around it does not. Reduced motion is not the reason it is wrong: the rule in keyframes.css is a universal floor on animation-duration and transition-duration, so a hand-written Tailwind animation is clamped along with everything else. data-folio-animated is a component asserting its motion is decorative, not the mechanism that does the cancelling.',
      },
      {
        kind: 'dont',
        text: 'Do not nest one SkeletonPage inside another. Each is a role="status" region with its own sr-only sentence, so a page assembled from two skeleton sections announces two loading messages and marks two regions busy for a single wait.',
      },
      {
        kind: 'dont',
        text: 'Do not carry a skeleton between screens unedited. SkeletonCircle is 36px and SkeletonLine is 12px tall whatever they stand in for, so a copied avatar mount and a copied heading are two guaranteed reflows the moment the real content lands.',
      },
    ],
    accessibility: [
      'One live region on the wrapper; every shape inside it is aria-hidden.',
      'One pulse on the wrapper, not one per bar, so the page breathes together.',
    ],
    related: ['spinner', 'empty-state'],
  },
  {
    name: 'Progress',
    group: 'Feedback',
    summary: 'A bar that fills, or sweeps when the end is unknown.',
    anatomy: [
      {
        element: 'Track',
        required: true,
        description:
          'The Radix root: 4px of --stone at the pill radius, carrying role="progressbar" and aria-label from label. It is full width by default, so it takes the measure of whatever column it is dropped into.',
      },
      {
        element: 'Fill',
        description:
          'The indicator, in --accent, sized by width rather than a translate so it grows from the inline start in a right-to-left document too. Present only when value is a number.',
      },
      {
        element: 'Sweep',
        description:
          'What replaces the fill when value is null: a quarter-width --accent bar travelling the track on transform alone, mirrored under rtl so it never reads as progress running backwards. Under prefers-reduced-motion it stops where it is drawn rather than filling the track.',
      },
      {
        element: 'Value row',
        description:
          'label on the left, a tabular-nums percentage on the right, above the track. It renders only when showValue is set and value is a number, which makes it the only place label is ever visible.',
      },
      {
        element: 'Column',
        description:
          'The flex wrapper holding the row and the track. className lands here; every other prop is forwarded to the Radix root instead.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Pass showValue on any determinate bar. It is the only thing that puts label on screen — without it the name exists solely as aria-label, and a sighted reader is left with an unlabelled 4px rule and no number.',
      },
      {
        kind: 'do',
        text: 'Switch value back to null the moment the estimate stops being real. The fill transitions its width over --duration-slow, so a number that revises downward animates backwards and the reader watches progress undo itself.',
      },
      {
        kind: 'do',
        text: 'Set max to the real total rather than converting to a percentage yourself. The width and aria-valuemax come off the same number, so the picture and the announcement cannot drift — but a value past the ceiling still clamps, and an underestimated total parks the bar at full for the rest of the operation rather than admitting the estimate was wrong.',
      },
      {
        kind: 'dont',
        text: 'Do not pass a max that is not a positive number. Radix refuses it, prints its own warning and falls back to 100, and the width falls back with it — so value={40} paints and announces forty per cent of a ceiling nobody chose.',
      },
      {
        kind: 'dont',
        text: 'Do not read the resting sweep as a position. Under prefers-reduced-motion it stops at a quarter of the track, which is what a determinate bar at 25% looks like — the announcement is the only thing that tells the two apart, and it is the reason omitting value matters.',
      },
      {
        kind: 'dont',
        text: 'className styles the column, not the track, so a height utility passed that way stretches the wrapper and leaves the 4px bar exactly where it was.',
      },
    ],
    accessibility: [
      'Omitting value drops aria-valuenow, so a screen reader hears “indeterminate” rather than a number that is a guess.',
      'label is required — a bare bar announces nothing.',
      'The width is computed from value and max, the same pair Radix announces as aria-valuenow and aria-valuemax, so what is drawn and what is said cannot disagree.',
    ],
    related: ['spinner'],
  },
  {
    name: 'Alert',
    group: 'Feedback',
    summary: 'A message about the page, in place.',
    when: 'Something the reader needs to see and may need to act on. Something they only need to notice is a Toast.',
    anatomy: [
      {
        element: 'Region',
        required: true,
        description:
          'The container, carrying the role and the aria-live the tone chooses, plus the tone’s ground. It is not focusable and it is not a landmark, so it exists for the reader who is already there and for the announcement.',
      },
      {
        element: 'Mark',
        description:
          'The tone’s Remix Icon glyph at 18px — RiInformationLine, RiCheckboxCircleLine, RiAlertLine or RiCloseCircleLine — aria-hidden, so it doubles the colour for sighted readers only. hideIcon removes it.',
      },
      {
        element: 'Title',
        description:
          'title, as a medium-weight paragraph in --ink. A p and not a heading, so it never appears in a screen reader’s heading list.',
      },
      {
        element: 'Body',
        description:
          'children, in --ink-2 at relaxed leading, offset from the title only when there is a title to offset from.',
      },
      {
        element: 'Action',
        description:
          'action, below the body and inside the region — so its label is read out with the message rather than being something the reader has to go looking for.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Mount the Alert when there is something to say and unmount it when there is not. A region kept permanently in the page announces only when its words change, so a second failed submit carrying the same message is announced to nobody.',
      },
      {
        kind: 'do',
        text: 'Move focus after a failed submit — to the Alert or to the field it names. The component announces and then stays put, so a keyboard reader hears the error from wherever they were standing and has no way back to it.',
      },
      {
        kind: 'do',
        text: 'Put the retry, the link or the escape in action rather than describing it in the prose. It sits inside the live region, which is the difference between the announcement telling the reader what to do and merely telling them something is wrong.',
      },
      {
        kind: 'dont',
        text: 'hideIcon takes away one of the two things that double the colour, and the tinted grounds are 13–16% alpha over paper. With the mark gone the severity is carried by a wash the reader may not resolve at all, so the words have to say it outright.',
      },
      {
        kind: 'dont',
        text: 'info is the default and the only tone with a border and no tint — --paper-2 inside a --rule-2 hairline, which is a card. An Alert written without tone therefore looks like page furniture rather than like a notice.',
      },
      {
        kind: 'dont',
        text: 'Do not stack alerts as a running log. Each one is its own live region, so five on a page are five announcements competing for the same speech queue, and a danger among them is assertive enough to cut off the four that explain it.',
      },
    ],
    accessibility: [
      'danger is role="alert" and interrupts; the other three are role="status" and wait for a pause.',
      'Colour is doubled by an icon and by the words.',
    ],
    related: ['toast', 'error-state'],
  },
  {
    name: 'EmptyState',
    group: 'Feedback',
    summary: 'A collection with nothing in it — yet.',
    when: 'Nothing went wrong. The copy says what to do, not what failed.',
    anatomy: [
      {
        element: 'Frame',
        required: true,
        description:
          'A centred column with 80px of padding above and below and --page-pad either side. View-scale, and carrying no role and no live region of its own.',
      },
      {
        element: 'Medallion',
        description:
          'The optional Remix Icon glyph at 24px inside a 56px --stone circle, aria-hidden. Decoration that gives the column something to start from, never the message.',
      },
      {
        element: 'Title',
        required: true,
        description:
          'title in the heading face at --fs-sub, rendered through Heading. level picks the element and defaults to 2; the size does not follow it, so the title is --fs-sub at every level.',
      },
      {
        element: 'Description',
        description:
          'description in --ink-3-aa, capped at 24rem so it stays a readable measure while the column stays centred.',
      },
      {
        element: 'Action',
        description:
          'The one thing to do next, 32px below the description and the only interactive element the frame offers.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Announce the swap yourself. This component has no role and no live region, so replacing a SkeletonPage with it removes the region that said “Loading projects” and puts nothing in its place — a screen reader is left at the last thing it heard.',
      },
      {
        kind: 'do',
        text: 'Say which kind of empty this is. The same component serves a collection that is new and one that a filter has emptied, and “No projects yet” shown over an active filter tells the reader their projects are gone.',
      },
      {
        kind: 'do',
        text: 'Set level from the heading above it. The default of 2 is right directly under a page’s h1; inside a section that already has its own h2, pass 3. Get it wrong and the outline gains a hole a screen reader navigates by.',
      },
      {
        kind: 'dont',
        text: 'Do not show it for a failed request. A reader told the collection is empty acts on it — creating the record they already have, or reporting a data loss that never happened — and the recovery from that costs more than the error page would have.',
      },
      {
        kind: 'dont',
        text: 'Do not put it inside a card or a panel. 160px of vertical padding is sized to stand in for a view, and in a bordered box it reads as a box with a hole in it.',
      },
      {
        kind: 'dont',
        text: 'Do not write a paragraph into description. It is capped at 24rem and centred, so long copy becomes a narrow ragged column that the eye returns from before the sentence that mattered.',
      },
    ],
    related: ['error-state', 'skeleton'],
  },
  {
    name: 'ErrorState',
    group: 'Feedback',
    summary: 'A page that could not be shown.',
    anatomy: [
      {
        element: 'Screen',
        required: true,
        description:
          'A section at least one viewport tall, painting its own --paper ground and holding 96px of clearance for a header. It is a page, not a block.',
      },
      {
        element: 'Code',
        required: true,
        description:
          'code at the top of the type ladder, aria-hidden. The largest thing on the screen and the one thing a screen reader is never told.',
      },
      {
        element: 'Heading',
        required: true,
        description:
          'heading through Heading at --fs-heading, and the first thing said aloud. level defaults to 1 because this replaces the page; the size is fixed, so an error state demoted to an h2 is the same size it was.',
      },
      {
        element: 'Message',
        required: true,
        description:
          'message at --measure-record, which is where the explanation of what happened goes.',
      },
      {
        element: 'Action',
        required: true,
        description:
          'The way back. Required rather than optional, and the only focusable thing on the screen.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Render it instead of the page, not inside it. It is a full viewport with its own ground and its own top clearance, so nested in a layout that already has a header it adds a second screen of blank below the fold.',
      },
      {
        kind: 'do',
        text: 'Announce it or move focus into it on a client-side failure. There is no role and no live region here, so a route that swaps the whole screen for this one changes everything a sighted reader can see and says nothing at all.',
      },
      {
        kind: 'do',
        text: 'Point action at a real destination rather than at history. A reader often arrives at an error page cold or from a link, so going back returns them to the page that just failed, or to nothing.',
      },
      {
        kind: 'dont',
        text: 'Do not leave level at 1 inside an app shell that already has an h1. Two h1s on one document leave a heading list that no longer says which one is the page — pass level={2} for a state rendered into a shell rather than instead of one.',
      },
      {
        kind: 'dont',
        text: 'Do not put a request id, a trace or a sentence into code. It is set at --fs-title with leading-none and it is aria-hidden, so anything long becomes the biggest object on the page and is simultaneously invisible to the reader most likely to have to quote it.',
      },
      {
        kind: 'dont',
        text: 'Do not use it when one panel failed and the rest of the page still works. Replacing the whole screen throws away the navigation the reader needed to get out; an Alert inside the panel keeps both the error and the way past it.',
      },
    ],
    accessibility: [
      'The big status code is aria-hidden; the heading immediately after says the same thing in words.',
    ],
    related: ['empty-state', 'alert'],
  },
  {
    name: 'Toast',
    group: 'Feedback',
    summary: 'A transient confirmation, mounted once near the app root.',
    when: 'Something succeeded and needs no response. A toast is dismissed by time, and time is not an acknowledgement.',
    anatomy: [
      {
        element: 'Toaster',
        required: true,
        description:
          'The single mount, bottom-right by default. It renders sonner’s list into a portal at the end of body, which is why the theming is an inline style — a stylesheet scoped to the app never reaches there.',
      },
      {
        element: 'Token style',
        required: true,
        description:
          'sonner’s --normal-bg, --normal-text, --normal-border and --border-radius pointed at --paper, --ink, --rule-2 and --radius, plus the sans face. The --success-* and --error-* pairs join them only when richColors is on, which is the only state sonner reads them in.',
      },
      {
        element: 'Notification region',
        required: true,
        description:
          'sonner’s own section, aria-live="polite" and labelled “Notifications altKey+KeyT”. Taken out of the tab order and reachable by that shortcut, and polite for every toast type — there is no assertive path.',
      },
      {
        element: 'Toast',
        description:
          'One entry, pushed by toast() or one of its typed variants and removed from the DOM after sonner’s default four seconds, which this wrapper does not change. Three are visible at once; the rest queue.',
      },
      {
        element: 'Close button',
        description:
          'On by default here, where sonner ships it off. Without it the only ways out are the timer and a swipe, and a keyboard has no swipe.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Mount exactly one Toaster. Every toast() call reaches every Toaster listening, so one in a root layout and one in a nested layout render the same message twice, in two corners.',
      },
      {
        kind: 'do',
        text: 'Set duration per toast for anything longer than a short sentence. The wrapper leaves sonner’s default at four seconds — roughly ten words read aloud — and the rest of the message is removed from the page before it has been read.',
      },
      {
        kind: 'do',
        text: 'Keep the message to what happened. Three toasts are visible at a time and the rest wait their turn, so a loop that toasts per item shows the last three and delivers the others after the reader has moved on.',
      },
      {
        kind: 'do',
        text: 'Set data-mode on <html> and leave theme alone. sonner hard-codes the description’s colour per theme — #3f3f3f, overridden only under its dark theme — so a page painted dark by an attribute the Toaster was not following put that grey on --paper at roughly 1.85:1, and every toast with a description lost its second half.',
      },
      {
        kind: 'dont',
        text: 'Nothing a reader must act on belongs here. Four seconds is a deadline they were never told about, and the button is in a portal at the end of body that a keyboard reaches last — an Undo in a toast is an offer most people cannot take.',
      },
      {
        kind: 'dont',
        text: 'Nothing a reader must read twice belongs here either — an error code, a reference, a name to type elsewhere. There is no history: once the timer expires the text is out of the DOM and unrecoverable.',
      },
      {
        kind: 'dont',
        text: 'Do not report a failure with toast.error and consider it reported. The region is polite for every type, so the failure queues behind whatever the screen reader was already saying and can be removed before its turn comes.',
      },
      {
        kind: 'dont',
        text: 'Do not pass theme="system". It reads prefers-color-scheme, not data-mode, so a reader who overrode a dark operating system with a light page gets a dark toast over it — the same defect the old default had, pointing the other way.',
      },
    ],
    related: ['alert'],
  },
]
