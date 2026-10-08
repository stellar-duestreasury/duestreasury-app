# Contributing

Thanks for helping with `duestreasury`. **Read [AGENTS.md](AGENTS.md) first** — it is
the rulebook for this repository, for people and for AI agents alike. This page
is a shorter orientation.

## Before you change anything

- **Testnet only.** Never write anything that suggests mainnet use.
- **Nothing is deployed and no pilot has happened.** Do not describe a
  deployment, a contract id, a user, a tester or a result that does not exist.
- **No personal data, ever** — not in examples, not in tests, not in issue
  drafts. Use obvious placeholders.
- **Never commit `.env`**, a secret key or a seed phrase.

## Commits

- One logical change per commit; subject `type: imperative summary`, 72
  characters or fewer.
- Stage by explicit file name and read the staged diff before committing.
- No "Generated with" or co-author trailers of any kind.

## Checks to run before you push

Run `npm run lint`, `npm run typecheck`, `npm test -- --maxWorkers=1`, and
`npm run build`. Read [TESTING.md](TESTING.md) for coverage and limitations.
Keep exact error wording aligned with the vendored contract ERRORS.md.
Preserve testnet refusal, wallet account guards, unknown-outcome receipts,
the deployment block and the second human custody review requirement.
