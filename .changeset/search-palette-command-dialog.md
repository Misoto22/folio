---
'@misoto22/design': minor
---

`CommandDialog` takes `shouldFilter`, `inputLabel` and its dialog's focus and Escape handlers, and `SearchPalette` is now built on it instead of beside it.

`SearchPalette` rebuilt the same modal by hand — a `Dialog` holding a `Command`, placed above centre — and restyled the library's own row and heading attributes to get there, so a change to either palette could move one and leave the other behind. It now renders `CommandDialog`, takes its geometry and its list, and styles only the elements it renders itself.

The new props are the hooks it could not do without, forwarded unchanged: `shouldFilter` for results a host has already filtered, `inputLabel` for a field named apart from its dialog, and `onOpenAutoFocus`, `onCloseAutoFocus` and `onEscapeKeyDown` for returning focus to whatever opened a palette that has no `DialogTrigger`, and for a detail view that Escape leaves rather than closes.
