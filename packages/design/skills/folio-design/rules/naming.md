# Naming — where habit produces an import that does not exist

Most models have read far more shadcn/ui and Radix than they have read this
package. Those habits produce identifiers that are not exported here, and the
failure is a TypeScript error at the import line rather than something subtle.

This is the whole divergence list. Everything not on it is spelled the way you
would guess.

## Compound parts renamed

| Habit | Here |
| --- | --- |
| `CardContent` | `CardBody` |
| `TableHeader` | `THead` |
| `TableBody` | `TBody` |
| `TableRow` | `TR` |
| `TableHead` | `TH` |
| `TableCell` | `TD` |

```tsx
// Incorrect
<Card><CardContent>…</CardContent></Card>

// Correct
<Card><CardBody>…</CardBody></Card>
```

## Compounds that are one component with props

These have no sub-parts at all. Reaching for `<XTrigger>` / `<XContent>` fails.

### Dialog and Sheet — the title is a prop

```tsx
// Incorrect — DialogTitle and DialogHeader are not exported
<DialogContent>
  <DialogHeader><DialogTitle>Delete project</DialogTitle></DialogHeader>
  …
</DialogContent>

// Correct
<DialogContent title="Delete project" description="This cannot be undone.">
  …
</DialogContent>
```

`Sheet` is the same shape, and `SheetTitle` does not exist either:

```tsx
// Incorrect
<SheetContent><SheetTitle>Filters</SheetTitle>…</SheetContent>

// Correct
<SheetContent side="end" title="Filters">…</SheetContent>
```

`SheetContent.title` is required by the type. `DialogContent.title` is optional
— Radix demands a title either way, so omitting it renders a visually-hidden
placeholder rather than warning. Pass it anyway: the placeholder keeps the modal
legal, not useful. When the design calls for no visible heading, pass the title
and add `hideTitle`, so the accessible name is a real one.

### Tooltip — the content is a prop, and it wraps its trigger

```tsx
// Incorrect
<Tooltip>
  <TooltipTrigger asChild><Button /></TooltipTrigger>
  <TooltipContent>Copy</TooltipContent>
</Tooltip>

// Correct — put TooltipProvider once at the app root
<Tooltip content="Copy"><Button iconOnly aria-label="Copy"><CopyIcon /></Button></Tooltip>
```

### Alert and EmptyState — tone and title are props

```tsx
// Incorrect
<Alert><AlertTitle>Saved</AlertTitle><AlertDescription>…</AlertDescription></Alert>

// Correct
<Alert tone="success" title="Saved">Your changes are live.</Alert>
```

`EmptyState` is the same shape: `icon` (a Remix Icon component, not an element),
`title`, `description`, `action`.

### Accordion — the item carries its own title

```tsx
// Incorrect
<AccordionItem value="a">
  <AccordionTrigger>Billing</AccordionTrigger>
  <AccordionContent>…</AccordionContent>
</AccordionItem>

// Correct
<AccordionItem value="a" title="Billing">…</AccordionItem>
```

### Select — one component, `SelectItem` children

```tsx
// Incorrect
<Select>
  <SelectTrigger><SelectValue placeholder="Choose" /></SelectTrigger>
  <SelectContent><SelectItem value="au">Australia</SelectItem></SelectContent>
</Select>

// Correct — label is required
<Select label="Region" placeholder="Choose">
  <SelectItem value="au">Australia</SelectItem>
</Select>
```

`SelectRoot` is the raw Radix root, exported for the rare case that needs it.
Reach for `Select` unless you know why you are not.

### Combobox — an options array, not children

```tsx
// Correct
<Combobox
  label="Assignee"
  options={[{ value: 'ada', label: 'Ada Lovelace' }]}
  value={value}
  onValueChange={setValue}
/>
```

## Compounds that ARE compounds

Spelled as expected, no surprises: `Popover`, `DropdownMenu`, `ContextMenu`,
`Command`, `Tabs`, `Collapsible`, `RadioGroup`, `ToggleGroup`, `Skeleton`.

## Imports that come from here, not from upstream

| Habit | Here |
| --- | --- |
| `import { toast } from 'sonner'` | `import { toast } from '@misoto22/folio'` |
| `import { cn } from '@/lib/utils'` | `import { cn } from '@misoto22/folio'` |

`<Toaster />` goes once at the app root, and it is exported from here too.

## When in doubt

```bash
npx folio-design docs <Component>
```

That prints the component's real exports, every prop with its type and default,
and its keyboard contract, read out of the installed source. It is cheaper than
a wrong import and a retry.
