# Folio design system — conventions

A warm, editorial, flat design system: warm-cream / ink palette, Cormorant
Garamond display + Geist body + JetBrains Mono labels. Body text on the base
surfaces is WCAG AAA in both themes (text on elevated surfaces and accent fills
meets AA). Build with the real components below; style your own layout glue with
the tokens — never invent colors or hardcode hex.

## Setup

Import the stylesheet once at the app root — it ships the tokens, fonts, and
component styles:

```tsx
import '@misoto22/folio/styles.css'
```

Dark mode is a class toggle: put `class="dark"` on `<html>` (or any ancestor)
and every token flips. No provider, no theme object — the tokens are plain CSS
custom properties, so a component is styled the moment `styles.css` is present.

## Styling idiom — semantic tokens, never raw color

Colors/shape come from CSS custom properties, consumed two ways:
- **Tailwind v4 arbitrary-property syntax** (how the components are built):
  `bg-(--card-background)`, `text-(--foreground)`, `border-(--border-color)`,
  `rounded-(--radius)`.
- **Plain CSS** for your own glue: `style={{ color: 'var(--secondary-text)' }}`.

The full token vocabulary (use ONLY these for color/shape):

| Group | Tokens |
|---|---|
| Surfaces | `--background`, `--background-elevated`, `--card-background`, `--code-background`, `--nav-background` |
| Text | `--foreground`, `--foreground-muted`, `--secondary-text`, `--on-dark` |
| Lines | `--border-color`, `--border-subtle` |
| Accent | `--accent`, `--accent-hover`, `--accent-muted` (fills), `--accent-wash` (faint tint), `--accent-foreground` (on accent fills) |
| Status | `--success`, `--danger`, `--warning`, `--info` |
| Radius | `--radius-sm` 8px (chips) · `--radius` 12px (controls) · `--radius-lg` 18px (cards/dialogs) · `--radius-pill` |
| Elevation | `--shadow-sm`, `--shadow`, `--shadow-lg` |
| Motion | `--ease-out-expo` · `--duration-fast\|base\|slow` |
| Spacing | `--space-1` … `--space-10` (4px base) |
| Type scale | Tailwind built-in `--text-*` / `--leading-*` · custom `--tracking-label` |
| Focus / state | `--ring`, `--ring-offset` · `--overlay` (modal scrim) · `--disabled-opacity` |
| Z-index | `--z-dropdown` · `--z-sticky` · `--z-overlay` · `--z-modal` · `--z-toast` |

Type: `--font-sans` (Geist, body), `--font-heading` (Cormorant Garamond, display
headings), `--font-mono` (JetBrains Mono, labels). Two label utility classes:
`eyebrow` (uppercase mono kicker — pair with a `text-*` color) and `mono-meta`
(inline metadata). Headings that should feel editorial use `font-(--font-heading)`.

## Where the truth lives

Read `styles.css` (and its `@import` of `_ds_bundle.css`) for the exact compiled
tokens and component styles, and each component's `<Name>.d.ts` for its props.
Don't restyle a component's internals — compose it and add layout around it.

## Build snippet (idiomatic)

```tsx
import { AppShell, NavItem, Card, CardBody, Button } from '@misoto22/folio'
import { RiDashboardLine, RiFileTextLine } from '@remixicon/react'

export function Dashboard() {
  return (
    <AppShell
      brand={<strong style={{ fontFamily: 'var(--font-heading)' }}>misoto22</strong>}
      sidebar={
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <NavItem href="/" icon={RiDashboardLine} active>Dashboard</NavItem>
          <NavItem href="/posts" icon={RiFileTextLine}>Posts</NavItem>
        </nav>
      }
      topbar={<Button>New post</Button>}
    >
      <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)' }}>Posts</h1>
      <Card><CardBody>A quiet surface for grouped content.</CardBody></Card>
    </AppShell>
  )
}
```

Components are framework-agnostic: ones that navigate render a plain `<a>` — wrap
with your router's Link at the call site. Interactive ones (Dialog, DropdownMenu,
Tabs, Switch, Checkbox, Toaster) are client components; icons come from
`@remixicon/react`, toasts from the `toast` helper exported alongside `Toaster`.
