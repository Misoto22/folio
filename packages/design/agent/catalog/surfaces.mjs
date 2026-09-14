/**
 * The Surfaces entries, and nothing else.
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
export const SURFACES = [
  {
    name: 'Article',
    group: 'Surfaces',
    summary: 'The long-form reading surface — everything a Markdown pipeline emits, in this system’s type.',
    when: 'A post, a changelog entry, a document. Not for interface copy: a paragraph inside a card is a paragraph, and this is a whole reading column with its own rhythm.',
    anatomy: [
      {
        element: 'The column',
        required: true,
        description:
          'Whatever as names — article, section or div — tagged data-folio-article, which is what every rule in article.css is scoped to. A 46rem measure and no inline margins of its own, so it sits wherever its parent puts it.',
      },
      {
        element: 'Blocks',
        required: true,
        description:
          'The DIRECT children, and where the rhythm lives: air above every block, more above a heading, none on the first. A block one level deeper is outside that rule and outside its spacing.',
      },
      {
        element: 'Rendered HTML',
        description:
          'html, written with dangerouslySetInnerHTML. Present it and children are not rendered at all — the trust boundary is the pipeline that produced the string, because there is nothing here that will catch a script tag on the way through.',
      },
      {
        element: 'Lead',
        description:
          'p.lead — the standfirst, at --fs-item in full --ink. Marked by the author or the pipeline, never inferred: the stylesheet does not promote whatever happened to come first.',
      },
      {
        element: 'Wide blocks',
        description:
          'figure, table and .folio-wide are the three things allowed out of the measure, because a six-column table and an image with a subject in it are both unreadable at 46rem.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Centre it yourself. It sets a measure, not a layout — with no auto margins it sits against the start edge of a wide page until a parent centres it.',
      },
      {
        kind: 'do',
        text: 'Keep every block a direct child: the rhythm is a child combinator, so a <div> wrapped around a run of paragraphs — even a display:contents one, which removes the box but not the node — costs all of them their spacing.',
      },
      {
        kind: 'do',
        text: 'Have the pipeline wrap a wide table in .folio-table-scroll. A table is allowed out of the measure and has nothing of its own to scroll inside, so eight columns push the whole page sideways instead.',
      },
      {
        kind: 'do',
        text: 'Sanitise before the string arrives, and mark the boundary where you do it: html is set as innerHTML, so a CMS field that reaches this prop unsanitised is stored XSS with a reading measure.',
      },
      {
        kind: 'dont',
        text: 'Do not pass html and children together — html wins and the children are dropped. It says so in development now, but html="" is still html, so a pipeline that rendered nothing takes the children down with it. A post that mixes prose with components is two Articles in order, not one holding both.',
      },
      {
        kind: 'dont',
        text: 'Do not count on a nested component’s utilities holding inside one: article.css is imported unlayered and beats Tailwind’s @layer utilities whatever the specificity, so any property these rules also set is overridden. A component that must keep one needs an inline style, or a tag the stylesheet does not reach.',
      },
      {
        kind: 'dont',
        text: 'Do not nest six heading levels: h5 and h6 are set as mono uppercase 11px eyebrows rather than as smaller headings, so a document loses its type hierarchy at exactly the depth that needed one.',
      },
    ],
    accessibility: [
      'An <article> by default, so the piece is a landmark a reader can jump to.',
      'Every heading carries scroll-margin, so an anchored link does not park the heading under a fixed masthead.',
      'The styles are imported unlayered, so inside an article they beat a component’s layered utilities — which is what lets a Markdown paragraph give its margin up to the article’s rhythm.',
    ],
    related: ['diagram', 'card'],
  },
  {
    name: 'Card',
    group: 'Surfaces',
    summary: 'A bounded surface, with no shadow under it.',
    when: 'A card that needs to read as raised is a plate, which separates by reversal instead of by blur.',
    anatomy: [
      {
        element: 'Box',
        required: true,
        description:
          'A <div> with the --radius-lg corner and one of three grounds: outline, a hairline on the page ground and the default; plate, the one reversed feature surface; flat, no border at all, for a card whose grid already draws the rules between cells. It brings no padding, and it clips to its own corner.',
      },
      {
        element: 'Header',
        description:
          'CardHeader — a space-between row above a hairline, px-5 py-4: title against the start edge, one marker or action against the end.',
      },
      {
        element: 'Title',
        description:
          'CardTitle, in the editorial serif at --fs-item. An <h3> unless as says otherwise, and it reads --card-title rather than --ink directly, which is what keeps it legible when plate re-points that variable.',
      },
      {
        element: 'Body',
        description: 'CardBody — the content well at p-5, --ink-2, relaxed leading.',
      },
      {
        element: 'Footer',
        description:
          'CardFooter — a quiet strip under a hairline, mono-meta at --ink-3-aa, for metadata or a secondary action.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Pass as on CardTitle: h3 is right inside a section that owns an h2 and wrong nearly everywhere else, and a grid of twelve cards is otherwise twelve h3s with no heading above them to belong to.',
      },
      {
        kind: 'do',
        text: 'Use CardTitle inside a plate rather than your own heading — plate re-points --card-title to --on-feature, and a title that reads --ink directly came out at 1.25:1 on that ground: invisible, and invisible only on the one variant whose job is to look different.',
      },
      {
        kind: 'do',
        text: 'Add the padding yourself when you skip the sub-parts: the box has none of its own, so children dropped straight in sit against the border.',
      },
      {
        kind: 'do',
        text: 'Pass overflow-visible for the card that deliberately overhangs — a marker pinned to its edge, a control that breaks the outline. The box clips by default, because a card that rounds and does not clip lays a full-bleed image’s square corners over its round ones.',
      },
      {
        kind: 'dont',
        text: 'A Card with an onClick is a div with an onClick — not focusable, not announced, unreachable by keyboard. Put a real control inside and let it stretch, so what is announced is a button and the whole card is still the target.',
      },
      {
        kind: 'dont',
        text: 'Do not spend plate more than once on a screen: it is the system’s single reversed surface, and a band of plates is a band with no ground left to reverse against.',
      },
    ],
    related: ['table', 'figure-band'],
  },
  {
    name: 'AppShell',
    group: 'Surfaces',
    summary: 'Two columns on a desktop, a drawer on a phone.',
    anatomy: [
      {
        element: 'Frame',
        required: true,
        description:
          'The root: min-h-svh on --paper, one column on a phone and a 15rem sidebar beside a 1fr content column from md up. It is the grid and nothing else — no padding, no measure.',
      },
      {
        element: 'Sidebar',
        required: true,
        description:
          'An <aside> named by sidebarLabel, 15rem wide. A static grid column on a desktop; on a phone a fixed drawer that slides in from the edge reading STARTS at, so it comes from the right in a right-to-left document.',
      },
      {
        element: 'Brand',
        description:
          'brand, in a 3.5rem row at the top of the sidebar above a hairline — the same height as the topbar, so the two rules meet across the column boundary. Omit it and the nav starts at the top and that line is gone.',
      },
      {
        element: 'Nav',
        required: true,
        description:
          'A <nav> named by navLabel, “Primary” by default, holding the sidebar prop. It is the part that scrolls, with scroll-slim, so a list that outgrows the column moves under a brand that stays put.',
      },
      {
        element: 'Topbar',
        required: true,
        description:
          'A sticky 3.5rem header at --paper/85 with a backdrop blur and a hairline under it, holding the toggle and then topbar. It is rendered whether or not you pass one.',
      },
      {
        element: 'Drawer toggle',
        description:
          'A 44px button, phone-only, swapping Menu for X and carrying aria-expanded plus aria-controls pointing at the sidebar. Its only name is openLabel or closeLabel.',
      },
      {
        element: 'Scrim',
        description:
          'A full-screen <button> named by closeLabel, mounted only while the drawer is open and hidden from md up.',
      },
      {
        element: 'Content well',
        required: true,
        description:
          'contentAs — a <main> by default — centred at --w-page with --page-pad either side and py-8. The measure and the page padding are the shell’s, so a child that adds its own puts a second measure inside the first.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Pass contentAs="div" for a shell rendered inside another page — a documentation preview, a screenshot harness. A document may hold exactly one main, and the second one leaves assistive tech unable to answer “where is the content”.',
      },
      {
        kind: 'do',
        text: 'Name both landmarks when a page could hold two shells: sidebarLabel and navLabel are the only way one complementary is told from another, and the only way a non-English app gets landmark names its readers can read.',
      },
      {
        kind: 'do',
        text: 'Translate openLabel and closeLabel with everything else — the toggle holds an icon and no text, so those strings are its entire accessible name on every page of the app.',
      },
      {
        kind: 'do',
        text: 'Put the whole sidebar in the sidebar prop and let the nav scroll it: build the column yourself with the brand inside it and a long list carries the brand off the top of the screen with it.',
      },
      {
        kind: 'dont',
        text: 'Do not treat the closed drawer as unmounted: below md it is translated off-screen and marked inert, not removed, so everything inside it still renders and still runs its effects — a nav item that measures itself measures a box nobody can see.',
      },
      {
        kind: 'dont',
        text: 'Do not assume no topbar means no bar: the header renders regardless, so a shell with nothing to put up there still costs 3.5rem and a rule across the page.',
      },
      {
        kind: 'dont',
        text: 'Do not wrap the children in your own max-width and page padding — the well already applies both, and the content ends up in the middle of the middle.',
      },
    ],
    accessibility: [
      'The drawer closes on Escape as well as on the scrim, so a keyboard user is not stranded inside it.',
      'The scrim is a <button>, because a div with an onClick is neither reachable nor announced.',
      'Below md the closed drawer carries inert, so its links are out of the tab order and out of the accessibility tree rather than merely off screen. Above md it never is: there the sidebar is the page’s navigation column.',
      'Both ways out return focus to the toggle. Focus left inside an inert subtree is focus the browser throws away, and the scrim is worse — it is the focused element and it unmounts.',
    ],
    related: ['nav-item', 'page-header'],
  },
  {
    name: 'PageHeader',
    group: 'Surfaces',
    summary: 'A page opening: what this page is, and what qualifies it.',
    when: 'The top of a route\u2019s own column. AppShell is the frame AROUND a page; this is the first thing inside one.',
    anatomy: [
      {
        element: 'Header',
        required: true,
        description:
          'A <header>, and therefore the page\u2019s banner landmark. A column with a hairline under it and 24px of clearance below the rule \u2014 no top padding, so the shell decides where the page starts.',
      },
      {
        element: 'Trail',
        description:
          'breadcrumb, above everything, as a rendered Breadcrumb rather than its items \u2014 the crumbs stay the caller\u2019s to wire to a router. Left off inside a frame that already pins one.',
      },
      {
        element: 'Eyebrow',
        description:
          'eyebrow in the mono kicker at --ink-3-aa, above the title and never below it. A page numeral, or the section the page belongs to.',
      },
      {
        element: 'Title',
        required: true,
        description:
          'title through Heading at --fs-heading, as an h1 unless level says otherwise. The size never follows the level: a page opening stands over a working screen rather than over a document whose subject is its own title, at every step of the outline.',
      },
      {
        element: 'Actions',
        description:
          'actions, on the title\u2019s baseline at the inline end. Controls that say which slice the title refers to \u2014 a range picker, a scope switch \u2014 not controls that act on the records.',
      },
      {
        element: 'Description',
        description:
          'description under the title, capped at --measure-record so it stays a readable measure while the row above it runs the full width.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Put the range picker here rather than above the table. It qualifies the title \u2014 it says which slice of the archive the page is about \u2014 and below the rule it becomes a toolbar arguing with whatever strip the page starts with.',
      },
      {
        kind: 'do',
        text: 'Leave breadcrumb off inside a shell that already pins a trail. Two trails on one screen are two answers to \u201cwhere am I\u201d, and a reader checks both.',
      },
      {
        kind: 'dont',
        text: 'Do not render two openings on one page at level 1. Each is an h1, so the second is a second document as far as heading navigation is concerned; a preview or a template inside a page that has its own h1 is what level is for.',
      },
      {
        kind: 'dont',
        text: 'Do not put a second finding in description. One sentence saying what the page is for; a number that changes belongs under the rule, beside the figures it is comparable with.',
      },
    ],
    accessibility: [
      'The title is an h1 by default, so the page has a name in the heading list whatever the shell around it is doing, and level moves it where the opening is not the document\u2019s.',
      'The <header> is the page\u2019s banner landmark, which is what a landmark-based reader jumps to first.',
    ],
    related: ['heading', 'breadcrumb', 'app-shell'],
  },
  {
    name: 'Calendar',
    group: 'Surfaces',
    summary: 'A month, as a grid of days.',
    when: 'On its own for a range view or an availability grid; inside a DatePicker for choosing one.',
    anatomy: [
      {
        element: 'Day grid',
        required: true,
        description:
          'The month: a mono weekday row over one 36px pill-cornered button per day, five rows in most months and six in some. Days from the neighbouring months are shown and dimmed rather than left as holes.',
      },
      {
        element: 'Caption',
        required: true,
        description:
          '“September 2026” as ONE button carrying aria-expanded, not two dropdowns — that is how the date is said, and splitting it put four controls in a 250px row that also has to hold two arrows.',
      },
      {
        element: 'Month arrows',
        required: true,
        description:
          'The library’s nav, lifted out of the flow and laid across the caption at the same 36px height so the two sit at either end of the month name. Both step away while the picker is open: two ways to change the month, one of them behind a panel, is one too many.',
      },
      {
        element: 'Month and year picker',
        description:
          'A role="dialog" drawn IN PLACE of the day grid rather than over it — twelve months in a 3×4 and up to twenty-four years in a 4×6, at exactly the size of the grid they replace. Focus moves in when it opens and Tab wraps inside it; Escape closes it and puts focus back on the caption.',
      },
      {
        element: 'Day marks',
        required: true,
        description:
          'Today is a ring and selected is a fill. In a range the wash lives on the CELL and the fill on the ends’ BUTTONS, which is what lets a range read as one band with round ends — and lets a one-day range, which is both ends at once, stay round.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Pass locale rather than trusting the page’s lang: the caption is formatted by Intl from locale.code and falls back to en-US, so a French calendar says “September” until the prop is set.',
      },
      {
        kind: 'do',
        text: 'Re-add the library’s own class when you override a slot through classNames — yours REPLACES ours, and ours carries the .rdp-* hook every downstream selector depends on. Overriding root without rdp-root took that hook off the tree.',
      },
      {
        kind: 'do',
        text: 'Mark availability through the classNames slots rather than by styling the day button: the wash belongs to the cell and the mark to the button, and a background put on the button flattens the round end of a range.',
      },
      {
        kind: 'do',
        text: 'Know what widening the span costs: the year grid pages 24 at a time, so the default ten either side is one page and no paging, and a range wide enough for a birth date is a reader stepping through pages to reach 1974.',
      },
      {
        kind: 'do',
        text: 'Translate the picker’s chrome alongside locale. locale reaches the month names and stops there, so a French calendar with the prop set still names its two panels and its four chevrons “Month and year”, “Previous year” and “Earlier years” until the CalendarLabels props are passed.',
      },
      {
        kind: 'dont',
        text: 'Do not stretch it with a width class: it is w-fit and lays out fixed 36px columns, so w-full only replaces w-fit and leaves the same grid sitting at the start edge of a wider box.',
      },
      {
        kind: 'dont',
        text: 'Do not cut it to a fixed height. The grid is five weeks in most months and six in some, and the picker panel is sized against the grid rather than given a height of its own — a box measured on a five-week month clips the sixth.',
      },
      {
        kind: 'dont',
        text: 'Do not replace MonthCaption through components: the month-and-year picker lives inside ours, so a custom caption leaves the reader with two arrows and no way to move more than one month at a time.',
      },
    ],
    accessibility: [
      'Arrows move a day, Page keys move a month, Home and End reach the week’s ends.',
      '“Today” is an outline and “selected” is a fill — one is a fact about the calendar, the other a choice the reader made, and they must not look alike.',
      'Month and year are one panel of buttons, not a native select: a platform list of a hundred years is a scroll rather than a choice, and it arrives styled by the operating system.',
      'Tab wraps inside the open panel. It is opaque and the day grid is still mounted under it, so a Tab that left would put the reader on a day they cannot see — and past the caption that owns the Escape handler.',
      'The default span is ten years either side. A birth date needs a wider one, and asks for it with startMonth.',
    ],
    keyboard: [
      { keys: ['←', '→'], does: 'Moves by a day.' },
      { keys: ['↑', '↓'], does: 'Moves by a week.' },
      { keys: ['Page Up', 'Page Down'], does: 'Moves by a month.' },
      { keys: ['Home', 'End'], does: "Jumps to the week's first or last day." },
      { keys: ['Enter', 'Space'], does: 'Chooses the focused day.' },
    ],
    related: ['date-picker'],
  },
  {
    name: 'ScrollArea',
    group: 'Surfaces',
    summary: 'A box that scrolls, with a scrollbar that looks the same everywhere.',
    when: 'A bounded panel — a long option list, a log. For page-level or prose scroll the scroll-slim utility is lighter and needs no component.',
    anatomy: [
      {
        element: 'Root',
        required: true,
        description:
          'The bounded box, and where className lands. It is overflow-hidden and has no size of its own, so the height you give it here is the only thing that decides whether anything scrolls at all.',
      },
      {
        element: 'Viewport',
        required: true,
        description:
          'The element that actually scrolls, and the one carrying role="region", tabIndex 0 and label. Radix hides the platform’s scrollbar on it and sets the axis WITHOUT a bar to overflow: hidden. It is positioned, so an absolutely-positioned descendant travels with the content instead of hanging still over it.',
      },
      {
        element: 'Bar',
        description:
          'One per orientation: an 8px track with a pill thumb at --rule-2, and touch-none — a finger scrolls the content, not the bar. It is drawn only while the pointer is inside the region and fades some 600ms after scrolling stops.',
      },
      {
        element: 'Corner',
        description: 'The square where two bars meet, which exists only at orientation="both" — the default.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Give it a height. With none, the root is as tall as its content, nothing ever overflows, and all the component added to the page was a keyboard stop.',
      },
      {
        kind: 'do',
        text: 'Narrow orientation only when clipping the other axis is the thing you meant. Both axes scroll by default, because the axis without a bar is set to overflow: hidden — what is past that edge is not merely unmarked, it is unreachable by every key and every gesture, with the content perfectly well rendered.',
      },
      {
        kind: 'do',
        text: 'Pass type="always" when the content ends flush at the boundary: the platform scrollbar is hidden and ours is not drawn until the pointer is inside, so at rest nothing on the screen says the box scrolls.',
      },
      {
        kind: 'dont',
        text: 'Do not build a drag-to-scroll affordance over it — the thumb is deliberately touch-none and the viewport is a real overflow container, so touch dragging, momentum and the wheel are already the platform’s and behave as the reader expects.',
      },
      {
        kind: 'dont',
        text: 'Do not nest one inside another on the same axis: the inner viewport consumes the wheel until it reaches its own end, so a reader aiming at the outer list moves the inner one instead.',
      },
    ],
    accessibility: [
      'The viewport stays focusable. A scrollable region whose contents are not focusable has nothing to Tab to, so everything past the fold does not exist without a mouse.',
      'label is required, because an unnamed keyboard stop announces "group" and nothing else.',
      'Both axes scroll unless a caller narrows orientation, so content wider than the box stays reachable rather than being clipped without a bar.',
    ],
    keyboard: [
      { keys: ['Tab'], does: 'Moves focus into the region, which is what makes it scrollable at all without a mouse.' },
      { keys: ['↑', '↓', 'Page Up', 'Page Down'], does: 'Scrolls it.' },
    ],
    related: ['table'],
  },
{
    name: 'DescriptionList',
    group: 'Surfaces',
    summary: 'One record’s fields, as a real <dl> rather than a grid of divs.',
    when: 'One record seen from the front — a detail page, a summary panel. Several records seen from above is a Table.',
    anatomy: [
      {
        element: 'List',
        required: true,
        description:
          'The <dl>. It is the element that carries the pairing: a grid of divs looks identical and tells a screen reader there are two columns of unrelated text.',
      },
      {
        element: 'Pair',
        required: true,
        description:
          'A <div> around each dt/dd, which the HTML specification allows inside a <dl> precisely so a pair can be laid out as a unit. It is what the hairline is drawn on, so the rule crosses the whole row rather than stopping in the column gap.',
      },
      {
        element: 'Term',
        required: true,
        description:
          'item.term, rendered as <dt> at --ink-3-aa. In the row layout it holds a 12rem column at sm and above and stacks below it, because a 12rem label column on a phone leaves the value about eight characters wide.',
      },
      {
        element: 'Description',
        required: true,
        description:
          'item.description, rendered as <dd> at --ink-2 with its browser margin reset. It takes a node, not a string, so a value can be a Badge, a link or a Timestamp.',
      },
      {
        element: 'Hairline',
        description:
          'divided, on by default: a --rule under every pair but the last. Turn it off inside a Card, which already has an edge of its own.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Let it render nothing when items is empty. It returns null rather than an empty bordered box, so the page above is free to show an EmptyState instead of a hairline around no content.',
      },
      {
        kind: 'do',
        text: 'Put an element in description when the value is a state or a link — it is a <dd>, so a Badge, an anchor or a Timestamp belongs there and a string of text does not have to be faked into one.',
      },
      {
        kind: 'do',
        text: 'Pass id on each item when rows are added, removed or reordered. The index is the key without one, which is right for the fixed field list a record page renders and wrong for a list that changes shape.',
      },
      {
        kind: 'dont',
        text: 'Do not reach for it to show several records. Every dt would repeat down the page and a reader comparing two records has to hold both in their head — that is what a Table’s column headings exist to avoid.',
      },
      {
        kind: 'dont',
        text: 'Do not use layout="row" inside a narrow sidebar. It only collapses on the sm breakpoint, which is the viewport, not the container — a 12rem label column inside a 20rem panel leaves nothing for the value. Use layout="stacked" there.',
      },
    ],
    accessibility: [
      'A real <dl>, <dt> and <dd>, which is what tells a screen reader that a label names the value beside it.',
      'Each pair is grouped in a <div>, which the specification permits inside a <dl> and which assistive technology reads through.',
      'An empty list renders null rather than an empty <dl>, so nothing announces a list with no items in it.',
    ],
    related: ['table', 'card', 'timestamp'],
  },
  {
    name: 'Toolbar',
    group: 'Surfaces',
    summary: 'The bar of actions at the edge of a working surface.',
    when: 'A form’s actions that must stay in reach while the form scrolls, or a filter bar over a list. Not a page header — that is AppShell.',
    anatomy: [
      {
        element: 'Bar',
        required: true,
        description:
          'A <div role="group"> named by label, wrapping its children on a flex row at --z-sticky. It is not role="toolbar": that role promises a single tab stop with arrow keys between the controls, and this implements no such thing.',
      },
      {
        element: 'Ground',
        required: true,
        description:
          'Opaque --paper, and deliberately not a blur. Content scrolls UNDER this bar, so anything translucent puts the last row of a table behind the submit button and makes both unreadable.',
      },
      {
        element: 'Edge',
        required: true,
        description:
          'A --rule-2 hairline on the side the bar sticks to: border-t for bottom, border-b for top. position="static" keeps the rule and drops the stickiness.',
      },
      {
        element: 'Actions',
        required: true,
        description:
          'children, on a flex-wrap row with a --gap of 3. align places them along the inline axis and defaults to end, which is where a form’s primary action goes.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Write label as what the bar IS — "Form actions", "List filters". A group with no name is announced as "group", and a page with two of them announces the same nothing twice.',
      },
      {
        kind: 'do',
        text: 'Give the scrolling ancestor a height for position="bottom". A sticky element sticks within its scroll container, so a bar inside a container that is as tall as its content has nothing to stick to and simply sits at the end.',
      },
      {
        kind: 'do',
        text: 'Keep it to the actions. A bar that has grown a title, a status and a breadcrumb is a page header, and a page header that follows the reader down the screen is a page with less of itself visible.',
      },
      {
        kind: 'dont',
        text: 'Do not add role="toolbar" through props. The role tells a screen-reader user that arrow keys move between the controls; nothing here implements roving tabindex, so those keys would do nothing and the promise would be false.',
      },
      {
        kind: 'dont',
        text: 'Do not make the ground translucent to "let the content show through". The content it would show through is the row the reader is trying to read, and the button they are trying to press.',
      },
    ],
    accessibility: [
      'label is required and becomes the group’s accessible name, so a page with a filter bar and an action bar announces two distinct things.',
      'Every control keeps its own place in the tab order, because the bar deliberately does not claim role="toolbar" and its single-tab-stop contract.',
      'The ground is opaque, so a control on the bar always meets its contrast ratio against --paper rather than against whatever happens to be scrolling behind it.',
    ],
    keyboard: [
      { keys: ['Tab'], does: 'Reaches each control in turn — the bar itself is not a stop.' },
    ],
    related: ['button', 'app-shell', 'card'],
  },
  {
    name: 'AspectRatio',
    group: 'Surfaces',
    summary: 'A box that keeps its shape whatever is inside it.',
    when: 'The height has to be known before the content loads — a media grid that would otherwise reflow every time an image arrives.',
    anatomy: [
      {
        element: 'Box',
        required: true,
        description:
          'A relative, full-width <div> carrying aspect-ratio as an inline style. A style and not a class because Tailwind can only generate what it reads verbatim in the source, and this value arrives at runtime.',
      },
      {
        element: 'Children',
        required: true,
        description:
          'Every DIRECT child, taken out of flow and stretched to fill the box. That is what guarantees the ratio holds: nothing inside can contribute a height, so content with no intrinsic size of its own still gets the whole box.',
      },
      {
        element: 'Crop',
        description:
          'object-cover on a direct <img> or <video>, so media fills the box rather than being letterboxed inside it. Content that must not be cropped sets object-contain on itself.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Reach for it wherever a reflow would otherwise happen when an image lands. That reflow is the layout shift a Core Web Vitals score measures, and reserving the box is the whole fix.',
      },
      {
        kind: 'do',
        text: 'Set object-contain on the child when the whole picture matters — a logo, a diagram, a screenshot. The default crops, which is right for a photograph and wrong for anything with an edge that means something.',
      },
      {
        kind: 'do',
        text: 'Give it a width. It is w-full, so inside a container with no width of its own it has no height either, and a box with a ratio and no size is a box that is not there.',
      },
      {
        kind: 'dont',
        text: 'Do not fall back to the padding-top percentage trick beside it. That percentage resolves against the WIDTH, which is why it works at all and also why it breaks as a flex child and eats the element’s own padding.',
      },
      {
        kind: 'dont',
        text: 'Do not put text in it and expect the box to grow. Every child is absolutely positioned, so a paragraph longer than the box is clipped by overflow-hidden rather than pushing it open.',
      },
    ],
    accessibility: [
      'A plain box with no role: it constrains geometry and says nothing, so an <img> inside keeps its own alt and nothing is added to the accessible tree.',
      'Reserving the height before the content arrives is what stops the content under it moving out from under a pointer or a reader mid-tap.',
    ],
    related: ['skeleton', 'card'],
  },
]
