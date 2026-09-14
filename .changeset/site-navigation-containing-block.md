---
'@misoto22/design': patch
---

`SiteNavigation` takes its width from its containing block, so a transformed or contained frame keeps the whole masthead inside it.

The header pinned itself to `window.innerWidth` so that an overlay's scroll lock could not change its width in a WebView. That is right against the viewport and wrong anywhere else: under an ancestor with a `transform` or `contain: layout` — a device preview, an embedded console, a documentation card — a fixed header is laid out against that ancestor, and a window-wide width pushed its links and preferences out past the frame's edge.

It now pins a width only when the stylesheet's `inline-size: 100%` already resolves to the viewport, and otherwise leaves the width to the containing block.
