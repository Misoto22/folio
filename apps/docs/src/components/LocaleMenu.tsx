'use client'

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@misoto22/folio'
import { RiTranslate2 } from '@remixicon/react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { LOCALES, LOCALE_NAMES, localeFromPath, localePath } from '@/i18n/locales'
import { useMessages } from '@/i18n/useLocale'

/**
 * English and 中文.
 *
 * Each language names itself in its own language, which is the whole point of a
 * language menu: someone who cannot read the current one still has to find
 * theirs. It switches to the SAME page rather than to the home page — being
 * thrown back to the top of a site is the most common thing a language switcher
 * gets wrong, and it is the moment a reader is least equipped to navigate back.
 */
export function LocaleMenu() {
  const pathname = usePathname()
  const router = useRouter()
  const current = localeFromPath(pathname)
  const t = useMessages()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button iconOnly size="sm" variant="ghost" aria-label={t.appearance.language}>
          <RiTranslate2 size={16} aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t.appearance.language}</DropdownMenuLabel>
        {LOCALES.map((locale) => (
          <DropdownMenuItem
            key={locale}
            lang={locale}
            onSelect={() => router.push(localePath(locale, pathname))}
          >
            {LOCALE_NAMES[locale]}
            {current === locale && (
              <span className="ms-auto mono-meta text-(--ink-3-aa)">{t.appearance.current}</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
