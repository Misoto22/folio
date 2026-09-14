---
"@misoto22/design": minor
---

`styles.css` no longer carries the website compositions: import `website.css` for
them, and the new `website-base.css` for a whole site's document defaults.

An application that wanted only the primitives received about 1,300 lines of
website CSS, and some of it reached the whole document: a body font size and
background, zeroed heading and paragraph margins, one focus ring on every link
and control, and a restyle of every `DropdownMenu`.

`website.css` now holds only rules scoped to a composition's classes, and its
menu styling reaches only the menus the compositions open. The body, heading,
paragraph and link defaults, the scrollbar gutter, the `:lang(zh)` spacing and
the site-wide focus ring move to `@misoto22/design/website-base.css`.

That ring now sits in the base layer, so a primitive's own outline utility wins
over it again. Unlayered, it beat `outline-none` and drew a clipped square around
the `Command` input in every host that loaded the website styles.

`website-motion.css` is removed. No component used its unprefixed classes and
keyframes, and its `@keyframes pulse` shared a name with the one Tailwind's
`animate-pulse` reads.

The chart surface's keyboard focus ring moves to `keyframes.css`, so an
application on `styles.css` keeps it.

To migrate a website host, add the imports it now needs beside its existing
stylesheet:

- `@import '@misoto22/design/website.css';` for the compositions.
- `@import '@misoto22/design/website-base.css';` for the document defaults and the focus ring, when the whole page is a website.
- Copy any of `.route-enter`, `.panel-in`, `.sheet-in`, `.scrim-in`, `.ask-launcher` or `::highlight(ask-passage)` the host still uses into its own stylesheet.

An application that renders only the primitives needs no change.
