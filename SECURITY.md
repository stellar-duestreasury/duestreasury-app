# Custody and privacy

This app is a testnet custody prototype, not independently reviewed. No real money. A second human review is required before deployment or funded testing. Report vulnerabilities privately through the maintainer's GitHub contact details; do not disclose seeds, secret keys or exploitable personal data in public issues.

Public configuration never contains signing material. Wallets sign transactions; the app never receives a seed or secret key. RPC and wallet passphrases must match testnet. Only opaque memo hashes, public addresses and numeric treasury data reach the contract. Hashes can reveal predictable source text; use synthetic data. The app performs no automatic write retries and surfaces transaction hashes for checking uncertain outcomes.
