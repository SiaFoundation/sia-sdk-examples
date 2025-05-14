# walletd-js-sdk-v2-wallet-address-transaction

- [`generateSeed.ts`](./generateSeed.ts) shows how to generate a seed phrase.
- [`createWallet.ts`](./createWallet.ts) shows how to generate a seed phrase and create a walletd seed wallet.
- [`generateAddress.ts`](./generateAddress.ts) shows how generate an address with the sdk and add it to the walletd wallet with all required metadata.
- [`sendTransactionPrivateKey.ts`](./sendTransactionPrivateKey.ts) send a transaction assuming the wallet has a single address / private key.
- [`sendTransactionSeedPhrase.ts`](./sendTransactionSeedPhrase.ts) send a transaction using a seed phrase to generate any required key pairs.
- [`signTransaction.ts`](./signTransaction.ts) shows how to sign a transaction using a seed phrase to generate any required key pairs.

## Install

```sh
bun i
```

Create an `.env` and populate each variable.

```sh
cp .env.example .env
```

## Run

Run any of the scripts directly with Bun:

```sh
bun sendTransaction.ts
```
