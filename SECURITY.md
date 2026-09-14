# Security Policy

## Reporting a vulnerability

Please do not open a public issue for a security problem.

Use [GitHub's private vulnerability reporting](https://github.com/Misoto22/folio/security/advisories/new),
which opens a thread visible only to the maintainer.

Include what you can: the version or commit, what an attacker can do with it,
and the shortest way to reproduce it.

## Supported versions

`@misoto22/design` is pre-1.0 and has no maintenance branches. Fixes land on
`main` and ship in the next release; the latest published version is the only
one that receives them.

## Scope

The package is React components and CSS. It opens no network connection, reads
no credential, and writes to no storage — so a report about it is a report about
what the rendered markup does in a host application: an unescaped value reaching
the DOM, an overlay that escapes its container, a focus trap that can be walked
out of.

Out of scope:

- **The fixture data in `apps/docs`** — commit hashes, branch names, uptime
  figures and job records on the documentation site are invented for the
  templates. None of it comes from a real system.
- **Advisories against a dependency** with no exploitable path through this
  package. Report those upstream; they arrive here through Dependabot.
