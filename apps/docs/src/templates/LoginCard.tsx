import {
  Alert,
  Button,
  Card,
  CardBody,
  Checkbox,
  Field,
  Input,
  LinkArrow,
  Separator,
  StatusPill,
} from '@misoto22/folio'
import { RiKey2Line, RiMailLine } from '@remixicon/react'

/**
 * A sign-in card, assembled from the set — and deliberately drawn wrong.
 *
 * The screen every product has, shown in the state every product forgets to
 * design. A sign-in card in its happy path is four elements and proves nothing;
 * the interesting version is the one holding a rejected attempt, because a
 * failure has to arrive in three places at once and each of them is a different
 * component's job:
 *
 *   the form   an `Alert` saying what happened, at the top, where a reader who
 *              just pressed Enter is already looking
 *   the field  `Field error` — which is what wires `aria-invalid` and
 *              `aria-describedby` onto the input, so the message is announced
 *              rather than merely drawn
 *   the input  the ring the control draws for itself once it is invalid
 *
 * Draw only one of the three and the card looks finished and is not. The copy
 * is also the honest one: it does not say which of the two fields was wrong,
 * because saying so tells an attacker which addresses have accounts.
 *
 * No state, so no `'use client'` — the failure is the point, and it is static.
 * Every element is from the package.
 */
export function LoginCard() {
  return (
    <div className="flex min-h-[36rem] flex-col items-center justify-center gap-8 bg-(--paper-2) px-6 py-16">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="font-heading text-[17px] text-(--ink)">Longbeach</span>
        <h1 className="m-0 font-heading text-[length:var(--fs-sub)] font-normal text-(--ink)">
          Sign in to your workspace
        </h1>
      </div>

      <Card className="w-full max-w-[26rem] bg-(--paper)">
        <CardBody className="flex flex-col gap-5">
          <Alert tone="danger" title="That did not sign you in">
            Check the address and the password and try again. Five more failed attempts locks the
            account for fifteen minutes.
          </Alert>

          <div className="flex flex-col gap-4">
            <Field label="Email" required>
              <Input type="email" autoComplete="email" defaultValue="ana@longbeach.studio" />
            </Field>

            <Field
              label="Password"
              required
              error="We could not sign you in with that combination."
            >
              <Input type="password" autoComplete="current-password" defaultValue="············" />
            </Field>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-(--ink-2)">
              <Checkbox defaultChecked />
              Keep me signed in
            </label>
            <a
              href="#reset"
              className="text-[13px] text-(--ink-2) underline decoration-(--rule-2) underline-offset-4 transition-colors duration-(--duration-fast) hover:text-(--ink) hover:decoration-(--ink)"
            >
              Forgot password?
            </a>
          </div>

          <Button className="w-full">Sign in</Button>

          {/* Two rules and a word, rather than one rule with a label sitting on
              it: the label needs the page ground behind it, and this card is on
              a different ground from the page it is centred over. Both rules
              are decorative — a screen reader does not need to be told the
              form has a middle. */}
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="mono-meta shrink-0 text-(--ink-3-aa)">or continue with</span>
            <Separator className="flex-1" />
          </div>

          <div className="grid gap-2 @sm:grid-cols-2">
            <Button variant="secondary" className="gap-2">
              <RiKey2Line size={14} aria-hidden />
              SAML SSO
            </Button>
            <Button variant="secondary" className="gap-2">
              <RiMailLine size={14} aria-hidden />
              Email a link
            </Button>
          </div>
        </CardBody>
      </Card>

      <div className="flex flex-col items-center gap-3">
        <p className="m-0 text-[13px] text-(--ink-3-aa)">
          No account yet?{' '}
          <a
            href="#signup"
            className="text-(--ink) underline decoration-(--rule-2) underline-offset-4 transition-colors duration-(--duration-fast) hover:decoration-(--ink)"
          >
            Create a workspace
            <LinkArrow />
          </a>
        </p>
        <StatusPill>All authentication systems normal</StatusPill>
      </div>
    </div>
  )
}
