'use client'

import {
  Badge,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  Heading,
  Text,
} from '@misoto22/folio'

/**
 * A panel that draws its own header — an eyebrow above the title, a badge
 * beside it — which the plain title line cannot express. hideTitle stops that
 * line rendering twice while title still names the dialog for a screen reader,
 * so pass it even here: with no title at all the accessible name falls back to
 * the literal word Dialog. hideTitle takes the description with it, because the
 * two share one wrapper, so anything the reader has to read goes in the
 * children. Leave showClose on, as it is by default: Escape and the scrim are
 * the only other ways out and neither of them is visible.
 */
export function Example() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Review the release</Button>
      </DialogTrigger>
      <DialogContent title="Release 0.4.0" hideTitle>
        <div className="flex items-center gap-3">
          <span className="eyebrow text-(--ink-3-aa)">changeset</span>
          <Badge tone="success">ready</Badge>
        </div>
        <Heading level={2} size="item" className="mt-2">
          Release 0.4.0
        </Heading>
        <Text size="sm" className="mt-3">
          Five packages, one minor bump. The tag is cut when this merges, and the
          registry has the tarball about ninety seconds later.
        </Text>
        <div className="mt-6 flex justify-end gap-3">
          <DialogClose asChild>
            <Button variant="secondary">Not yet</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Merge and tag</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
