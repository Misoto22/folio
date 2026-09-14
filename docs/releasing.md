# Releasing

`@misoto22/folio` is published to **npmjs** as a public package under the
`@misoto22` scope. Versioning is driven by changesets, so the changelog is
written by whoever made the change, at the moment they understood it — rather
than reconstructed from commit subjects a month later.

## Shipping a change

```bash
pnpm changeset          # pick the packages, the bump, and write one sentence
git add .changeset
```

Commit that file with the change itself, and translate its sentences into
`apps/docs/src/i18n/changelog.ts` in the same pull request — see below for why
that is part of shipping rather than a courtesy.

Everything after the merge is automatic. On `main`, the release workflow opens a
**Version Packages** pull request that collects every pending changeset, bumps
the version and folds the sentences into `CHANGELOG.md`; it queues that pull
request for auto-merge, and the merge starts the `main` run that publishes to
npmjs, deploys the site and pushes the tag. Nobody clicks anything.

A change to the documentation site, to CI, or to a test needs no changeset;
`@misoto22/folio-docs` is in the `ignore` list because it is deployed, not
versioned.

The `changeset` job in `.github/workflows/pr.yml` enforces exactly that split: a
pull request touching `packages/design/src` outside `__tests__` fails until it
carries a changeset, and everything else passes untouched. A refactor there that
no consumer can observe is waived with the `skip-changeset` label, so the
exception is a visible act rather than an omission nobody noticed.

The same job checks the changeset's shape, through `node .changeset/shape.mjs`.
A changeset's first paragraph is the changelog entry — one sentence, under 160
characters — and everything below a blank line is detail. `DESIGN-CHANGELOG-001`
is the rule; the reason is that the entries here carry their reasoning, which is
what makes them worth reading and what cost the changelog its index: 0.9.0 ran
to 2,685 words at a median of 161 an entry, against an ecosystem norm of 10 to
25. The documentation site folds the detail under the entry rather than cutting
it, so the page can be scanned and the argument is still there for whoever wants
it.

Note what the gate is *not* protecting against. Two branches can never contest a
version number, because neither one writes one — a changeset names a bump kind
in a randomly named file, and `release.yml` computes the number afterwards, once,
under a `concurrency` group of one. What parallel work actually loses is the
sentence: a library change merged without a changeset still ships, folded into
whatever version the next changeset produces, and the `CHANGELOG` then describes
a release that quietly did more than it says.

### What a publish is gated on

`publish` is a job in `.github/workflows/release.yml` that `needs: [verify,
browser]`, so the full pull-request gate — lint, typecheck, tests, both builds,
the size and tree-shaking budget, and the axe, keyboard and RTL suite in a real
browser — runs to green before anything reaches the registry.

That ordering is the point. `publish` used to be its own workflow triggered by
the same push, which meant it raced the checks rather than waiting for them: it
finished in a minute and a quarter while the browser suite was still six minutes
from done. A version that fails the a11y suite cannot be recalled, because npm
does not let a version number be reused.

### Who opens the Version Packages pull request, and why it matters

It is opened, and merged, by a **GitHub App installation token** rather than by
the workflow's own `GITHUB_TOKEN`. That is the whole reason the release needs no
person in it.

GitHub fires no workflows for events from a run's own `GITHUB_TOKEN` — the guard
that stops a workflow triggering itself. A version pull request opened with it
therefore arrives carrying no checks at all, and under the `main` ruleset below,
which requires three, it reads `BLOCKED` forever. Every release before `0.9.0`
was cut by hand around that: pushing the Chinese changelog onto
`changeset-release/main` (`0.6.1`, `0.7.0`), closing and reopening the pull
request (`0.6.0`), or approving its queued runs (`0.8.0`) — three different
workarounds for one missing signature.

An App installation token is a different actor, so its events start workflows
normally. The pull request arrives with its own `verify`, `browser` and
`changeset` runs, `gh pr merge --auto --squash` queues it, and it merges the
moment they go green.

| Where | What it holds |
|---|---|
| npmjs → the package → Settings → Trusted Publisher | repository and workflow filename — see below |
| Repository → Settings → Secrets → Actions | `MISOTO_RELEASE_APP_ID`, `MISOTO_RELEASE_APP_PRIVATE_KEY` |
| 1Password `01 Personal Development` | the App's ID and private key, the human-held originals |

The App is registered under Henry's account with two permissions and no more —
**Contents: read and write** and **Pull requests: read and write** — and is
installed on this repository alone. Its token is minted per run and expires in
an hour, so like the npm side there is nothing standing to leak.

> [!IMPORTANT]
> `actions/checkout` is handed the same token, and that is load-bearing rather
> than tidiness. Checkout persists whatever token it is given as an
> `http.extraheader`, and that header outranks the `.netrc` the changesets
> action writes from its own env — so a checkout with the default token pushes
> the version branch as `github-actions[bot]` however the action is configured,
> and the pull request arrives with no checks again.

> [!IMPORTANT]
> **The Chinese changelog goes in with the change, not with the release.**
> `DESIGN-I18N-001`, and `changelog.test.ts` asks for it on the branch that
> writes the changeset — `verify` runs on every pull request, so a changeset
> with no Chinese is red immediately, in front of the person who can answer.
>
> It was not always asked there, and the difference is the whole rule. The test
> used to read the RELEASED changelog, which on a feature branch is the previous
> release and is therefore always translated; a pull request adding a changeset
> and no Chinese went green, merged, and only then held the release, because the
> strings first reach `CHANGELOG.md` on the Version Packages pull request. 0.9.0
> stopped that way twice in one day, at 42 strings and at 4, and each time
> somebody had to go and find out why. The gate was in the right workflow and
> pointed at the wrong text.

