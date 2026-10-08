# DuesTreasury app

Local v0 wallet interface for fixed-member dues and threshold-approved treasury spending. **TESTNET — no real money. Unreviewed custody prototype. Deployment and funded testing remain blocked until a second human reviewer. No deployment or pilot is claimed.**

Implemented screens: public group/proposal reads, current-period member status/payment, signer proposals/approvals/execution, proposer cancellation, and fixed group creation. Public reads simulate using an entered funded public testnet source; no signing or secret is needed. Amounts are whole token atomic units, not decimal display amounts. Proposal ids come from creation receipts: v0 has no proposal index or full historical export. Threshold cancellation needs multiple authorizers and is available in the contract, but not coordinated by this single-wallet browser.

Run `npm ci`, `npm run lint`, `npm run typecheck`, `npm test -- --maxWorkers=1`, and `npm run build`. For local viewing run `npm run dev -- --host 127.0.0.1`. Copy `.env.example` to `.env.local` only after the deployment gate is resolved. Missing or non-testnet configuration blocks the interface. RPC network passphrase is checked before simulation and wallet testnet selection before signing and submission.

The app never asks for a secret key or seed phrase. No backend, analytics, trackers, remote icons, or personal text is sent on-chain. Eight explicitly imported Stellar wallet modules use local icons. Error wording is generated from the vendored contract `ERRORS.md`; tests verify all 17 messages. A confirmed write displays the transaction hash and explorer link. Failed retries preserve the previous successful receipt, and writes are never automatically resubmitted.

Tests use synthetic addresses and mocked RPC/wallets. Deployed integration, real-wallet behavior, screen-reader/manual device checks and independent custody review remain unverified. Automated axe checks are partial and disable color contrast. See the [book repository](https://github.com/stellar-duestreasury/duestreasury-docs) and [contract custody gate](https://github.com/stellar-duestreasury/duestreasury-contracts/blob/main/DEPLOYMENT_CHECKLIST.md).

Verified locally on 2026-10-08: lint, strict typecheck, all 46 tests across six files, and production build pass. The final main chunk is 780.98 kB (183.63 kB gzip), with a Vite size warning. The lockfile dependency audit has 19 unresolved findings (13 low, six moderate; zero high/critical). Clean npm ci and GitHub CI for these uncommitted changes are not claimed as verified.
