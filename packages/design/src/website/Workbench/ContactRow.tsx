import type { ReactNode } from 'react'

export interface ContactRowProps {
  /** The address, set large — usually a `mailto:` link. */
  address: ReactNode
  /** One button beside it. */
  action?: ReactNode
}

/** An address and one action on a single line of the content subgrid. */
export function ContactRow({ address, action }: ContactRowProps) {
  return (
    <div className="folio-wb-contact">
      <div className="folio-wb-contact-address">{address}</div>
      {action && <div className="folio-wb-contact-action">{action}</div>}
    </div>
  )
}
