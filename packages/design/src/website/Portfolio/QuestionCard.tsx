'use client'
import { useId, type ReactNode } from 'react'
import { RiArrowUpLine, RiArrowRightUpLine, RiChat3Line } from '@remixicon/react'
import { Button } from '../../components/Button/Button'
import { Input } from '../../components/Input/Input'
import { Heading } from '../../components/Heading/Heading'
import { Text } from '../../components/Text/Text'

export interface QuestionCardProps {
  title: ReactNode
  description: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
  submitLabel: string
  examplesLabel: string
  examples: string[]
  disabled?: boolean
  maxLength?: number
  inputId?: string
}
/** A compact invitation to an application-owned conversation. */
export function QuestionCard({ title, description, label, placeholder, value, onChange, onSubmit, submitLabel, examplesLabel, examples, disabled, maxLength, inputId }: QuestionCardProps) {
  const titleId = useId()
  return <section className="folio-question-card" aria-labelledby={titleId}><div className="folio-question-card-heading"><RiChat3Line size={19} aria-hidden /><Heading level={2} size="sub" id={titleId}>{title}</Heading></div><Text size="sm">{description}</Text><form onSubmit={event => { event.preventDefault(); if (!disabled && value.trim()) onSubmit(value.trim()) }} autoComplete="off"><Input id={inputId} aria-label={label} name="question" value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} maxLength={maxLength} /><Button type="submit" iconOnly aria-label={submitLabel} disabled={disabled || !value.trim()}><RiArrowUpLine size={18} aria-hidden /></Button></form><ul aria-label={examplesLabel}>{examples.map(example => <li key={example}><Button variant="ghost" disabled={disabled} onClick={() => onSubmit(example)}><span>{example}</span><RiArrowRightUpLine size={14} aria-hidden /></Button></li>)}</ul></section>
}
