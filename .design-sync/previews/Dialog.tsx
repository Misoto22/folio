import {
  Dialog,
  DialogContent,
  DialogClose,
  Button,
  Field,
  Input,
  Textarea,
} from '@misoto22/folio'

export function ConfirmDelete() {
  return (
    <Dialog open>
      <DialogContent
        title="Delete post?"
        description="“Building a private blog” will be permanently removed. This action cannot be undone."
      >
        <p style={{ margin: '0 0 20px', color: 'var(--secondary-text)', fontSize: 14, lineHeight: 1.6 }}>
          Any scheduled publish for this post will also be cancelled.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Delete post</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function NewPostForm() {
  return (
    <Dialog open>
      <DialogContent
        title="New post"
        description="Give your draft a title and an optional summary to get started."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          <Field label="Title" htmlFor="post-title" required>
            <Input id="post-title" defaultValue="Building a private blog" />
          </Field>
          <Field label="Slug" htmlFor="post-slug" hint="Used in the public URL.">
            <Input id="post-slug" defaultValue="building-a-private-blog" />
          </Field>
          <Field label="Excerpt" htmlFor="post-excerpt">
            <Textarea
              id="post-excerpt"
              rows={3}
              defaultValue="Notes on gating private posts behind a global password."
            />
          </Field>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button keycap="S">Create draft</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
