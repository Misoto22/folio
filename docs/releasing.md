# Releasing

`@misoto22/folio` is published to **npmjs** as a public package under the
`@misoto22` scope. Versioning is driven by **release-please**, so the version
number and the changelog are both derived from what merged: the Conventional
Commit subject of every pull request since the last tag.

## Shipping a change

Write the pull-request title as a Conventional Commit and merge it. That is the
whole of it — there is no file to write beside the change, and nothing to
remember at release time.

```
feat(button): add a loading state      → next minor
fix(sidebar): stop the rail collapsing → next patch
feat(tokens)!: drop the m22 prefix     → next major
chore(deps): bump eslint               → no release
```

The title is the changelog entry, verbatim, so write it as one: lowercase,
imperative, and about what changed rather than about the diff. The
`pr-title / pr-title` check enforces the grammar and `main` requires it, because
this repository squash-merges — the title becomes the commit subject, and the
commit subject is the only input release-please has.

Everything after the merge is automatic. On `main`, the `release` job opens or
updates **`chore(main): release folio X.Y.Z`**, a pull request holding the
version bump and the changelog entries it has accumulated. Merging that pull
request writes `packages/design/package.json` and `packages/design/CHANGELOG.md`,
tags `vX.Y.Z`, publishes the GitHub Release, and the push that merge makes runs
`publish`, which sends the tarball to npmjs. Nobody clicks anything but merge.

A release pull request that is left open simply accumulates: the next merge to
`main` rewrites it with the new commits folded in and the version recomputed. So
a release happens when you merge it, not on a schedule.

### Which types produce a release

| In the title | Bump | In the changelog under |
|---|---|---|
| `feat:` | minor | Features |
| `!` or a `BREAKING CHANGE:` footer | major | ⚠ BREAKING CHANGES |
| `fix:` | patch | Bug Fixes |
| `perf:` | patch | Performance |
| `revert:` | patch | Reverts |
| `docs:` | patch | Documentation |
| `refactor:` | patch | Refactoring |
| `chore:`, `ci:`, `build:`, `test:`, `style:` | none | not listed |

Two things decide whether a merge releases anything at all, and both have to be
true. The commit has to touch a file under `packages/design/` — that is the one
path in the manifest, so a change to the docs site or to CI is invisible to
release-please however it is titled — and it has to land in a listed section.
A release pull request whose changelog would be empty is not opened, which is
why a run of `chore:` merges produces nothing rather than a version with no
entries in it.

### The Chinese changelog

`apps/docs/src/i18n/changelog.ts` keys each translation by the fingerprint of
its English, and `changelog.test.ts` gates two things: no ORPHAN — a translation
whose English nothing says and nothing will write — and a line for every section
heading release-please can emit, which it reads out of
`release-please-config.json`.

It no longer demands a translation for the release itself, and that is a
deliberate loosening. Under changesets a release's English existed in
`.changeset/*.md` for days before the bump, so it could be translated in
advance — and had to be, because the gate ran on the Version Packages pull
request and an untranslated entry stopped the release at its last step, twice in
one day. release-please writes the entry from a title that has already merged:
there is no window in which the English exists and the release has not happened.
An entry with no Chinese renders in English on the Chinese page, and is
translated afterwards.

### What a publish is gated on

`publish` is a job in `.github/workflows/release.yml` that
`needs: [verify, browser, release]`, so the full pull-request gate — lint,
typecheck, tests, both builds, the size and tree-shaking budget, and the axe,
keyboard and RTL suite in a real browser — runs to green before anything reaches
the registry. `release` itself needs the same two, so a tag is not cut from a
tree those gates have not seen either.

That ordering is the point. `publish` used to be its own workflow triggered by
the same push, which meant it raced the checks rather than waiting for them: it
finished in a minute and a quarter while the browser suite was still six minutes
from done. A version that fails the a11y suite cannot be recalled, because npm
does not let a version number be reused.

`publish` runs only when `needs.release.outputs.releases_created == 'true'` —
the plural. The singular `release_created` is the ROOT path's output and this
manifest has no root path; its one package is `packages/design`, so the root
outputs are empty on every run, including the runs that released.

### Who opens the release pull request, and why it matters

It is opened by the **`misoto22-release-bot` GitHub App**, through the fleet's
reusable `Misoto22/ci/.github/workflows/release.yml`, rather than by the
workflow's own `GITHUB_TOKEN`.

GitHub fires no workflows for events from a run's own `GITHUB_TOKEN` — the guard
that stops a workflow triggering itself. A release pull request opened with it
would arrive carrying no checks at all, and under the `main` ruleset below it
would read `BLOCKED` forever; the tag and Release it later created would start
no `publish`. Every release before `0.9.0` was cut by hand around exactly that:
pushing onto the release branch, closing and reopening the pull request, or
approving its queued runs — three workarounds for one missing signature.

An App installation token is a different actor, so its events start workflows
normally.

| Where | What it holds |
|---|---|
| npmjs → the package → Settings → Trusted Publisher | repository and workflow filename — see below |
| Repository → Settings → Variables → Actions | `APP_CLIENT_ID` |
| Repository → Settings → Secrets → Actions | `APP_PRIVATE_KEY` |
| 1Password `01 Personal Development` | the App's client ID and private key, the human-held originals |

The App is installed on this repository and its token is minted per job, scoped
to this repository alone, expiring after an hour and revoked in a post step — so
like the npm side there is nothing standing to leak.

