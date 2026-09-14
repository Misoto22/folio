'use client'

import { Switch } from '@misoto22/folio'
import { useState } from 'react'

const SETTINGS = [
  { id: 'email', label: 'Email notifications', on: true },
  { id: 'digest', label: 'Weekly digest', on: false },
]

/**
 * Two settings that take effect on the flip rather than on a save — which is
 * the whole line between this and Checkbox, and not a cosmetic one: a switch
 * inside a form with a Save button is a lie about when the change happened.
 * Both are named for the state and not for the action, because the name is read
 * together with “on” or “off”: “Email notifications, on” is a sentence, and
 * “Turn on email notifications, on” is two contradictory ones. The Radix root
 * is a button, which a label does bind to, so unlike Select or RadioGroup a
 * Field's label above a Switch really does click through.
 */
export function Example() {
  const [state, setState] = useState(() =>
    Object.fromEntries(SETTINGS.map((setting) => [setting.id, setting.on])),
  )

  return (
    <div className="flex flex-col gap-3">
      {SETTINGS.map((setting) => (
        <label key={setting.id} className="flex cursor-pointer items-center gap-3 text-sm">
          <Switch
            checked={state[setting.id]}
            onCheckedChange={(next) => setState((previous) => ({ ...previous, [setting.id]: next }))}
          />
          {/* The label follows the state. A switch that is off beside a label
              at full strength reads as "on" at a glance, and the control is
              the smaller of the two things on the row. */}
          <span
            className={
              state[setting.id]
                ? 'text-(--ink) transition-colors duration-(--duration-fast)'
                : 'text-(--ink-3-aa) transition-colors duration-(--duration-fast)'
            }
          >
            {setting.label}
          </span>
          <span className="ms-auto mono-meta text-(--ink-3-aa)">
            {state[setting.id] ? 'On' : 'Off'}
          </span>
        </label>
      ))}
    </div>
  )
}
