import { ErrorState, ERROR_ACTION_CLASS } from '@misoto22/folio'

export function NotFound() {
  return (
    <ErrorState
      code="404"
      heading="Post not found"
      message="The post you're looking for may have been unpublished, renamed, or never existed."
      action={
        <a href="#" className={ERROR_ACTION_CLASS}>
          Back to dashboard
        </a>
      }
    />
  )
}

export function ServerError() {
  return (
    <ErrorState
      code="500"
      heading="Something went wrong"
      message="We couldn't load the editor. Try again in a moment."
      action={
        <a href="#" className={ERROR_ACTION_CLASS}>
          Retry
        </a>
      }
    />
  )
}
