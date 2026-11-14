import { CircleCheck, CircleX, Info, TriangleAlert } from '../../icons'
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type AlertTone = 'info' | 'success' | 'warning' | 'danger'

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: AlertTone
  title?: ReactNode
  children?: ReactNode
  /** Optional action — a retry, a link to the settings that fix this. */
  action?: ReactNode
  /** Hides the leading icon for a dense inline notice. */
  hideIcon?: boolean
}

const TONE: Record<
  AlertTone,
  { surface: string; mark: string; icon: typeof Info; live: 'polite' | 'assertive' }
> = {
  info: { surface: 'border-(--rule-2) bg-(--paper-2)', mark: 'text-(--ink-2)', icon: Info, live: 'polite' },
  success: { surface: 'border-transparent bg-(--ok-soft)', mark: 'text-(--ok)', icon: CircleCheck, live: 'polite' },
  warning: { surface: 'border-transparent bg-(--warn-soft)', mark: 'text-(--warn)', icon: TriangleAlert, live: 'polite' },
  /* Assertive: a danger alert interrupts because whatever the reader is doing
     is already failing. The other three wait for a pause in speech. */
  danger: { surface: 'border-transparent bg-(--danger-soft)', mark: 'text-(--danger)', icon: CircleX, live: 'assertive' },
}

/**
 * A message about the page, in place.
 *
 * Carries `role="alert"` for the danger tone and `role="status"` for the rest,
 * which is the difference between interrupting the reader and waiting for a
 * pause. Getting that backwards is the usual accessibility failure here: a
 * "saved" toast that talks over someone mid-sentence, or a payment error that
 * is never announced at all.
 *
 * The tone is the message's SEVERITY, not its decoration. Colour is doubled by
 * an icon and by the words, so the meaning survives both monochrome printing
 * and colour-blindness.
 *
 * @example
 * <Alert tone="danger" title="Upload failed">The file exceeds 25 MB.</Alert>
 */
export function Alert({
  tone = 'info',
  title,
  children,
  action,
  hideIcon = false,
  className,
  ...rest
}: AlertProps) {
  const { surface, mark, icon: Icon, live } = TONE[tone]

  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      aria-live={live}
      className={cn(
        'flex gap-3 rounded-(--radius) border p-4 text-sm text-(--ink-2)',
        surface,
        className,
      )}
      {...rest}
    >
      {!hideIcon && <Icon size={18} className={cn('mt-px shrink-0', mark)} aria-hidden />}
      <div className="min-w-0 flex-1">
        {title && <p className="m-0 font-medium text-(--ink)">{title}</p>}
        {children && <div className={cn('leading-relaxed', title && 'mt-1')}>{children}</div>}
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  )
}

export default Alert
