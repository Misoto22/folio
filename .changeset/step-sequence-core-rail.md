---
'@misoto22/design': patch
---

`StepSequence` now draws the core `Steps` rail, and `ClipboardButton` shares `CodeBlock`'s copy state, including what a refused clipboard write does.

The website rail was a second implementation of the same figure — marker, connector, name and note — at its own sizes. It now renders through the same internal rail item as `Steps`, so its markers are the core 2rem circles with sans counters and the anchor no longer sets its label in medium weight. Host counters, tags, the caption, `data-anchor` and the ARIA list roles that keep article prose from restyling it are unchanged, and the anchor is still not announced as the current step.

Both copy controls confirm for 1600ms from the latest accepted write. A refused write now clears any confirmation still showing instead of leaving it up, and names the refusal once in development as `CLIPBOARD_WRITE_REJECTED`.
