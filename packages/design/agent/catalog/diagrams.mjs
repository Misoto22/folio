/**
 * The Diagrams entries, and nothing else.
 *
 * `catalog.mjs` is still the module: it keeps the typedefs, the group list, the
 * slug rule and the axis table, and it assembles `CATALOG` by concatenating these
 * files in `GROUPS` order. Nothing imports this one directly.
 *
 * A group is the unit because an entry is prose, not a row — several paragraphs
 * per component — and ninety-two of them in one file is a file only one person can
 * be writing at a time.
 *
 * These render entirely on a server, and ship from `@misoto22/folio/diagrams`
 * — see `ENTRY_POINTS`.
 */

/** @type {import('../catalog.mjs').CatalogEntry[]} */
export const DIAGRAMS = [
  {
    name: 'ArchitectureFigure',
    group: 'Diagrams',
    summary: 'A component map: services, datastores, trust boundaries, and what talks to what.',
    when: 'Reach for it when the question is "what talks to what". If the question is "in what order", that is a workflow or a sequence; if it is "what is in this arrow", that is a data flow.',
    anatomy: [
      {
        element: 'Figure shell',
        required: true,
        description:
          'The frame all five figures sit in — a serif title, the scrolling paper surface, the role="img" svg. What a map hands it is the relationship list: every connection published as "CloudFront → API: HTTPS", which is the sentence this diagram type exists to make.',
      },
      {
        element: 'Grid',
        required: true,
        description:
          'What row and col index into: a 184 × 72 cell with 64 and 76 unit gutters, overridable per figure through spec.layout — where cellW is the pitch AND the width of the plates drawn at it. A component declaring neither row nor col flows into the next free cell, wrapping at layout.cols; pos replaces the grid entirely and puts the box at an absolute coordinate.',
      },
      {
        element: 'Component plate',
        required: true,
        description:
          'One box per component: a sigil and an eyebrow on the top line, the name at reading size, the sublabel in mono under it. The eyebrow prints the component’s own tag when it has one and the kind word otherwise, and the box grows past a declared height rather than printing through its own bottom rule.',
      },
      {
        element: 'Boundary frame',
        description:
          'A labelled rule around the union of the boxes its wraps names, inflated by pad — 28 units by default. Solid for a region, dashed for a security-group, so where a thing runs and what may reach it are two different lines before either label is read.',
      },
      {
        element: 'Connections',
        description:
          'Lines that leave and arrive perpendicular to a face, spread across that face when several share it, each with its wording on a mask that punches the line out from under itself.',
      },
      {
        element: 'Key',
        description:
          'The kinds actually drawn, each shown with the same sigil the plates carry. legend="all" names all seven instead; legend="hidden" prints none.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Build a new spec object when something changes. The model is memoised on the spec’s identity, so mutating spec.components in place leaves the same reference and the figure goes on drawing the picture it was first given — development prints DIAGRAM_SPEC_MUTATED when it catches that, and a production build prints nothing and still draws the old picture.',
      },
      {
        kind: 'do',
        text: 'Place both ends with pos when a connection carries a hand-tuned via, channelX or channelY. Those are honoured only when both endpoints were placed absolutely — on the grid they are coordinates in a space this renderer did not choose, so a route between two row/col components is dropped and re-routed.',
      },
      {
        kind: 'do',
        text: 'Drive a guided reading yourself. meta.views typechecks and no renderer reads it — a chapter is a control rather than a layout — so the chapter’s focus ids have to arrive as activeIds, which is what dims everything else and adds the "n highlighted" status line.',
      },
      {
        kind: 'do',
        text: 'Leave row and col off the components you have no opinion about. They flow into the next free cell in declaration order, wrapping at layout.cols and stepping around whatever the placed ones claimed — a component declaring neither used to mean row 0, column 0, which is one plate with the rest of them underneath it.',
      },
      {
        kind: 'dont',
        text: 'Two components on one cell are still two plates at one coordinate, one drawn over the other: there is no second place to put the second plate. Development prints DIAGRAM_CELL_COLLISION naming both, which is the only signal — the picture is identical either way.',
      },
      {
        kind: 'dont',
        text: 'A boundary silently shrinks to the components it can find. A wraps id no component declares is skipped, and a boundary whose ids are all missing draws no frame at all — a trust boundary can leave the picture while the specification still claims it.',
      },
    ],
    accessibility: [
      'The <svg> is role="img" with a name, so a screen reader announces a picture instead of walking two hundred <text> nodes in drawing order.',
      'The diagram\u2019s content is published beside it as an ordinary list \u2014 every node with its kind, every relationship as "A \u2192 B: over HTTPS". That list is where the meaning lives for anyone not looking at the picture.',
      'Passing onSelectNode turns that list into real buttons, which is the keyboard\u2019s only route to a selection: the plates inside the picture are presentational by construction.',
    ],
    related: ['dataflow-figure', 'diagram', 'diagram-canvas'],
  },
  {
    name: 'WorkflowFigure',
    group: 'Diagrams',
    summary: 'A process in lanes and phases, with the main path drawn heavier than its branches.',
    when: 'A runbook, an approval chain, a CI pipeline \u2014 anything with an owner per step. mainPath is what turns fourteen boxes into a diagram with a subject.',
    anatomy: [
      {
        element: 'Figure shell',
        required: true,
        description:
          'The same frame every figure sits in. What a process hands it is a key of LINE variants rather than of node kinds — Call, Primary path, Crosses a trust boundary, Asynchronous — because a runbook is read for its arrows and not for its boxes.',
      },
      {
        element: 'Lane',
        required: true,
        description:
          'A 92-unit band per lane with its name set in the 118-unit gutter to its left. The band spans only what the lane actually holds, and a lane marked exception is washed rather than ruled — the one wash in the package’s diagrams, because nothing routes across it.',
      },
      {
        element: 'Column',
        required: true,
        description:
          'What col indexes: a 168-unit column with a 58-unit gutter, the same across every lane. A node sits centred in its lane’s depth, moved off that centre line only by yOffset.',
      },
      {
        element: 'Phase header',
        description:
          'A mono caption at the x of its fromCol, over a rule drawn across the columns from fromCol to toCol — so a phase’s extent is something a reader can see rather than a field only its author knows. variant dashes that rule for security and thickens it for emphasis. A phase is an axis label, so it is set like one rather than framed.',
      },
      {
        element: 'Group frame',
        description:
          'A labelled rule around a run of columns inside ONE lane — a planning loop, an evidence path — dashed when its variant is security.',
      },
      {
        element: 'Main path',
        description:
          'mainPath, drawn as weight rather than as a mark of its own: every edge between two consecutive ids on it goes heavier whatever its own variant says.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Give every node a lane that spec.lanes declares. An unknown lane id still resolves to the first lane — there is nowhere else to put the box — so a step written for the exception band is drawn in the right column, at the right size, in the wrong row, and development prints DIAGRAM_LANE_UNKNOWN naming the node.',
      },
      {
        kind: 'do',
        text: 'Write mainPath as the path in order. The heavier weight is applied to CONSECUTIVE pairs, so [intake, review, ship] emphasises intake→review and review→ship and nothing else; an id whose neighbour on the list is not the far end of a real edge changes nothing at all.',
      },
      {
        kind: 'do',
        text: 'Say what an edge MEANS with role and let the drawing follow it. async and error take the quiet dashed line, return takes an open arrowhead, and main and branch add no stroke of their own because mainPath already draws that distinction as weight. An explicit variant overrides all of it, which is what it is for.',
      },
      {
        kind: 'dont',
        text: 'Phases partition the columns; they do not stack. Each is drawn as a rule across its own span, so two phases claiming the same columns put two rules on one line and one caption over the other — and a reader cannot tell that from one phase drawn twice.',
      },
      {
        kind: 'dont',
        text: 'An empty lane is not a spacer. The band is sized from what the lane holds, so a lane with no nodes collapses to about one column beside the gutter with its name still set — and an exception lane in that state washes a strip of ground next to the figure rather than under the failure path.',
      },
    ],
    accessibility: [
      'Same contract as every figure: a named picture, with its nodes and relationships published as text beside it.',
      'The exception lane is the one washed band in the system\u2019s diagrams, and it is still labelled \u2014 the wash is not carrying the meaning on its own.',
    ],
    related: ['lifecycle-figure', 'sequence-figure', 'steps'],
  },
  {
    name: 'SequenceFigure',
    group: 'Diagrams',
    summary: 'A call chain over time: who asks whom, in what order, and what comes back.',
    when: 'The only figure whose vertical axis means something. A message carries an explicit y, so two calls eight units apart happened together and two two hundred apart did not.',
    anatomy: [
      {
        element: 'Figure shell',
        required: true,
        description:
          'The frame around the picture. What a trace hands it is a message list, and it is published in the order the messages array is written — which is the only ordering a reader who cannot see the axis is given.',
      },
      {
        element: 'Participant head',
        required: true,
        description:
          'A 148-unit plate per participant at the top of its column, in the order the participants array puts them. meta.column_fit: "spread" widens every column to the widest name instead of holding the fixed width.',
      },
      {
        element: 'Lifeline',
        required: true,
        description:
          'A hairline dropped from each head to below the last thing on the axis. A hairline and not a rule, because it is the axis: seven lifelines at message weight is seven vertical lines competing with twelve horizontal ones.',
      },
      {
        element: 'Message',
        required: true,
        description:
          'A horizontal line at its own y, inset from both lifelines so the arrowhead lands clear of the axis, with the wording on a mask above it. A return is dashed AND takes an open head — two signals, because the reply is what a reader picks out of a dense trace.',
      },
      {
        element: 'Activation bar',
        description:
          'A narrow bar on a lifeline from one y to another: who is BUSY. It is the fact a sequence diagram carries that a list of calls does not, and one bar overlapping another is the reason to draw the picture at all.',
      },
      {
        element: 'Segment band',
        description:
          'A dashed rule across the whole figure with a mono caption on a masked patch — request, fallback, response. A caption rather than a tinted panel, because a second ground inside the figure would sit under every message label’s mask.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Author the messages in ascending y. The picture reads the axis and the summary list beside it iterates the array, so a message written out of order is drawn at one point in the exchange and read aloud at another.',
      },
      {
        kind: 'do',
        text: 'Reach for meta.column_fit: "spread" when a participant’s name is longer than the fixed column. The plate wraps to two lines and ellipsises whatever still does not fit, and shortening the name to make it fit is not a repair — the name is the data.',
      },
      {
        kind: 'do',
        text: 'Space the messages by what actually happened. Nothing normalises y, so eight units between two calls reads as together and two hundred reads as a wait; an evenly spaced list is tidier and says something the trace does not.',
      },
      {
        kind: 'dont',
        text: 'A message naming a participant that participants does not declare leaves the picture and the summary list together — there is no column to draw it between, and a text equivalent reporting a call the picture cannot show is two halves of one figure disagreeing. Development prints DIAGRAM_EDGE_DANGLING with both ends, which is now the only place that message is reported at all.',
      },
      {
        kind: 'dont',
        text: 'This figure ASSERTS order. Three calls a service makes concurrently, given three y values because they had to be given something, are a picture claiming the second waited for the first — an activation bar or a segment caption is where "these overlap" belongs.',
      },
    ],
    accessibility: [
      'Return messages are dashed AND take an open arrowhead \u2014 two signals, because the reply is what a reader most often needs to pick out of a dense trace.',
      'The message list beside the picture reads in order, which is the same order the axis is drawn in.',
    ],
    related: ['workflow-figure', 'architecture-figure'],
  },
  {
    name: 'DataflowFigure',
    group: 'Diagrams',
    summary: 'A pipeline: where data comes from, what happens to it, and who ends up with it.',
    when: 'Structurally close to an architecture map, read for a different question. classification gets its own chip because a governance reviewer is looking for exactly that.',
    anatomy: [
      {
        element: 'Figure shell',
        required: true,
        description:
          'The frame around the picture. What a pipeline hands it is a flow list with the classification folded in — "clickstream — PII touch" — so the fact the diagram was opened for reaches a reader who never sees the chip.',
      },
      {
        element: 'Stage heading',
        required: true,
        description:
          'One mono caption per stage on a rule across the top. It is the axis: a node’s stage is how far along the pipeline it sits, so "has this been aggregated yet" is answered by looking up rather than by tracing arrows.',
      },
      {
        element: 'Node plate',
        required: true,
        description:
          'One box per node, placed by stage across and row down. The row pitch leaves a clear band between two boxes in the same column, which is where a line and its wording go.',
      },
      {
        element: 'Flow',
        description:
          'A routed line with a single arrowhead, at its to end. It is the direction claim the whole figure is read for.',
      },
      {
        element: 'Classification chip',
        description:
          'classification, printed in mono under the wording rather than inside it. "clickstream" and "clickstream / PII touch" are two different facts, and only one of them is what a governance review came for.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Put the governance fact in classification rather than in the label. It prints as its own chip on the line and is appended to the flow’s summary line, so it survives both a reader who is scanning the picture and one who only has the text.',
      },
      {
        kind: 'do',
        text: 'Keep stage inside the stages you declared. A node’s x is computed from its own stage index rather than looked up, so a node at stage 5 beside four stages is drawn a full column past the last heading, under no heading at all — development prints DIAGRAM_STAGE_OUT_OF_RANGE, and the summary files it under a band called outside the declared stages rather than beside the nodes the axis does label.',
      },
      {
        kind: 'do',
        text: 'Write a two-way exchange as two flows. Every line carries a head at its to end only, so one flow between a service and its cache says data moves one way, whatever the label claims about the round trip.',
      },
      {
        kind: 'dont',
        text: 'via, channelX and channelY are never honoured here — a data-flow node is always placed by stage and row, so an author’s waypoints refer to a grid this renderer did not build. They are dropped and every line is routed from scratch: the specification still typechecks and the picture is not the one it drew.',
      },
      {
        kind: 'dont',
        text: 'Watch the fan-in. Lines sharing a face are spread evenly across it, and an arrowhead is 11 user units wide against a plate about 55 units tall — so four lines into one face is where the heads meet, and the fifth and sixth arrive as one thick mark. A pipeline at that density wants splitting, not more edges.',
      },
    ],
    accessibility: [
      'A flow\u2019s classification is folded into its summary line, so "clickstream \u2014 PII touch" reaches a reader who cannot see the chip.',
    ],
    related: ['architecture-figure', 'lifecycle-figure'],
  },
  {
    name: 'LifecycleFigure',
    group: 'Diagrams',
    summary: 'A state machine: what something can be, and what moves it between states.',
    when: 'The one figure that spends colour, and it spends exactly the two tokens the system reserves for state. Every other distinction is shape, so a greyscale print keeps six of the eight.',
    anatomy: [
      {
        element: 'Figure shell',
        required: true,
        description:
          'The frame around the picture. What a machine hands it is a transition list with each note folded in after an em dash, so the condition on an arrow — the timeout, the retry count — is in the text copy and not only on the line.',
      },
      {
        element: 'State plate',
        required: true,
        description:
          'One shape per kind: a filled cap for a start, a diamond for a decision, a dashed frame for a wait, a cut corner for an external, and the two washes the system reserves for the terminals. The name is centred, step sits in the leading corner and tag along the bottom edge.',
      },
      {
        element: 'Main rail',
        description:
          'The first lane’s states, sorted by col and joined consecutively at the emphasis weight — one line per neighbouring pair the transitions do not already declare, so a spine written out in full is drawn from the transitions and a spine left implied is drawn anyway. Without it the top row reads as five unconnected boxes, because the spine of a machine is the part nobody writes down.',
      },
      {
        element: 'Transition',
        description:
          'A routed line with its label on a mask and its note in a quieter line beneath. A declared transition between two rail neighbours replaces the implicit one rather than doubling it.',
      },
      {
        element: 'Lane',
        description:
          'A rule with a mono caption above it, drawn only as far as that lane’s own states reach. A lane past the first has its columns shifted along the main rail, which is what keeps a drop out of the spine vertical rather than a dogleg.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Keep the first lane for the ordered spine and nothing else. Consecutive states there are joined by the implicit rail even when no transition declares the pair, so a state parked in lane 0 for spacing invents an edge the machine does not have. A state whose lane id nothing declares is kept out of that rail and reported as DIAGRAM_LANE_UNKNOWN instead, because a typo should not be able to add an arrow.',
      },
      {
        kind: 'do',
        text: 'Count a secondary lane’s columns from the rail. Every col in a lane past the first is shifted two columns along, so col: 0 in the second lane sits under col: 2 in the first — the convention archify’s lifecycle contract already implies, restated here because it is what makes a drop land on the state it came from.',
      },
      {
        kind: 'do',
        text: 'Say whether a failure is recoverable with an edge, not with the type. type: "failure" only paints the plate; a retryable error and a terminal one are identical until a reader follows the arrows out, and the one with none is where the run ended.',
      },
      {
        kind: 'dont',
        text: 'yOffset moves the plate and moves nothing out of its way. The lane’s rule is drawn from what that lane holds, so a negative nudge drags the rule up with the state and a large positive one drops the plate into the band below — a state needing that much room wants a column of its own rather than a push.',
      },
      {
        kind: 'dont',
        text: 'The figure claims a state can be left only the ways its arrows say. A cancel that can happen from anywhere and is drawn from nowhere reads as impossible, which is a reading the picture makes and the specification never wrote — draw it, or say in the subtitle that it is not drawn.',
      },
    ],
    accessibility: [
      'success and failure are the only coloured marks in the package\u2019s diagrams, and each is also a distinct plate shape \u2014 colour is never the only carrier.',
      'The main rail is drawn between consecutive states in the first lane even when the specification does not list those transitions, because they are the diagram\u2019s spine rather than its exceptions.',
    ],
    related: ['workflow-figure', 'steps'],
  },
  {
    name: 'DiagramCanvas',
    group: 'Diagrams',
    summary: 'A frame that a picture larger than it can be panned and zoomed inside.',
    when: 'Any oversized figure \u2014 an SVG, an image, a table that will not fold. It knows nothing about nodes, which is what makes it reusable.',
    anatomy: [
      {
        element: 'Frame',
        required: true,
        description:
          'The outer box: a fixed height — 24rem unless height says otherwise — a hairline, the diagram ground, and overflow hidden. It is the window the artwork is bigger than.',
      },
      {
        element: 'Viewport',
        required: true,
        description:
          'The focusable layer inside it: role="group" with a name, tabIndex 0, the drag handlers, the key handler and a focus ring drawn inside the frame. This is the tab stop, and it is what makes the keys pressable at all.',
      },
      {
        element: 'Stage',
        required: true,
        description:
          'The wrapper the translate and scale are applied to. The transform is on the wrapper and never on the child, so the figure inside keeps its own coordinate space and every measurement taken inside it stays true.',
      },
      {
        element: 'Zoom controls',
        description:
          'The cluster pinned to the bottom corner: zoom out, the current percentage — which is also the reset button, named for what it does — and zoom in. controls={false} removes the cluster and leaves the keys.',
      },
      {
        element: 'Keyboard hint',
        required: true,
        description:
          'A visually hidden paragraph, referenced by aria-describedby, saying that the frame drags and which keys pan, zoom and reset. Nothing on screen carries that sentence.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Name it. label is the group’s accessible name and it defaults to "Diagram canvas", so two canvases on one page announce the same thing until each is given its own.',
      },
      {
        kind: 'do',
        text: 'Strip the figure inside to its artwork with heading={false}, legend="hidden" and cards={false}. Everything in the frame pans and zooms together, so a title left on travels away from the diagram it names and a key leaves the frame at exactly the zoom that made a reader want it.',
      },
      {
        kind: 'do',
        text: 'Move the view through the ref — zoomIn, zoomOut, reset, centerOn — rather than re-rendering the child at a new size. centerOn takes a point in the content’s own coordinates, which is what a minimap reports back.',
      },
      {
        kind: 'do',
        text: 'Hand onViewChange straight to a minimap. Each view carries the frame it was measured against as well as the scale and the offset, and that pair is the whole of the arithmetic a viewport rectangle is — the frame being the one number nothing outside the canvas can measure.',
      },
      {
        kind: 'dont',
        text: 'Nothing clamps the pan. The offset is whatever the drag or the arrow keys left it at, so the artwork can be pushed entirely outside the frame; 0 and the reset button are the whole way back, and controls={false} without a replacement takes the pointer’s half of that away.',
      },
      {
        kind: 'dont',
        text: 'The scale stops at 0.35. A figure more than about three times the frame cannot be zoomed out far enough to be seen whole, so the frame has to be sized for the diagram — a minimap answers where you are, never what is there.',
      },
      {
        kind: 'dont',
        text: 'The wheel is left alone and the thumb is not: the frame sets touch-action to none, so a finger dragged inside it pans the diagram and never scrolls the page. A full-width canvas in an article is a band a touch reader has to swipe around rather than through, which is the argument for giving it a height short enough to leave page beside it.',
      },
    ],
    accessibility: [
      'The frame is a real tab stop, so the keyboard controls can be pressed at all.',
      'A plain wheel scrolls the page. Zoom needs the platform modifier, so the canvas is never a scroll trap in the middle of an article.',
    ],
    keyboard: [
      { keys: ['+', '='], does: 'Zooms in about the centre of the frame.' },
      { keys: ['-'], does: 'Zooms out.' },
      { keys: ['0'], does: 'Resets the scale and the offset together.' },
      { keys: ['\u2190', '\u2192', '\u2191', '\u2193'], does: 'Pans. Shift pans further per press.' },
    ],
    related: ['diagram-minimap', 'architecture-figure', 'scroll-area'],
  },
  {
    name: 'DiagramToolbar',
    group: 'Diagrams',
    summary: 'A bar of actions belonging to the surface underneath them.',
    when: 'FloatingIconButton is one pinned action. This is the container for several, so they read as one object rather than as a scatter.',
    anatomy: [
      {
        element: 'Bar',
        required: true,
        description:
          'role="toolbar" with a horizontal orientation, on a panel plate with a hairline and the system’s corner. One plate and one border is what makes six pinned buttons read as one object instead of as six.',
      },
      {
        element: 'Name',
        required: true,
        description:
          'label, which becomes the bar’s accessible name. It is a required prop with no default, because a toolbar that announces its role and nothing else is a group a screen reader cannot tell from the next one.',
      },
      {
        element: 'Group',
        required: true,
        description:
          'DiagramToolbarGroup: one run of related controls, divided by a hairline on its leading edge rather than by space. The first group carries no rule, so the bar does not open with a divider.',
      },
      {
        element: 'Controls',
        required: true,
        description:
          'The children, at whatever size the caller gives them. The bar sets the gap and paints no state of its own — a button in here is the same button it is anywhere else.',
      },
      {
        element: 'Pin',
        description:
          'placement="floating" takes the bar out of the flow and pins it to the top edge of the nearest POSITIONED ancestor, at the sticky rank — under every anchored panel and every dialog — with align choosing the corner. placement="inline" leaves it in the flow and pins nothing.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Give label the bar’s job rather than its shape — "Diagram actions", not "Toolbar" — because a page with a figure and a table otherwise announces two toolbars and distinguishes neither.',
      },
      {
        kind: 'do',
        text: 'Divide with DiagramToolbarGroup rather than with a gap. The rule is drawn on the group, and a gap wide enough to read as a boundary is also wide enough to stop the bar reading as one object, which is the reason the controls were collected at all.',
      },
      {
        kind: 'do',
        text: 'Keep it to a handful of controls. There is no roving focus here, so Tab visits every one of them: ten actions in the bar is ten stops between the reader and the rest of the page.',
      },
      {
        kind: 'dont',
        text: 'A floating bar sits over the surface, not beside it. Whatever is in that corner of the figure is underneath it — pad the surface, or use placement="inline" and let the bar take its own row.',
      },
      {
        kind: 'dont',
        text: 'role="toolbar" is a promise about the keyboard as well as a name: a reader is told this is a toolbar and expects the arrow keys to move inside it. For two buttons that merely sit next to each other, a plain div makes no promise this component then has to keep.',
      },
      {
        kind: 'dont',
        text: 'A floating bar is a SIBLING of the canvas inside a positioned wrapper, never a child of it. Everything handed to DiagramCanvas renders inside the transformed stage, so a bar passed as a child zooms and pans away with the diagram it was put there to control — and with no positioned ancestor at all it pins to whichever box further up the page happens to be one.',
      },
    ],
    accessibility: [
      'role="toolbar" announces a toolbar rather than six unrelated buttons. It does not implement roving focus \u2014 Tab visits every control, which is honest for a bar of three.',
    ],
    related: ['floating-icon-button', 'diagram-export-menu'],
  },
  {
    name: 'DiagramExportMenu',
    group: 'Diagrams',
    summary: 'Taking the figure off the page: PNG, JPEG, WebP, SVG and a 1200\u00d7630 share card.',
    when: 'It does the export rather than emitting a format name, because the interesting half \u2014 baking custom properties into real colours before serialising \u2014 is the half a caller would not know to write.',
    anatomy: [
      {
        element: 'Trigger',
        required: true,
        description:
          'A small secondary button reading Export, or whatever trigger replaces it \u2014 the replacement is slotted, so it becomes the menu\u2019s own control rather than sitting next to one.',
      },
      {
        element: 'Menu',
        required: true,
        description:
          'A dropdown aligned to the trigger\u2019s end, in three labelled groups separated by rules: Image, Vector, Share. The grouping is the answer to "which of these five do I want".',
      },
      {
        element: 'Format row',
        required: true,
        description:
          'One menu row per format, with its name and a mono hint under it \u2014 "Lossless, 2\u00d7 for retina", "Compact, flattened onto paper". Real menu rows, so the arrow keys walk them, typing jumps to one, and picking one closes the menu over the file it just wrote. The running one gains an ellipsis and every row is disabled until it finishes, so a second click cannot start a second export.',
      },
      {
        element: 'Serialiser',
        required: true,
        description:
          'The part with nothing to point at: the artwork is cloned, every node\u2019s computed paint is written inline, and the clone is placed on a plate the size of the picture plus its padding. It is what stops var(--ink) arriving in a document with no stylesheet and painting nothing.',
      },
      {
        element: 'Share card',
        description:
          'A fixed 1200 \u00d7 630 frame with the title printed on it and the whole diagram letterboxed inside \u2014 never cropped to fill, because a card cropped to fill is a picture of a different diagram.',
      },
      {
        element: 'Result',
        description:
          'onResult, called with the format, an ok or the Error, and the source that produced it. It is the only place a failed export is reported.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Point targetRef at the wrapper rather than at an svg you found yourself. The export looks for the artwork marker first, which is what stops a page whose toolbar sits inside the same wrapper from exporting a picture of a chevron.',
      },
      {
        kind: 'do',
        text: 'Export after the artwork has been measured. The serialiser reads the element\u2019s box and throws when it is still zero, so a call made in the same tick as the mount fails loudly instead of writing an empty file.',
      },
      {
        kind: 'do',
        text: 'Take onResult and put a failure in front of the reader. An unmeasured figure, a canvas tainted by a cross-origin image, a browser that returned no 2D context \u2014 each is reported there rather than thrown at the click, and the alternative is a menu item that quietly does nothing.',
      },
      {
        kind: 'do',
        text: 'Read source alongside ok. built-in says a file reached the browser; caller says your own onExport resolved, which is exactly what a handler that did nothing also does \u2014 the menu cannot see inside your pipeline and no longer reports as though it can.',
      },
      {
        kind: 'do',
        text: 'Pass background={null} for a figure going onto a coloured page. Every other export paints the reader\u2019s own surface behind the artwork, and JPEG is flattened onto that surface whatever this says, because a transparent JPEG is a black one.',
      },
      {
        kind: 'dont',
        text: 'The file is the artwork and the theme the reader was in. Paint is read off the live element, so a figure exported from a dark page is a dark image in a light document; and the toolbar, the inspector and the figure\u2019s own hidden summary list are HTML, so none of them travels with it.',
      },
      {
        kind: 'dont',
        text: 'Do not treat the SVG as a pixel-exact record. The isolated document cannot fetch the page\u2019s web fonts, so the type falls back to what the machine has \u2014 the words and the line breaks are already fixed, but a name that just fitted its plate on screen can overrun its own rule in the file.',
      },
      {
        kind: 'dont',
        text: 'The output is sized from the artwork\u2019s box ON SCREEN rather than from its viewBox, so a figure sitting at 4\u00d7 inside a DiagramCanvas serialises four times larger and then rasterises at 2\u00d7 on top of that. Reset the view before exporting, or a reader gets a file whose dimensions record where the zoom happened to be.',
      },
    ],
    accessibility: [
      'A failed export is reported through onResult rather than swallowed: a click that quietly does nothing is indistinguishable from a broken button.',
    ],
    related: ['dropdown-menu', 'diagram-toolbar'],
  },
  {
    name: 'DiagramInspector',
    group: 'Diagrams',
    summary: 'What the reader just picked, written out beside the picture.',
    when: 'A node holds about eight words before it stops being a node. Everything past those \u2014 the port, the owner, the six relationships \u2014 belongs here.',
    anatomy: [
      {
        element: 'Region',
        required: true,
        description:
          'A <section> named "<title> details" with aria-live="polite", on a panel plate. A region and not a dialog: nothing traps focus and nothing demands dismissal, because the reader clicked a node rather than opening a window.',
      },
      {
        element: 'Heading',
        required: true,
        description:
          'The eyebrow over the title \u2014 what KIND of thing this is, then what it is called. The eyebrow is where the plate\u2019s own kicker word belongs, so the panel and the picture say the same thing about the same node.',
      },
      {
        element: 'Facts',
        description:
          'A definition list, one term and value per row, the value settable in mono for an id, a path, a port. A list rather than a grid of divs, because a grid tells a screen reader nothing about which value belongs to which label.',
      },
      {
        element: 'Relationships',
        description:
          'One row per edge the node takes part in, each becoming a real button when it carries onSelect. The arrow glyph is hidden and the direction spelled out beside it, so "to" and "from" are heard rather than guessed.',
      },
      {
        element: 'Close',
        description:
          'A small control named for what it does \u2014 clearing the selection, not closing a window. It is the only thing that can empty the panel.',
      },
      {
        element: 'Actions',
        description:
          'A wrap of caller-supplied buttons under the facts: copy the id, open the source the node was read out of.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Pair it with the figure\u2019s onSelectNode. That is what turns the hidden summary list into real buttons, and without it the panel can only ever be filled by a pointer \u2014 the plates in the picture are presentational by construction.',
      },
      {
        kind: 'do',
        text: 'Give every relationship an onSelect. The rows become buttons and the graph becomes walkable peer by peer, which is how a keyboard reader gets from a node to the node it is connected to without going back through the list.',
      },
      {
        kind: 'do',
        text: 'Move the long facts here and leave about eight words on the plate. A box holding a port, an owning team and a file path grows to fit all three rather than clipping them, and a figure of boxes that size is a document with lines drawn on it.',
      },
      {
        kind: 'dont',
        text: 'Two facts sharing a label are two rows, and neither says which is which. They are keyed by position, so both render \u2014 and a panel with "Source" twice leaves the reader deducing from the values what the labels should have said. Name them apart when they mean different things.',
      },
      {
        kind: 'dont',
        text: 'floating pins the panel over the surface, so it covers that corner of the diagram for as long as it is mounted. It has no dismissal contract of its own \u2014 passing no onClose leaves the reader nothing to press and the corner hidden until the selection changes.',
      },
    ],
    accessibility: [
      'A labelled region with aria-live="polite", not a dialog: the reader clicked a node, they did not open anything, so focus is never trapped or demanded.',
      'Relationships are real buttons when they carry onSelect, which is how the graph becomes walkable peer by peer from the keyboard.',
    ],
    related: ['card', 'diagram-canvas'],
  },
  {
    name: 'DiagramMinimap',
    group: 'Diagrams',
    summary: 'Where you are in something bigger than the window.',
    when: 'Pairs with DiagramCanvas. The viewport rectangle is derived from the canvas\u2019s own view, never stored \u2014 a map that disagrees with its territory is worse than none.',
    anatomy: [
      {
        element: 'Map frame',
        required: true,
        description:
          'A fixed-width plate \u2014 200px unless width says otherwise \u2014 whose height follows the artwork\u2019s own aspect ratio, named as a group so it is not an unlabelled box beside the figure.',
      },
      {
        element: 'Miniature',
        required: true,
        description:
          'The children under a CSS scale of width over content.width, anchored top-left, hidden from assistive technology and transparent to the pointer. Drawn only once content has a size \u2014 at width 0 the scale would be 1 and the miniature would be the artwork\u2019s top-left corner at full size. It answers "what is there" at a glance and nothing more.',
      },
      {
        element: 'Viewport rectangle',
        required: true,
        description:
          'An accent-washed rectangle computed from the canvas\u2019s view and the map\u2019s scale, clipped to the plate so a viewport panned past the artwork stops claiming a map that reaches further, and floored at a few pixels so a deep zoom still leaves something on screen to see. It is derived on every render and never stored.',
      },
      {
        element: 'Seek layer',
        description:
          'The transparent layer over the map that turns a press, or a drag that STARTED on it, into a point in CONTENT coordinates and hands it to onSeek. A button pressed elsewhere and dragged across it moves nothing. Nor does the map itself \u2014 it has no authority over the view.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Feed it the canvas\u2019s own onViewChange. The rectangle is arithmetic on those three numbers, so a map wired that way cannot disagree with the frame it maps \u2014 and keeping a second copy of where the viewport is, is exactly how one comes to.',
      },
      {
        kind: 'do',
        text: 'Measure content at the artwork\u2019s natural CSS size. Everything here is scaled by width over content.width, so a wrong content width scales the miniature and the rectangle by the same wrong factor: the map still looks plausible and points at the wrong part of the picture. A width of 0 draws an empty plate instead, which is what a measurement that has not landed yet should look like.',
      },
      {
        kind: 'do',
        text: 'Let the canvas say how big the frame is. Every view a DiagramCanvas emits carries the frame it was measured against, so passing onViewChange through is enough \u2014 the frame prop is for a frame this component cannot be told about, and a hand-declared one is the single number that makes the rectangle lie.',
      },
      {
        kind: 'do',
        text: 'Send onSeek straight to the canvas handle\u2019s centerOn. The point arrives in content coordinates, which is the space centerOn already takes, so recentring needs no conversion of your own.',
      },
      {
        kind: 'dont',
        text: 'It is pointer-only and hidden from assistive technology: no tab stop, no keys, and the miniature deliberately publishes nothing because the figure it mirrors already does. The canvas\u2019s arrow keys stay the keyboard\u2019s route to a far corner, so the minimap must never be the only way to reach one.',
      },
      {
        kind: 'dont',
        text: 'The miniature is the same markup shrunk, not a simplified drawing \u2014 every label goes down with it, so a wide figure at 200px is a shape rather than a reading copy. It answers where you are; what a node says is the figure\u2019s job.',
      },
    ],
    accessibility: [
      'The miniature is aria-hidden. The figure it mirrors already publishes its own summary, and a second copy would read the whole diagram out twice.',
    ],
    related: ['diagram-canvas'],
  },
  {
    name: 'DiagramLegend',
    group: 'Diagrams',
    summary: 'The key: which drawn form means which kind of thing.',
    when: 'Not optional furniture in a monochrome system. When a queue and a cache differ by a sigil rather than a colour, this is the only place a reader is told what the sigil means.',
    anatomy: [
      {
        element: 'Row',
        required: true,
        description:
          'A wrapping, baseline-aligned row over a top rule. Inside a figure it sits between the picture and the conclusion cards, which is where a reader looks after failing to recognise a mark.',
      },
      {
        element: 'Kicker',
        description:
          'The word Key before the row. title={null} drops it for a bare row, and the list keeps that word as its own accessible name either way.',
      },
      {
        element: 'List',
        required: true,
        description:
          'A <ul> of pairs rather than a row of spans, so the count is part of what a screen reader says about it — "list, six items" is the first useful fact about a key.',
      },
      {
        element: 'Sample',
        required: true,
        description:
          'A 14 × 14 svg carrying the entry’s own markup, hidden from assistive technology. Markup rather than a name from a fixed list, because a key has to show the SAME mark the figure drew.',
      },
      {
        element: 'Label',
        required: true,
        description:
          'The word beside the mark, in the meta voice. The standard builders take it from the same table the plate’s eyebrow prints, so a plate reading SERVICE is never explained by a key reading Datastore.',
      },
    ],
    practices: [
      {
        kind: 'do',
        text: 'Build the entries with kindLegend, variantLegend or stateLegend. They are made out of the renderers’ own drawing code, so the key cannot come to show a mark the figure does not draw or a word the plate does not print.',
      },
      {
        kind: 'do',
        text: 'Leave a figure’s legend at "auto". It lists only the kinds actually drawn; "all" prints seven kinds beside a figure using three, which is four claims the picture does not support.',
      },
      {
        kind: 'do',
        text: 'Pass title={null} when the key sits under a caption that already says what it is. The list keeps Key as its accessible name, so the kicker can go without the row losing its name.',
      },
      {
        kind: 'dont',
        text: 'A key is not where a distinction is MADE. The two state tokens are the only hues these figures spend and each terminal is also its own plate shape — a difference carried by colour alone is one a reader can only look up, an entry at a time, after noticing there is a key at all.',
      },
      {
        kind: 'dont',
        text: 'legend="hidden" is not free on a figure of tagged plates. A plate prints its tag OR the kind word in the same eyebrow slot and the tag wins, so on a tagged plate the kind is carried by the sigil alone — hiding the key takes the only thing that teaches that sigil off the page.',
      },
    ],
    accessibility: [
      'A list of pairs rather than a row of spans, so the count is part of what a screen reader says about it.',
      'kindLegend, variantLegend and stateLegend build the standard sets out of the renderers\u2019 own drawing code, so the key can never drift from the figure.',
    ],
    related: ['architecture-figure', 'lifecycle-figure'],
  },
]
