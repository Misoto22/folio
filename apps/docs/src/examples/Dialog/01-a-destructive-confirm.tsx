'use client'

import { Button, Dialog, DialogClose, DialogContent, DialogTrigger } from '@misoto22/folio'

/**
 * One question, two answers, and nothing else in the panel. Both controls are
 * wrapped in DialogClose rather than flipping state by hand: the close then
 * runs through Radix, which returns focus to the trigger instead of dropping it
 * at the top of the document. title is what names the modal — leave it out and
 * the fallback accessible name is the literal word Dialog, so every unnamed
 * modal in an app is announced as the same thing. Reach for this shape when the
 * answer is yes or no; anything longer has become a Sheet.
 */
export function Example() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="danger">Delete frame</Button>
      </DialogTrigger>
      <DialogContent
        title="Delete this frame?"
        description="It will be removed from the archive and from every collection it appears in."
      >
        <div className="mt-6 flex justify-end gap-3">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="danger">Delete</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
