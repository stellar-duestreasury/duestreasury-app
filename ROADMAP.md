# Roadmap

Implemented local v0: strict Vite/React/TypeScript app, environment-only testnet configuration, local Stellar wallet icons, ABI-driven group/member/signer operations, canonical errors, receipts, public source account reads, input tests, RPC refusal tests, render/axe check and CI.

Deliberately unimplemented: off-chain arrears reminders, CSV export, multilingual support, proposal index/full history export, and multi-party threshold cancellation coordination in the browser. The contract supports threshold cancellation with separately authorized signer addresses.

Local verification on 2026-10-08: lint, strict typecheck, 46 tests across six files, and production build pass. The main JavaScript chunk is 780.98 kB (183.63 kB gzip), above Vite's 500 kB warning threshold. Dependencies were reused from the identical validated SchoolFees lock via an ignored local node_modules junction after a slow offline install was stopped; normal clean npm ci remains configured in CI. The lockfile audit reports 19 dependency findings: 13 low and six moderate, no high or critical. These are unresolved; no force upgrade was applied.

TODO(verify): deployed integration, real-wallet behavior, manual accessibility, and independent custody review. No deployment, funded test or pilot has occurred. Name a second human reviewer before funded testing. Mainnet, backend and analytics are out of scope.
