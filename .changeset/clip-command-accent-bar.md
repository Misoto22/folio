---
'@misoto22/design': patch
---

`CommandItem`'s active-row accent bar now clips to the row's own corner radius, so it no longer pokes past a rounded highlight.

The bar is an absolutely-positioned `::before`, and a rounded parent does not clip an absolutely-positioned child by default — only `overflow-hidden` on the row does. At `data-radius="round"`, `--radius-row` reaches 18px and the bar's flat edge stuck out past the highlight's curve by close to 7px; at the default radius the miss was under a pixel, and at `sharp` there was none, which is why the defect went unnoticed until the round theme was checked directly.

Every other child — icon, meta, shortcut — stays clear of the newly-clipped corners at every radius, the closest any of them comes to a corner's arc centre being about 7px on an 18px arc. The focus ring is unaffected too: `outline` paints outside an element's border box, which its own `overflow` never clips. `Combobox` and `SearchableMenu` render their rows through this same `CommandItem`, so both pick up the fix without a separate change; `DropdownMenu`, `ContextMenu`, `Select`, `NavItem` and `Sidebar` highlight a row with a plain background fill and carry no accent bar, so none of them shared the defect.
