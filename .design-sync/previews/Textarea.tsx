import { Textarea } from '@misoto22/folio'

export function Empty() {
  return (
    <div style={{ maxWidth: 420 }}>
      <Textarea placeholder="Write your post…" rows={4} />
    </div>
  )
}

export function WithExcerpt() {
  return (
    <div style={{ maxWidth: 420 }}>
      <Textarea
        rows={4}
        defaultValue={
          'Gating private posts behind a global password,\n' +
          'while the rest of the blog stays public and\n' +
          'statically rendered at build time.'
        }
      />
    </div>
  )
}

export function Invalid() {
  return (
    <div style={{ maxWidth: 420 }}>
      <Textarea invalid rows={3} defaultValue="Excerpt is too long for the post card preview." />
    </div>
  )
}
