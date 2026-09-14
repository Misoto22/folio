import { ERROR_ACTION_CLASS, ErrorState } from '@misoto22/folio'
import Link from 'next/link'

export default function NotFound() {
  return (
    <ErrorState
      className="min-h-[60vh] pt-0"
      code="404"
      heading="No such page"
      message="It may have been renamed, or it may never have existed. The component index is the fastest way back."
      action={
        <Link href="/components/" className={ERROR_ACTION_CLASS}>
          All components
        </Link>
      }
    />
  )
}