> [!NOTE]
> `--auto` is a queue, not a bypass. It merges only once every check the ruleset
> requires has passed. `gh pr merge --admin` is a different thing entirely, is
> refused outright by `guard-git.py` in the misoto22 dev plugin, and has never
> been used to cut a release here.

## What protects `main`

A ruleset named `main` (repository → Settings → Rules), rather than the older
branch-protection screen:

| Rule | Why |
|---|---|
| Pull request required, squash only, zero approvals | A solo repository gains nothing from self-approval, but everything from the changes arriving as a reviewable unit with CI attached. |
| `verify / verify`, `browser / browser`, `changeset` must pass | The two gates that read the tree, plus the one that reads the pull request's manners. |
| Branch must be up to date before merging | See below — this is the load-bearing one. |
| No force-push, no deletion | `main` is what the registry and the site are cut from. |
| Repository admin may bypass | Present and unused. Nothing in the release path needs it — the version pull request carries its own checks and merges through the ordinary gate. `--admin` is refused by a hook anyway. |

**Up-to-date is the one that earns its keep with parallel work.** Two branches
can each be green against the `main` of an hour ago and still be broken
together — one renames a token, the other starts using it, and neither pull
request ever saw the other. Requiring the branch to be current forces the
second one to rebase onto the first and re-run the suite against the tree that
will actually exist. The cost is a rebase per collision; the alternative is
discovering the collision on `main`, after publish.

That rule applies to the version pull request too, and it resolves itself:
`changesets/action` rebuilds `changeset-release/main` from the current `main` on
every release run and force-pushes it, so a version pull request that fell
behind is replaced by one that has not, with fresh checks. The visible effect is
that merging feature pull requests faster than the checks take restarts the
release rather than cutting several — it ships once the merges stop, which is
the batching behaviour back by a different door.

> [!NOTE]
> A **merge queue** is the automated form of that rule — it builds the combined
> tree and tests it for you, with no rebasing by hand. It is not available here:
> merge queues require an organization-owned repository, and this one is owned
> by a personal account, so the API rejects the rule outright. If the repository
> ever moves to an organization, replace the up-to-date requirement with a merge
> queue and add a `merge_group:` trigger to `pr.yml` — without that trigger the
> required checks never report and the queue stalls until it times out.

## Consuming it

Nothing to configure. The package is public on the default registry, so every
package manager reads it without a token or an `.npmrc` — `npm`, `pnpm`, `yarn`
and `bun` are four clients of one registry, not four places to publish.

```bash
pnpm add @misoto22/folio
```

## There is no publish credential

Publishing authenticates through **trusted publishing**: the workflow mints a
short-lived OIDC token, npmjs checks it against a publisher registered on the
package, and grants publish rights for that run. No npm token is stored in the
repository, in 1Password, or on anyone's laptop, so there is nothing to leak,
rotate, or discover expired on a Friday.

The App private key above is not a counter-example. It cannot publish anything —
its two permissions reach this repository's contents and pull requests and
nothing else — and the registry would not accept it if it tried. The two
credentials answer different questions: who may write to this repository, and
who may publish this package.

The two halves have to agree exactly, and npm does not validate the pairing
when you save it — a mismatch surfaces as a `404` at publish time, never as a
configuration error:

| Where | What it says |
|---|---|
| `.github/workflows/release.yml` | `permissions: id-token: write` |
| npmjs → the package → Settings → Trusted Publisher | repository `Misoto22/folio`, workflow `release.yml` |

Renaming the workflow file, or moving the publish into a different one, breaks
publishing until the npmjs side is updated to match.

### The one time a token is needed

Trusted publishing is configured on a package's settings page, which only
exists once the package does — so the **first ever version** of a new package
cannot be published this way ([npm/cli#8544](https://github.com/npm/cli/issues/8544)).
That version is published by hand, from an interactive terminal, with a
granular token and a 2FA code typed in at the prompt:

```bash
cd packages/design && pnpm build
env "npm_config_//registry.npmjs.org/:_authToken=$(op read 'op://01 Personal Development/npm-registry-token/credential')" \
  npm publish --access public --otp=<six digits>
```

The value stays in the process environment and never reaches disk. Afterwards
the trusted publisher is registered and the token is revoked; it exists for one
publish, not as standing infrastructure.

### When a publish fails

| Symptom | Cause |
|---|---|
| `404` from the registry | The trusted publisher does not match this workflow run. Check the repository name, the workflow filename, and that `id-token: write` is still granted. |
| `ERR_PNPM_OTP_NON_INTERACTIVE` | A token is being used instead of OIDC, and it does not bypass 2FA. CI has no terminal to type a code into. |
| `402 Payment Required` | `publishConfig.access` — npm treats a scoped package as private unless told `public`, and a private package needs a paid account. |

## Tags

`changesets/action` decides whether anything shipped by parsing the publish
CLI's human-readable output, and does not recognise the current CLI's wording —
so after a successful publish it reports nothing and pushes no tags. The
workflow therefore runs `changeset tag` itself, which reads the version out of
`package.json` rather than out of a log line, and skips tags that already exist.

If a release ever appears on the registry with no matching tag, that step is
where to look.

## Pre-1.0

Below `1.0.0`, SemVer's guarantees are weaker by convention: a `minor` may
break. The package is treated as if that convention did not apply — a removed
or renamed export, a changed default, or a token that no longer resolves is a
`major`, and the `CHANGELOG` says so. The version number is cheap; a consumer
discovering a silent break is not.
