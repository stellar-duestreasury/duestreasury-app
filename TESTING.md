# Verification

`npm run lint`, `npm run typecheck`, `npm test -- --maxWorkers=1`, `npm run build`.

`src/lib/treasury.test.ts` covers numeric limits, address secrecy/type refusals, bounded unique membership, memo hashes and ABI order. `src/lib/errors.test.ts` enforces exact wording from vendored contract errors. `src/lib/contract.test.ts` exercises testnet RPC refusal, simulation errors and public read behavior. `src/pages/App.test.tsx` checks missing configuration, visible custody gate and automated axe violations with color contrast disabled. These checks do not call a live wallet or deploy or fund a contract.

The app is a local implementation until all required checks pass. Do not interpret build success as an audit or a pilot.

On 2026-10-08 lint, strict typecheck, all 46 tests in six files and production build passed. Added lifecycle regressions cover provider account changes while signing, RPC network mismatch before send, action cancellation, delayed member reads with disabled inputs, and unknown-outcome explorer links without a false confirmed label. A separate parent review of isolated production fixtures at 320, 390 and 1280 px found no horizontal overflow and no automated WCAG axe violations. The fixtures used a synthetic contract id and blocked external network calls; they did not simulate, sign or send a live transaction. Real-wallet and manual screen-reader checks remain unverified. The final main chunk is 780.98 kB (183.63 kB gzip), exceeding Vite's warning threshold. The lockfile audit returned 19 unresolved findings (13 low, six moderate, no high/critical); no force upgrade was performed.
