import type { HTMLAttributes, ReactNode } from 'react'
import { Badge } from '../../components/Badge/Badge'
import { Heading } from '../../components/Heading/Heading'
import { Tag } from '../../components/Tag/Tag'
import { Text } from '../../components/Text/Text'
import { cn } from '../../lib/cn'

export interface RecordSectionProps extends HTMLAttributes<HTMLElement> {
  title: string
  count?: string
  headingId: string
  children: ReactNode
}

/** A named ledger section. The host supplies its chronology without reordering. */
export function RecordSection({ title, count, headingId, children, className, ...rest }: RecordSectionProps) {
  return <section aria-labelledby={headingId} className={cn('folio-record-section', className)} {...rest}><header className="folio-record-section__header"><Heading level={2} id={headingId}>{title}</Heading>{count && <Text as="span" size="xs" tone="muted">{count}</Text>}</header>{children}</section>
}

export interface CareerRecordProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: string
  organization: ReactNode
  period: string
  periodLabel: string
  location: string
  locationLabel: string
  description: string[]
  tags: string[]
  tagsLabel: string
  mark?: ReactNode
  currentLabel?: string
}

/** One dated record, reusable for a role, qualification or other chronology. */
export function CareerRecord({ title, organization, period, periodLabel, location, locationLabel, description, tags, tagsLabel, mark, currentLabel, className, ...rest }: CareerRecordProps) {
  return (
    <article className={cn('folio-career-record', className)} {...rest}>
      <div className="folio-career-record__dates"><dl><dt className="sr-only">{periodLabel}</dt><dd><Text as="span" size="sm" tone="strong">{period}</Text></dd><dt className="sr-only">{locationLabel}</dt><dd><Text as="span" size="xs" tone="muted">{location}</Text></dd></dl>{currentLabel && <Badge>{currentLabel}</Badge>}</div>
      <div className="folio-career-record__body"><Heading level={3} size="heading">{title}</Heading><div className="mt-2">{organization}</div>{description.length === 1 && <Text className="mb-0 mt-5 max-w-(--measure-record)">{description[0]}</Text>}{description.length > 1 && <ul className="folio-career-record__description">{description.map((point, index) => <Text as="li" key={index}>{point}</Text>)}</ul>}{tags.length > 0 && <ul aria-label={tagsLabel} className="folio-career-record__tags">{tags.map((tag, index) => <li key={`${tag}-${index}`}><Tag>{tag}</Tag></li>)}</ul>}</div>
      {mark && <div className="folio-career-record__mark">{mark}</div>}
    </article>
  )
}

export interface ProfileSectionProps extends HTMLAttributes<HTMLElement> {
  headingId: string
  title: string
  description?: string
  children: ReactNode
}

/** A profile section follows the same heading and spacing contract as its neighbors. */
export function ProfileSection({ headingId, title, description, children, className, ...rest }: ProfileSectionProps) {
  return <section aria-labelledby={headingId} className={cn('folio-profile-section', className)} {...rest}><header className="folio-profile-section__header"><Heading level={2} id={headingId}>{title}</Heading>{description && <Text className="m-0 max-w-[42rem]">{description}</Text>}</header>{children}</section>
}

export interface ProfileNarrativeProps {
  headingId: string
  title: string
  pull: string
  paragraphs: string[]
  action?: ReactNode
}

/** A short introduction with a pull quote and a longer account alongside it. */
export function ProfileNarrative({ headingId, title, pull, paragraphs, action }: ProfileNarrativeProps) {
  return <section aria-labelledby={headingId} className="folio-profile-narrative"><div><Heading level={2} id={headingId}>{title}</Heading><Text size="lead" tone="strong" className="mb-0 mt-6 max-w-[30ch]">{pull}</Text></div><div>{paragraphs.map((paragraph, index) => <Text key={index} className="mb-5 mt-0 max-w-(--measure-record)">{paragraph}</Text>)}{action}</div></section>
}

export interface ProfileSkill {
  id: string
  label: string
  icon?: ReactNode
  darkIcon?: ReactNode
  invertInDark?: boolean
}

export interface ProfileSkillsProps {
  groups: { id: string; title: string; items: ProfileSkill[] }[]
}

/** Skill labels and theme-aware artwork, supplied by the host's content adapter. */
export function ProfileSkills({ groups }: ProfileSkillsProps) {
  return <div className="folio-profile-skills">{groups.map((group) => <section className="folio-profile-skills__group" key={group.id}><Heading level={3} size="item">{group.title}</Heading><ul className="folio-profile-skills__items">{group.items.map((skill) => <li key={skill.id}><span className="folio-profile-skill__icon" data-invert={skill.invertInDark || undefined} data-has-dark={Boolean(skill.darkIcon) || undefined} aria-hidden><span data-artwork="light">{skill.icon}</span>{skill.darkIcon && <span data-artwork="dark">{skill.darkIcon}</span>}</span><Text as="span" size="sm" tone="strong">{skill.label}</Text></li>)}</ul></section>)}</div>
}

export interface ProfileInterestsProps {
  items: { id: string; title: string; description: string }[]
}

/** A small set of interests or areas of practice. */
export function ProfileInterests({ items }: ProfileInterestsProps) {
  return <div className="folio-profile-interests">{items.map((item) => <article key={item.id}><Heading level={3}>{item.title}</Heading><Text className="mb-0 mt-4">{item.description}</Text></article>)}</div>
}

export interface ProfileFigureProps {
  children: ReactNode
  caption?: string
}

/** Source-faithful profile photography: retain the supplied image's aspect ratio. */
export function ProfileFigure({ children, caption }: ProfileFigureProps) {
  return <figure className="folio-profile-figure"><div className="folio-profile-figure__image">{children}</div>{caption && <Text as="figcaption" size="xs" tone="muted" className="mt-3">{caption}</Text>}</figure>
}

/** An ordered collection frame. No sorting or business data is owned here. */
export function Timeline({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('folio-timeline', className)} {...props} />
}

/** A record mount, isolated so motion can follow the shared data-motion axis. */
export function TimelineItem({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('folio-timeline__item', className)} {...props} />
}