> [!NOTE]
> The reusable workflow deliberately sets no `X-GitHub-Api-Version`. Under API
> version 2026-03-10 the pull-request payload no longer carries
> `merge_commit_sha`, so release-please logs "Pull request should have been
> merged", creates no tag and no release, and still exits 0
> ([release-please#2898](https://github.com/googleapis/release-please/issues/2898)).
> Its "Verify the tag exists" step is the defence against that: a green job with
> nothing to show for it.

## What protects `main`

A ruleset named `main` (repository → Settings → Rules), rather than the older
branch-protection screen:

| Rule | Why |
|---|---|
| Pull request required, squash only, zero approvals | A solo repository gains nothing from self-approval, but everything from the changes arriving as a reviewable unit with CI attached. Squash-only is also what makes the title the commit subject, which is what release-please reads. |
| `verify / verify`, `browser / browser`, `pr-title / pr-title` must pass | The two gates that read the tree, plus the one that reads the title the version will be computed from. |
| Branch must be up to date before merging | See below — this is the load-bearing one. |
| No force-push, no deletion | `main` is what the registry and the site are cut from. |
| Repository admin may bypass | Present and unused. Nothing in the release path needs it — the release pull request carries its own checks and merges through the ordinary gate. `--admin` is refused by a hook anyway. |

**Up-to-date is the one that earns its keep with parallel work.** Two branches
can each be green against the `main` of an hour ago and still be broken
together — one renames a token, the other starts using it, and neither pull
request ever saw the other. Requiring the branch to be current forces the
second one to rebase onto the first and re-run the suite against the tree that
will actually exist. The cost is a rebase per collision; the alternative is
discovering the collision on `main`, after publish.

That rule applies to the release pull request too, and `always-update: true` in
`release-please-config.json` is what resolves it: every push to `main` re-renders
the release branch from the current `main`, so a release pull request that fell
behind is replaced by one that has not, with fresh checks. The visible cost is a
`verify` and a `browser` run per push to `main`.

> [!NOTE]
> A **merge queue** is the automated form of that rule — it builds the combined
> tree and tests it for you, with no rebasing by hand. It is not available here:
> merge queues require an organization-owned repository, and this one is owned
> by a personal account, so the API rejects the rule outright. If the repository
> ever moves to an organization, replace the up-to-date requirement with a merge
> queue and add a `merge_group:` trigger to `pr.yml` — without that trigger the
> required checks never report and the queue stalls until it times out.

## The configuration

| File | What it decides |
|---|---|
| `release-please-config.json` | `release-type: node`, the one package `packages/design`, the six changelog sections, `include-component-in-tag: false` so the tag is `vX.Y.Z` and not `folio-vX.Y.Z`, and `always-update: true` |
| `.release-please-manifest.json` | The version release-please believes is current. It is the file to edit if a version is ever cut by hand. |

`bootstrap-sha` is also set, and it is temporary. The tags this repository
carries are `@misoto22/design@…` and `@misoto22/folio@0.16.0`, none of which
release-please recognises as `v0.16.0`, so without it the first run would walk
the entire history and write a changelog of every commit ever made. It pins the
walk to the commit this migration branched from. **Remove it after the first
release-please release**, once a real `v…` tag exists for the walk to stop at.

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
its permissions reach this repository's contents, pull requests and issues and
nothing else — and the registry would not accept it if it tried. The two
credentials answer different questions: who may write to this repository, and
who may publish this package.

The two halves have to agree exactly, and npm does not validate the pairing
when you save it — a mismatch surfaces as a `404` at publish time, never as a
configuration error:

| Where | What it says |
|---|---|
| `.github/workflows/release.yml` | `permissions: id-token: write` on the `publish` job |
| npmjs → the package → Settings → Trusted Publisher | repository `Misoto22/folio`, workflow `release.yml`, no environment |

Renaming the workflow file, or moving the publish into a different one, breaks
publishing until the npmjs side is updated to match. That is why the
release-please caller is a job inside `release.yml` rather than a
`release-please.yml` of its own, which is how most of the fleet arranges it.

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
| A tag and a Release exist, but nothing on npm | `publish` was skipped or failed. Check its `if` against the `release` job's `releases_created` output, then re-run the job — the tag is already there, so nothing else needs redoing. |

## Tags

Tags are `vX.Y.Z`, pushed by release-please as part of creating the GitHub
Release, and both are created by the App rather than by `GITHUB_TOKEN` — which
is what lets the `publish` job run at all.

The older tags stay where they are. `@misoto22/design@0.2.0` through
`0.15.0` and `@misoto22/folio@0.16.0` name the releases changesets cut, four of
them at commits that are not on `main` and three at versions the registry never
served. They are history, not a scheme: nothing reads them, and a published tag
is not moved.

## Pre-1.0

Below `1.0.0`, SemVer's guarantees are weaker by convention: a `minor` may
break. The package is treated as if that convention did not apply — a removed
or renamed export, a changed default, or a token that no longer resolves is a
`major`, and the `CHANGELOG` says so. The version number is cheap; a consumer
discovering a silent break is not.

> [!IMPORTANT]
> release-please does not know that convention. A `!` in a pull-request title
> below 1.0.0 takes the package to `1.0.0`, not to `0.17.0` — there is no
> pre-major mode configured here. A breaking change that is not meant to declare
> the API stable needs the version chosen deliberately, with a `Release-As:`
> footer in the commit body.
