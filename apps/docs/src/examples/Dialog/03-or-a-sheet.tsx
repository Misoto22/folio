'use client'

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  Field,
  Input,
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
  Textarea,
} from '@misoto22/folio'

/**
 * The same modal at two lengths. A Dialog stops at 32rem by 85vh and scrolls
 * its own body past that, which is right for one question and wrong for a form:
 * the reader loses the page edge as an anchor and scrolls a box inside a box. A
 * Sheet is the same component docked to an edge — the same scrim, the same
 * focus trap, the same scroll lock — with the full height of the viewport to
 * spend. So the choice is about how much room the content needs, and about
 * nothing else. Both close through DialogClose or SheetClose so focus returns
 * to the trigger.
 */
export function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Rename (dialog)</Button>
        </DialogTrigger>
        <DialogContent title="Rename this collection" description="Its public link does not change.">
          <Field label="Name" className="mt-4">
            <Input defaultValue="Kyoto, February" />
          </Field>
          <div className="mt-6 flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button>Rename</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary">Edit details (sheet)</Button>
        </SheetTrigger>
        <SheetContent
          side="end"
          title="Collection details"
          description="Six fields, and room to see them all at once."
        >
          <div className="mt-4 flex flex-col gap-4">
            <Field label="Name">
              <Input defaultValue="Kyoto, February" />
            </Field>
            <Field label="Slug" hint="Used in the public link.">
              <Input defaultValue="kyoto-february" />
            </Field>
            <Field label="Camera">
              <Input defaultValue="Pentax 67" />
            </Field>
            <Field label="Notes">
              <Textarea rows={4} defaultValue="Portra 400, pushed one stop." />
            </Field>
            <div className="flex justify-end gap-3">
              <SheetClose asChild>
                <Button variant="secondary">Cancel</Button>
              </SheetClose>
              <SheetClose asChild>
                <Button>Save</Button>
              </SheetClose>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
