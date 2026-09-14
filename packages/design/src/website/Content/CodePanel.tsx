'use client'

import { RiCheckLine, RiFileCopyLine } from '@remixicon/react'
import { useRef, type HTMLAttributes, type ReactNode } from 'react'
import { Button } from '../../components/Button/Button'
import { cn } from '../../lib/cn'
import { useClipboardCopy } from '../../lib/useClipboardCopy'

export interface ClipboardButtonProps {
  text?: string
  /** Read the current rendered code at activation, when the host owns highlighting. */
  getText?: () => string
  copyLabel: string
  copiedLabel: string
  className?: string
}

/** Confirms copying only after the browser accepts the clipboard write. */
export function ClipboardButton({ text, getText, copyLabel, copiedLabel, className }: ClipboardButtonProps) {
  const { copied, copy } = useClipboardCopy('ClipboardButton')

  return (
    <Button variant="ghost" size="sm" onClick={() => void copy(getText ?? text ?? '')} aria-label={copied ? copiedLabel : copyLabel} className={cn('m22-clipboard-button', className)}>
      {copied ? <RiCheckLine size={14} aria-hidden="true" /> : <RiFileCopyLine size={14} aria-hidden="true" />}
      <span aria-live="polite">{copied ? copiedLabel : copyLabel}</span>
    </Button>
  )
}

export interface CodePanelProps {
  /** A display label, already mapped from the host highlighter's language id. */
  languageLabel?: ReactNode
  preProps?: HTMLAttributes<HTMLPreElement>
  /** False when the host renderer has already supplied an enclosing figure. */
  framed?: boolean
  copyLabel: string
  copiedLabel: string
  children: ReactNode
}

/** A rendered-code panel for Markdown and MDX, preserving the host's highlighted nodes. */
export function CodePanel({ languageLabel, preProps, framed = true, copyLabel, copiedLabel, children }: CodePanelProps) {
  const pre = useRef<HTMLPreElement>(null)
  const content = <>
    <div className="m22-code-panel-head" data-code-panel-head>
      <span>{languageLabel}</span>
      <ClipboardButton getText={() => (pre.current?.innerText ?? pre.current?.textContent ?? '').replace(/\n$/, '')} copyLabel={copyLabel} copiedLabel={copiedLabel} />
    </div>
    <pre {...preProps} ref={pre} className={cn('m22-code-panel-pre', preProps?.className)} tabIndex={0}>{children}</pre>
  </>

  return framed ? <figure className="m22-code-panel" data-code-panel>{content}</figure> : content
}
