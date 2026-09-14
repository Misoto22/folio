/**
 * The Overlays entries, and nothing else.
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
export const OVERLAYS = [
  {
    name: 'Dialog',
    group: 'Overlays',
    summary: 'A modal surface: portal, scrim, centred panel.',
    anatomy: [
      {
        element: 'Scrim',
        required: true,
        description:
          'The full-viewport --scrim layer at --z-overlay (200). It is what a click outside lands on, and it paints over everything the page had pinned below that rank — a FloatingIconButton at 100 included. Not over an anchored panel: those sit at 220 precisely so a Select opened inside this dialog is still reachable.',
      },
      {
        element: 'Panel',
        required: true,
        description:
          'The centred box at --z-modal (210), capped at min(92vw, 32rem) wide and 85vh tall, scrolling its own body past that. It centres itself with a translate, which has consequences for anything fixed inside it.',
      },
      {
        element: 'Title',
        required: true,
        description:
          'title, rendered as the Radix Title. Always present: when title is omitted a visually hidden one is rendered reading the literal word “Dialog”, and development warns DIALOG_TITLE_MISSING — the fallback exists so an unnamed modal is not shipped, not so one can be.',
      },
      {
        element: 'Description',
        description:
          'description, a quiet line under the title. It shares one wrapper with the title, so hideTitle hides both.',
      },
      {
        element: 'Close',
        description:
          'The 36px X in the top-end corner, rendered while showClose is true (the default) and carrying its own aria-label of “Close”.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Pass title even when you set hideTitle: with no title at all the fallback accessible name is the literal string “Dialog”, so every unnamed modal in the app is announced as the same thing — and it passes an automated accessibility check while doing it, which is why development warns instead of leaving it to a review.',
      },
      {
        kind: 'do',
        text: 'Wrap the cancelling control in DialogClose rather than flipping your own state — the close then runs through Radix, which returns focus to the trigger instead of dropping it at the top of the document.',
      },
      {
        kind: 'do',
        text: 'Keep it to what fits. The panel stops at 32rem by 85vh and scrolls its own body past that, so a form long enough to scroll has become a Sheet, which gets the full height of the viewport, or a page.',
      },
      {
        kind: 'do',
        text: 'Leave showClose on unless the panel supplies its own exit: Escape and the scrim are the only other ways out and neither is visible, so showClose={false} on a dialog full of content is a room with an unmarked door.',
      },
      {
        kind: 'dont',
        text: 'An OverlayContainer whose element is not positioned hands the dialog the wrong box: naming a container switches the panel from fixed to absolute, and an unpositioned container sends it to the nearest positioned ancestor instead — usually the page, which looks like the container was ignored.',
      },
      {
        kind: 'dont',
        text: 'Two dialogs open at once are ordered by the DOM, not by a rank: both sit at --z-modal, so the one mounted last paints over the first — a command palette summoned over a dialog lands on top because it opened second, and reversing that order reverses the picture.',
      },
      {
        kind: 'dont',
        text: 'The panel centres itself with a transform, which makes it the containing block for every position: fixed descendant — a FloatingIconButton dropped inside a dialog pins to the panel’s corner rather than the screen’s.',
      },
    ],
    accessibility: [
      'Radix owns the focus trap, Escape, the scroll lock and aria-modal.',
      'A dialog without a visible heading still renders a hidden title, rather than shipping an unnamed modal.',
    ],
    keyboard: [
      { keys: ['Escape'], does: 'Closes it, and focus returns to the trigger it came from.' },
      { keys: ['Tab'], does: 'Cycles inside the dialog; focus cannot leave while it is open.' },
    ],
    related: ['dropdown-menu', 'tooltip'],
  },
  {
    name: 'DropdownMenu',
    group: 'Overlays',
    summary: 'A menu of actions.',
    when: 'Actions. Items that navigate belong in a nav; items that set a value are a Select or a RadioGroup.',
    anatomy: [
      {
        element: 'Trigger',
        required: true,
        description:
          'A passthrough to Radix, which renders its own bare button unless you pass asChild. It carries aria-haspopup and data-state, which is what lets a Button show that its menu is open.',
      },
      {
        element: 'Panel',
        required: true,
        description:
          'The portalled menu: at least 11rem wide, 6px off the trigger, colliding with 8px of padding against the viewport or the OverlayContainer frame. It has no max height, so it flips rather than scrolls.',
      },
      {
        element: 'Item',
        description:
          'A row. icon takes either spelling — the icon component, sized to 16px here, or a rendered element, placed as given; destructive paints the row --danger; disabled drops pointer events and the opacity.',
      },
      {
        element: 'Label',
        description:
          'A mono eyebrow, on its own. Visual only — Radix renders it as a plain div, and the arrow keys skip it. DropdownMenuGroup is the one that heads rows: it renders role="group" and points its aria-labelledby at this.',
      },
      {
        element: 'Group',
        description:
          'A named section: role="group" around the rows, with label rendered inside it as the Label and named through aria-labelledby. The wiring is the component’s job because a caller doing it by hand has to invent an id.',
      },
      {
        element: 'Separator',
        description:
          'A hairline between groups, and a real role="separator" — which a menu permits, unlike the listbox a Command palette is built on.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Pass icon the component — icon={Settings} — and let the row size it, so a menu of ten rows draws ten icons at one size rather than ten sizes. The element spelling is accepted too, and used to be the exact opposite of what CommandItem took one import away.',
      },
      {
        kind: 'do',
        text: 'Give the trigger asChild and a real Button: without it Radix renders its own unstyled button, and the menu ends up hanging off a control that is not part of the system’s set.',
      },
      {
        kind: 'do',
        text: 'Hold a dialog’s open state yourself and call event.preventDefault() in the item’s onSelect — selecting a row closes the menu, and Radix’s close moves focus back to the trigger, which arrives after the dialog has claimed it and pulls the reader straight back out.',
      },
      {
        kind: 'do',
        text: 'Stop at about a dozen rows. There is no max height on the panel, so a longer menu grows until it hits the collision padding and flips above the trigger — SearchableMenu is the same list once it has outgrown this one.',
      },
      {
        kind: 'dont',
        text: 'Radix defaults modal to true and nothing here overrides it, so while the menu is open the page behind is scroll-locked and its pointer events are off — a menu is not the place for something the reader is meant to consult the page while using.',
      },
      {
        kind: 'dont',
        text: 'A bare DropdownMenuLabel over rows is a picture of a heading: Radix’s MenuLabel is a plain div with no role and nothing tying it to what follows, so the sections a sighted reader sees arrive as one undivided list. DropdownMenuGroup renders both halves and wires them together.',
      },
      {
        kind: 'dont',
        text: 'There is no checkbox item, radio item or submenu in this package’s exports — a menu that needs a checked state has to import from @radix-ui/react-dropdown-menu directly, and that row arrives with none of this file’s styling on it.',
      },
    ],
    accessibility: [
      'Inside a bounded frame — a device preview, an embedded console — wrap the subtree in `<OverlayContainer container={el}>`. The panel then renders into that element and collides with its edges instead of the viewport’s, and inherits the `dir` and `data-density` set there.',
      'Highlight is driven by data-highlighted, which covers hover AND keyboard focus — styling :hover alone leaves the keyboard user unable to see where they are.',
      'DropdownMenuGroup segments the menu for a screen reader as well as for the eye; a bare Label does it for the eye alone.',
    ],
    keyboard: [
      { keys: ['Enter', 'Space', '↓'], does: 'Opens the menu and lands on the first item.' },
      { keys: ['↑', '↓'], does: 'Moves between items.' },
      { keys: ['a–z'], does: 'Jumps to the next item starting with that letter.' },
      { keys: ['Escape'], does: 'Closes the menu and returns focus to the trigger.' },
    ],
    related: ['dialog', 'select'],
  },
  {
    name: 'Tooltip',
    group: 'Overlays',
    summary: 'A short label on hover and on focus.',
    when: 'Never for anything the reader NEEDS: a tooltip is unreachable on touch and invisible while scanning.',
    anatomy: [
      {
        element: 'Provider',
        required: true,
        description:
          'TooltipProvider, wrapped once around the app or the smallest subtree that has tooltips. It holds the shared 700ms open delay and the 300ms skip window; Radix throws without it rather than rendering an untimed tip.',
      },
      {
        element: 'Trigger',
        required: true,
        description:
          'children, handed to Radix with asChild — so the child IS the trigger and no wrapper is inserted around it.',
      },
      {
        element: 'Tip',
        required: true,
        description:
          'content, in the portalled panel: 11px mono on --feature-surface, capped at 16rem, 6px off the chosen side, at --z-toast (300) so it stays above a modal it was opened inside.',
      },
      {
        element: 'Portal',
        description:
          'Where the tip lands — document.body, or the element an enclosing OverlayContainer names, which is also the box it collides against with 8px of padding.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Put the Provider high and put one there. Radix throws without it, and a provider per tooltip defeats the shared timing that stops a row of icon buttons flashing a separate tip on every hover.',
      },
      {
        kind: 'do',
        text: 'Match the tip to the control’s aria-label word for word: two different names for one control is the “label in name” failure (WCAG 2.5.3), and a voice-control user says the words they can see.',
      },
      {
        kind: 'do',
        text: 'Keep the tip to a phrase. It is capped at 16rem and set in 11px mono, so a sentence wraps into a five-line block that covers the thing it was describing.',
      },
      {
        kind: 'do',
        text: 'Put it on a control that already works without it: Radix returns early when the pointer type is touch, so the tip never opens on a phone at all and anything it is the sole carrier of is simply missing there.',
      },
      {
        kind: 'dont',
        text: 'delayDuration={0} does not just make it faster — the state becomes instant-open rather than delayed-open, and the fade is keyed to delayed-open, so the tip appears with no transition at all.',
      },
      {
        kind: 'dont',
        text: 'Setting delayDuration on one Tooltip overrides the provider for that trigger alone, which is how a toolbar ends up with one tip that appears instantly beside neighbours at 700ms — read as lag, not as emphasis.',
      },
      {
        kind: 'dont',
        text: 'Nothing focusable belongs in content: the tip is not in the tab order and closes when the trigger loses focus, so a link or a button in there is reachable by pointer and by nothing else. That is a Popover.',
      },
    ],
    accessibility: [
      'Inside a bounded frame — a device preview, an embedded console — wrap the subtree in `<OverlayContainer container={el}>`. The panel then renders into that element and collides with its edges instead of the viewport’s, and inherits the `dir` and `data-density` set there.',
      'The trigger is asChild, so the child must be focusable — a div trigger simply has no keyboard tooltip, which this API shape makes obvious rather than silent.',
      'Not an accessible name. An icon-only button still needs its own aria-label.',
    ],
    keyboard: [
      { keys: ['Tab'], does: 'Shows the tip — focus reveals it, not only hover.' },
      { keys: ['Escape'], does: 'Dismisses it.' },
    ],
    related: ['dialog'],
  },
  {
    name: 'Popover',
    group: 'Overlays',
    summary: 'A panel anchored to a control, holding content you can interact with.',
    when: 'Anything with a link, a field or a button in it. A tooltip describes and cannot be entered — put a control inside one and it becomes unreachable.',
    anatomy: [
      {
        element: 'Trigger',
        required: true,
        description:
          'PopoverTrigger, a passthrough. Pass asChild to keep your own control; Radix returns focus here when the panel closes on Escape.',
      },
      {
        element: 'Panel',
        required: true,
        description:
          'The anchored dialog: a flat 18rem wide with 1rem of padding, 8px off the trigger, named by label. Focus moves into it on open, but it is not trapped there.',
      },
      {
        element: 'Anchor',
        description:
          'PopoverAnchor, for when the panel should be positioned against something other than the control that opened it — the row an overflow button acts on, a selection in text.',
      },
      {
        element: 'Close',
        description:
          'PopoverClose, and the 32px X that showClose renders in the top-end corner. Off by default, unlike Dialog’s.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Make label say what the panel holds rather than echoing the trigger: it is announced on entry, so “Filter options” tells a reader where they have landed where a repeat of the button text tells them nothing new.',
      },
      {
        kind: 'do',
        text: 'Use PopoverAnchor when the visual anchor is not the trigger — a toolbar button acting on a selected row — otherwise the panel tracks the button and drifts away from the thing it is editing.',
      },
      {
        kind: 'do',
        text: 'Wrap the dismissing control in PopoverClose rather than flipping your own state, so the close runs through Radix and focus goes back to the trigger instead of to the top of the document.',
      },
      {
        kind: 'do',
        text: 'Turn showClose on when the panel holds a form. It is off by default, and a non-modal panel whose only exit is clicking away gives an in-progress edit no deliberate end.',
      },
      {
        kind: 'dont',
        text: 'It is not modal — Radix defaults modal to false and nothing here changes that, so there is no focus trap and no scroll lock: tabbing past the last control inside moves focus into the page, which Radix reads as a focus-outside and closes the panel mid-task.',
      },
      {
        kind: 'dont',
        text: 'A list of actions belongs in a DropdownMenu. A popover’s contents are ordinary tab stops, so ten actions is ten stops with no type-ahead, where a menu is one stop with arrow keys and a letter jump inside it.',
      },
      {
        kind: 'dont',
        text: 'The panel sits at --z-dropdown, which resolves to 220 — above a Dialog’s 210, so that a popover opened FROM a dialog is reachable. A popover the page opened and your own state holds open therefore paints over a modal that arrives afterwards; Radix closes it on the interaction outside, and a controlled open that ignores that is the one way to see it.',
      },
    ],
    accessibility: [
      'Inside a bounded frame — a device preview, an embedded console — wrap the subtree in `<OverlayContainer container={el}>`. The panel then renders into that element and collides with its edges instead of the viewport’s, and inherits the `dir` and `data-density` set there.',
      'label is required: a popover is a dialog, and an unnamed one announces nothing.',
      'Its contents Tab like the rest of the page, unlike a menu’s arrow-key list.',
    ],
    keyboard: [
      { keys: ['Enter', 'Space'], does: 'Opens it.' },
      { keys: ['Tab'], does: 'Moves through its contents like the rest of the page.' },
      { keys: ['Escape'], does: 'Closes it and returns focus to the trigger.' },
    ],
    related: ['tooltip', 'dropdown-menu'],
  },
  {
    name: 'Sheet',
    group: 'Overlays',
    summary: 'A panel docked to an edge of the viewport.',
    when: 'A modal that needs room — a filter panel, a detail view. It IS a Dialog, docked; the sides are named in reading order, so `end` is the right in English and the left in Arabic.',
    anatomy: [
      {
        element: 'Scrim',
        required: true,
        description:
          'The same --scrim at --z-overlay that Dialog uses — the same component, in fact, so the page behind is inert and scroll-locked exactly as it is under a dialog.',
      },
      {
        element: 'Panel',
        required: true,
        description:
          'The docked box. start and end are a min(24rem, 92vw) column at full height; top and bottom are a full-width band capped at 85vh. A flex column that scrolls itself.',
      },
      {
        element: 'Title',
        required: true,
        description:
          'title, typed as required rather than optional — there is no unnamed-sheet path to fall into, only a hidden-title one via hideTitle.',
      },
      {
        element: 'Description',
        description: 'description, under the title, sharing the wrapper that hideTitle hides.',
      },
      {
        element: 'Close',
        required: true,
        description:
          'The X in the top-end corner. Unlike Dialog there is no showClose to turn it off, so every sheet has one whichever edge it is docked to.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Reach for a Sheet over a Dialog when the content is a list or a form long enough to scroll: it gets the full height of the viewport rather than Dialog’s 32rem by 85vh box, and the reader keeps the page edge as an anchor.',
      },
      {
        kind: 'do',
        text: 'Use top or bottom when the content is wide and short — a filter bar, a date range. start and end are a 24rem column, and a table pushed into one wraps into a ribbon.',
      },
      {
        kind: 'do',
        text: 'Name the sides start and end rather than reaching for left and right: each edge has its own literal class string carrying its own rtl: variant, so end arrives from the right in English and the left in Arabic with no second code path.',
      },
      {
        kind: 'do',
        text: 'Wrap the cancelling control in SheetClose so the close runs through Radix — a sheet closed by your own state setter leaves focus inside a panel that is no longer on the page.',
      },
      {
        kind: 'dont',
        text: 'Do not re-declare the travel in className. The panel carries data-folio-animated, which removes its transform outright under reduced motion; a second transform of your own only gets the universal floor, so it still arrives — a hundredth of a millisecond later, from wherever you put it.',
      },
      {
        kind: 'dont',
        text: 'An OverlayContainer whose element is not positioned docks the sheet to the wrong box: naming a container switches the panel from fixed to absolute, so an unpositioned container sends it to the nearest positioned ancestor rather than to the frame.',
      },
      {
        kind: 'dont',
        text: 'It is a modal dialog, so the page behind is scroll-locked and pointer-inert: this is not the home for a filter panel the reader is meant to work alongside. That is a Popover, or a column in the layout.',
      },
    ],
    accessibility: [
      'Shares Dialog’s focus trap, Escape handling and scroll lock rather than reproducing them — a second focus trap is a second one to get wrong.',
      'The title is required, visible or not.',
    ],
    keyboard: [
      { keys: ['Escape'], does: 'Closes it, and focus returns to the trigger.' },
      { keys: ['Tab'], does: 'Cycles inside the sheet.' },
    ],
    related: ['dialog', 'popover'],
  },
  {
    name: 'ContextMenu',
    group: 'Overlays',
    summary: 'The menu a right-click opens.',
    when: 'Never as the only way to reach an action. Touch users, trackpad users and keyboard users may have no way to open it.',
    anatomy: [
      {
        element: 'Trigger',
        required: true,
        description:
          'The region a secondary click opens the menu over. Radix wraps children in its own inline span unless you pass asChild, and sets -webkit-touch-callout: none on it so the OS text callout does not fire first.',
      },
      {
        element: 'Panel',
        required: true,
        description:
          'The portalled menu, placed at the POINTER rather than against the trigger — there is no side or align to set here, only the 8px collision padding that keeps it inside the viewport or the OverlayContainer frame.',
      },
      {
        element: 'Item',
        description:
          'A row, taking the same icon, destructive and disabled props as DropdownMenuItem — icon in either spelling — and highlighting on the same data-highlighted.',
      },
      {
        element: 'Label',
        description: 'A mono eyebrow, on its own, and visual only. ContextMenuGroup is the one that heads rows: it renders role="group" and points its aria-labelledby at this.',
      },
      {
        element: 'Group',
        description:
          'A named section: role="group" around the rows, with label rendered inside it as the Label and named through aria-labelledby.',
      },
      {
        element: 'Separator',
        description: 'A hairline between groups, as a real role="separator".',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Pass asChild and hand it the element itself: without it Radix inserts a span between you and your child, and that span becomes the flex or grid item while your card is laid out inside it as inline content.',
      },
      {
        kind: 'do',
        text: 'Build the same array of actions into a DropdownMenu behind an overflow button — the two take identical icon, destructive and disabled props, so one list feeds both and the right-click becomes the shortcut rather than the only door.',
      },
      {
        kind: 'do',
        text: 'Wrap the subtree in OverlayContainer when the right-clickable region lives in a scrolling or bounded frame: this is the one panel whose position the reader personally chose, and a flip against a viewport edge they cannot see lands it somewhere they did not point.',
      },
      {
        kind: 'dont',
        text: 'Do not read “no touch support” as the whole story: Radix opens the menu on a 700ms long press for touch and pen, but cancels the moment the pointer moves — so on a scrollable list the long press and the scroll gesture compete and the scroll usually wins.',
      },
      {
        kind: 'dont',
        text: 'A bare ContextMenuLabel over rows is a picture of a heading: Radix’s MenuLabel is a plain div with no role and nothing tying it to what follows, so the sections a sighted reader sees arrive as one undivided list. ContextMenuGroup renders both halves and wires them together.',
      },
      {
        kind: 'dont',
        text: 'Radix defaults modal to true here too, so the page behind is scroll-locked and pointer-inert while the menu is open — a right-click menu over a long list stops the list moving under it, which is right for a short action list and wrong for anything the reader must scroll to answer.',
      },
    ],
    keyboard: [
      { keys: ['Shift', 'F10'], does: 'Opens the menu from the keyboard, where the platform supports it.' },
      { keys: ['↑', '↓'], does: 'Moves between items.' },
      { keys: ['Escape'], does: 'Closes it.' },
    ],
    related: ['dropdown-menu'],
  },
  {
    name: 'SearchableMenu',
    group: 'Overlays',
    summary: 'A menu of actions you can type into.',
    when: 'A DropdownMenu past about a dozen rows stops being scannable, and nesting submenus makes it worse. This is the same list with a filter over it. Not a Command palette: that is page-level and modal; this is anchored to a control.',
    anatomy: [
      {
        element: 'Trigger',
        required: true,
        description:
          'A pill button built here rather than a Button: --control-h-sm tall, hairline bordered, with a chevron. Its accessible name is label, not the children you passed as its text.',
      },
      {
        element: 'Panel',
        required: true,
        description:
          'A Popover with its padding removed and a flat 16rem width, so the filter and the list run edge to edge inside it. Not modal — this is a Popover, not a Dialog.',
      },
      {
        element: 'Filter',
        required: true,
        description:
          'The Command input. Focus lands here on open and stays there; the highlight moves under it through aria-activedescendant.',
      },
      {
        element: 'Rows',
        description:
          'One per MenuAction, as listbox options. shortcut prints as a Kbd at the end of the row, destructive paints it --danger, and selecting one closes the menu before running onSelect.',
      },
      {
        element: 'Empty state',
        description:
          'emptyMessage, shown when the filter matches nothing. Say what would match rather than “no results”.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Give an action keywords for the word a reader reaches for that the label does not print — “download” for Export, “bin” for Delete. The label’s own text is lifted into the filter for you; a label built only from elements prints none, and development warns SEARCHABLE_MENU_LABEL_UNREADABLE rather than shipping a row nothing matches.',
      },
      {
        kind: 'do',
        text: 'Make label the trigger’s visible text. It is set as aria-label on the trigger and overrides the children, so a button reading “Status” under a label of “Row actions” is announced as something the reader cannot say aloud (WCAG 2.5.3).',
      },
      {
        kind: 'do',
        text: 'Keep actions that share a group next to each other in the array: groups are built by walking the list and extending only the LAST one, so the same group name appearing again after other rows produces a second heading with identical text.',
      },
      {
        kind: 'dont',
        text: 'It is a Popover underneath, so it is not modal: the page behind still scrolls while the filter is open and the panel is re-anchored as it does. A surface that should hold the page still is CommandDialog.',
      },
      {
        kind: 'dont',
        text: 'className lands on the TRIGGER, not on the panel — the panel is a flat 16rem with no prop that widens it, so a long label wraps to a second line instead of the box growing to take it.',
      },
      {
        kind: 'dont',
        text: 'The trigger is --control-h-sm — 36px comfortable, 30px under data-density="compact" — which is below the 44px pointer target (WCAG 2.5.5), and it is not the system Button, so variant and size do not reach it.',
      },
    ],
    accessibility: [
      'Inside a bounded frame — a device preview, an embedded console — wrap the subtree in `<OverlayContainer container={el}>`. The panel then renders into that element and collides with its edges instead of the viewport’s, and inherits the `dir` and `data-density` set there.',
      'The rows are options inside a listbox rather than menuitems, because filtering requires it — the highlight moves through aria-activedescendant while focus stays in the input, and a menu cannot do that.',
      'The trade is deliberate: a menu that cannot be filtered is worse for the reader than a listbox that runs actions.',
    ],
    keyboard: [
      { keys: ['Enter', 'Space'], does: 'Opens the menu.' },
      { keys: ['↑', '↓'], does: 'Moves the highlight while focus stays in the filter.' },
      { keys: ['Enter'], does: 'Runs the highlighted action.' },
      { keys: ['Escape'], does: 'Closes without running anything.' },
    ],
    related: ['dropdown-menu', 'command', 'combobox'],
  },
  {
    name: 'Command',
    group: 'Overlays',
    summary: 'A filterable list of actions — the ⌘K surface.',
    anatomy: [
      {
        element: 'Input',
        required: true,
        description:
          'CommandInput, the combobox, with the search glyph and a hairline under it. A hard 52px tall rather than a --control-h token, so it does not move with data-density.',
      },
      {
        element: 'List',
        required: true,
        description:
          'CommandList, capped at 18rem inline and raised to 26rem inside CommandDialog, scrolling on its own six-pixel hairline bar.',
      },
      {
        element: 'Item',
        description:
          'A row: an icon ELEMENT, the label, an optional meta note and a shortcut printed as a Kbd. The highlighted row takes --accent-muted and a leading accent rule, because a fill alone is hard to catch while scrolling.',
      },
      {
        element: 'Empty',
        description:
          'CommandEmpty. cmdk renders an empty state only if one exists in the tree, so without it an unmatched filter leaves the input over a blank strip.',
      },
      {
        element: 'Footer',
        description:
          'CommandFooter and its CommandHint rows. A palette is a keyboard surface whose keys are invisible; this is the only place they get printed.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Reach for CommandDialog, not the bare Command. The root is an inline bordered box with no scrim, no focus trap and no Escape handling of its own, so a palette built from it alone stays open until something else closes it.',
      },
      {
        kind: 'do',
        text: 'Always render CommandEmpty. cmdk shows an empty state only when one is present, so the palette that omits it answers a filter matching nothing with an input above a blank strip and no explanation.',
      },
      {
        kind: 'do',
        text: 'Pass CommandItem an icon element — icon={<Search size={16} />} — when the glyph needs its own size or colour, and the component — icon={Search} — when it does not. Both spellings work here and in DropdownMenuItem; they used to be the reverse of each other one import apart.',
      },
      {
        kind: 'do',
        text: 'Bind ⌘K yourself and then print it: nothing in this component listens for a key, so the palette has no shortcut until the app adds a keydown handler, and a CommandFooter is where the reader finds out it exists.',
      },
      {
        kind: 'dont',
        text: 'Do not pass value to CommandItem unless the value is what a reader would type — cmdk filters on value first and only falls back to the row’s own text when there is none, so an id passed as the value makes the visible label unsearchable. Pass the label’s words as keywords when the id has to stay the value, which is what SearchableMenu does.',
      },
      {
        kind: 'dont',
        text: 'CommandDialog renders with hideTitle and showClose={false}, so the palette has no visible heading and no visible close: Escape and the scrim are the only exits and neither announces itself. Print Escape in a CommandFooter rather than assuming it is known.',
      },
      {
        kind: 'dont',
        text: 'Do not expect the palette to follow data-density — CommandInput is a hard 52px, not a --control-h token, so its field stays put while every other control in the app shrinks under compact.',
      },
    ],
    accessibility: [
      'The list filters as you type, the highlight moves with the arrow keys, and focus stays in the input. That last part is the ARIA combobox pattern and the part a home-made palette gets wrong.',
    ],
    keyboard: [
      { keys: ['↑', '↓'], does: 'Moves the highlight. Focus stays in the input, so what you typed stays editable.' },
      { keys: ['Enter'], does: 'Runs the highlighted item.' },
      { keys: ['Escape'], does: 'Closes the palette.' },
    ],
    related: ['combobox', 'dialog'],
  },
]
