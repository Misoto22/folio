# Composition

## `className` adjusts layout, never appearance

The caller's `className` is merged last through `cn()`, so it *can* override
anything. That is what makes the rule necessary rather than enforced.

```tsx
// Incorrect — re-skins the component, and only in this one place
<Button className="bg-blue-600 text-white rounded-full px-8 text-lg">

// Correct — the appearance is a variant, the layout is the class
<Button variant="primary" size="lg" className="w-full">
```

Legitimate `className`: `w-`, `flex-`, `grid-`, `col-span-`, `m*`, `self-`,
`order-`. Not legitimate: colour, border, radius, font size, shadow. If the
appearance you want is not reachable through props and the theme axes, that is a
gap in the system — say so rather than patching it at one call site.

## Use `cn()` for conditional classes

```tsx
import { cn } from '@misoto22/folio'

// Incorrect — emits both sides of the conflict; stylesheet order picks a winner
<div className={`p-6 ${dense ? 'p-2' : ''}`}>

// Correct — twMerge resolves by utility group, so p-2 replaces p-6
<div className={cn('p-6', dense && 'p-2')}>
```

## Card uses its full set

```tsx
// Incorrect
<Card><div className="p-6"><h3 className="font-bold">Usage</h3><p>…</p></div></Card>

// Correct
<Card variant="outline">
  <CardHeader><CardTitle>Usage</CardTitle></CardHeader>
  <CardBody>…</CardBody>
  <CardFooter><Button>Manage</Button></CardFooter>
</Card>
```

`variant`: `outline` (default) · `plate` · `flat`. The part is `CardBody`, not
`CardContent` — see [naming.md](./naming.md).

## Reach for a component before writing markup

| Instead of | Use |
| --- | --- |
| a styled div with an icon and a message | `Alert` |
| a centred "nothing here yet" block | `EmptyState` |
| an error page or panel | `ErrorState` |
| `<hr>` or `border-t` | `Separator` |
| a custom `animate-pulse` div | `Skeleton` (+ `SkeletonLine` / `SkeletonText` / `SkeletonPage`) |
| a styled span for a count or state | `Badge`, or `StatusPill` for a live state |
| a styled span for a keyboard key | `Kbd` |
| a hand-built breadcrumb trail | `Breadcrumb` |
| a hand-built page/sidebar frame | `AppShell` |
| a hand-built numbered process | `Steps` |
| long-form prose you did not style yourself | `Article` |

## Navigation goes through `asChild`

No component in this package imports a router. A control that navigates takes
its own element from the call site.

```tsx
// Incorrect in a Next.js app — a full page load
<Button href="/settings">Settings</Button>

// Correct
<Button asChild><Link href="/settings">Settings</Link></Button>
```

`href` on `Button` renders a plain `<a>`. That is right for an external link and
wrong for in-app navigation.

## Overlays own their own stacking

`Dialog`, `Sheet`, `Popover`, `DropdownMenu`, `ContextMenu` and `Tooltip` portal
themselves and read `--z-overlay` / `--z-dropdown`.

```tsx
// Incorrect
<DialogContent title="Edit" className="z-50">

// Correct
<DialogContent title="Edit">
```

`TooltipProvider` goes once at the app root; `Toaster` too.

## Logical properties, always

`ps-` / `pe-` / `ms-` / `me-` / `start-` / `end-` / `text-start` / `border-s`.
A physical property breaks RTL, and the package is RTL-correct everywhere else.

## Server and client

The package is compiled per-file, so `'use client'` sits on the components that
need it. `Button`, `Card`, `Badge`, `Table`, `Alert`, `Separator` and the other
static primitives stay server-renderable; anything wrapping Radix carries the
directive itself. Do not add `'use client'` to a page just because it imports
from here.
