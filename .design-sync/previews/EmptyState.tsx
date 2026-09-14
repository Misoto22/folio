import { Button, EmptyState } from '@misoto22/folio'
import { RiFileTextLine, RiInboxLine } from '@remixicon/react'

export function NoPosts() {
  return (
    <EmptyState
      icon={RiFileTextLine}
      title="No posts yet"
      description="Drafts and published articles will appear here once you write your first post."
      action={<Button>Write a post</Button>}
    />
  )
}

export function NoDrafts() {
  return <EmptyState icon={RiInboxLine} title="No drafts in the queue" />
}
