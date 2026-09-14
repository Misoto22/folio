'use client'

import {
  Button,
  Field,
  Input,
  Popover,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@misoto22/folio'

/**
 * The panel is positioned against the row it edits, not against the toolbar
 * button that opened it. That is what PopoverAnchor is for: without it the
 * panel tracks the trigger and drifts away from the thing being changed, which
 * on a long table means an editor floating at the top of the screen over a row
 * near the bottom. The trigger stays the trigger — focus still returns to it on
 * Escape — only the geometry moves.
 */
export function Example() {
  return (
    <Popover>
      <div className="flex w-full max-w-sm flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <Text size="sm" tone="muted">Selected row</Text>
          <PopoverTrigger asChild>
            <Button variant="secondary" size="sm">Rename</Button>
          </PopoverTrigger>
        </div>
        <PopoverAnchor asChild>
          <div className="flex items-center justify-between gap-3 rounded-(--radius) border border-(--accent) bg-(--accent-muted) px-4 py-3">
            <span className="font-mono text-sm text-(--ink)">codex/photo-cache</span>
            <span className="mono-meta text-(--ink-3-aa)">62s</span>
          </div>
        </PopoverAnchor>
      </div>
      <PopoverContent label="Rename this branch" showClose>
        <div className="flex flex-col gap-4">
          <Field label="Branch name">
            <Input defaultValue="codex/photo-cache" />
          </Field>
          <PopoverClose asChild>
            <Button size="sm">Rename</Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}
