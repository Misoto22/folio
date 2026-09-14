# Colour, theming and spacing

The system is monochrome by construction: paper ground, near-black mark, and
status is the only chroma. A raw colour class is not a style choice here, it is
a hole in the theme — it survives the light/dark swap unchanged and it ignores
every surface axis.

## Never write a raw colour

```tsx
// Incorrect
<div className="bg-white text-gray-500 border-neutral-200">
<div className="bg-neutral-900 dark:bg-white">
<div style={{ color: '#101010' }}>

// Correct
<div className="bg-(--background) text-(--foreground-muted) border-(--border-color)">
```

The semantic layer is the one to read. It is shipped as its own entry point
(`@misoto22/folio/semantic.css`) and it is what the components themselves use.

| Role | Token |
| --- | --- |
| Page ground | `--background` |
| One step off the ground | `--background-elevated` |
| Card ground | `--card-background` |
| Body text | `--foreground` |
| Quieter text | `--foreground-muted` |
| Quietest text that still clears AA | `--secondary-text` |
| Edge | `--border-color` |
| Hairline | `--border-subtle` |
| A chosen state — primary button, checked box, active tab | `--accent` |
| Text on an accent fill | `--accent-foreground` |
| Text on an accent wash | `--accent-on-muted` |
| Status | `--success` `--warning` `--danger` `--info`, each with a `-wash` |
| Text over a photograph | `--on-dark` |

Prefer these over the primitive layer (`--paper`, `--ink`, `--rule`, `--stone`).
Primitives are values; semantics are roles, and a role can be re-pointed without
a component changing. `--card-background` is already an alias for a surface that
was retired — that is the layer doing its job.

## Never write a `dark:` variant

```tsx
// Incorrect — freezes one side of the swap
<div className="bg-white dark:bg-neutral-900">

// Correct — the token already resolves in both
<div className="bg-(--background)">
```

Dark mode is a value swap on the primitives behind `[data-mode="dark"]`. Any
semantic token re-resolves on its own. A `dark:` class is a second, competing
theme that will disagree with the first the moment a surface axis is set.

## Theme with the seven axes

Each is an attribute, each is independent, and each works on **any element** —
not just `:root`. An unset axis is the default.

| Attribute | Values | Unset means |
| --- | --- | --- |
| `data-mode` | `light` `dark` | follows the app |
| `data-accent` | `clay` `cobalt` `forest` `moss` `plum` | ink |
| `data-surface` | `warm` `cool` `glass` | paper |
| `data-radius` | `sharp` `round` | the default ladder |
| `data-rules` | `quiet` `firm` | hairline |
| `data-type` | `grotesk` `bookish` | editorial |
| `data-motion` | `still` `snappy` | calm |
| `data-density` | `compact` | comfortable |

```tsx
// A warm, square, dense panel inside an otherwise default page.
<section data-surface="warm" data-radius="sharp" data-density="compact">…</section>
```

The accent is **one token**, `--clay`, which every component reads through
`--accent`. The attribute is the five shipped hues plus `ink`; a brand that is
none of them re-points the token itself, and the whole system follows.

```css
/* An accent the package has never seen. Both values: the mark, and the same
   colour set as text, which has to clear AA on paper. */
[data-accent='brand'] { --clay: #1f6f5c; --clay-ink: #1a5c4c; }
```

## Radius, duration and control size come from tokens

```tsx
// Incorrect
<div className="rounded-lg duration-150 min-h-11">

// Correct
<div className="rounded-(--radius) duration-(--duration-fast) min-h-(--control-h-md)">
```

`--control-h-md` is 44px comfortable / 36px compact. Hard-coding `min-h-11`
means the control never responds to `data-density`, and `min-height` is a floor,
so it also never shrinks.

Durations: `--duration-fast` `--duration-base` `--duration-slow`. Easing:
`--ease-out-expo`.

## No blurred shadow

`--shadow`, `--shadow-sm` and `--shadow-lg` all resolve to `none` on purpose.
The system has no elevation ramp. Depth is a hairline, a change of ground, or
`--lift` — a hard ink offset with no blur.

```tsx
// Incorrect
<div className="shadow-lg">

// Correct
<div className="shadow-(--lift)">
```

## Logical properties, always

The package is RTL-correct and a physical property breaks it.

```tsx
// Incorrect
<div className="pl-4 ml-2 text-left border-l">

// Correct
<div className="ps-4 ms-2 text-start border-s">
```

Tailwind has no logical `translate`, so anything sliding along the inline axis
needs an explicit `rtl:` counterpart.
