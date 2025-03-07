import { initSDK } from '@siafoundation/sdk'
import { Walletd } from '@siafoundation/walletd-js'
import { blake2bHex } from 'blakejs'

const walletdAPIAddress = 'http://localhost:9980/api'
const walletdAPIPassword = 'change me'
const walletd = Walletd({
  api: walletdAPIAddress,
  password: walletdAPIPassword,
})
const sdk = await initSDK()

// Part 1: Set up a seed wallet and add an address to walletd.

const seed = sdk.wallet.generateSeedPhrase()
if ('error' in seed) {
  throw Error(seed.error)
}

const addressIndex = 0
const keyPair0 = sdk.wallet.keyPairFromSeedPhrase(seed.phrase, addressIndex)
if ('error' in keyPair0) {
  throw Error(keyPair0.error)
}

const unlockConditions = sdk.wallet.standardUnlockConditions(keyPair0.publicKey)
if ('error' in unlockConditions) {
  throw Error(unlockConditions.error)
}
const address0 = sdk.wallet.addressFromUnlockConditions(
  unlockConditions.unlockConditions
)
if ('error' in address0) {
  throw Error(address0.error)
}

// Add the wallet.
const { data: wallet } = await walletd.walletAdd({
  data: {
    name: 'test wallet',
    description: '',
    metadata: {
      type: 'seed',
      // This is not necessary for this example to work, but the walletd client app / UI
      // requires this hash to valdiate and ensure the user is using the correct seed phrase.
      mnemonicHash: blake2bHex(seed.phrase),
    },
  },
})

// Add the address to the wallet, make sure to include the index.
await walletd.walletAddressAdd({
  params: {
    id: wallet.id,
  },
  data: {
    description: '',
    address: address0.address,
    spendPolicy: {
      type: 'uc',
      policy: unlockConditions.unlockConditions,
    },
    metadata: {
      index: addressIndex,
    },
  },
})

// Part 2: Construct, sign, and broadcast a v2 transaction.

const recipientAddress = address0.address // Set to whatever address.
const changeAddress = address0.address // Set to whatever address.
const sendAmount = 10

const {
  data: { transaction, basis },
} = await walletd.walletConstructV2Transaction({
  params: {
    id: wallet.id,
  },
  data: {
    changeAddress,
    siacoins: [
      {
        value: sendAmount.toString(),
        address: recipientAddress,
      },
    ],
  },
})

// Prepare the transaction input sig hash used for signing.
const { data: consensusState } = await walletd.consensusTipState()
const { data: consensusNetwork } = await walletd.consensusNetwork()
const txnInputSigHash = sdk.wallet.v2TransactionInputSigHash(
  consensusState,
  consensusNetwork,
  transaction
)
if ('error' in txnInputSigHash) {
  throw Error(txnInputSigHash.error)
}

// To best demonstate signing with a wallet in walletd, lets assume the wallet
// may have more than just the one address added above.
const { data: addresses } = await walletd.walletAddresses({
  params: {
    id: wallet.id,
  },
})

// Note: if we wanted to send siafunds we would do the same process for siafundInputs.
for (const input of transaction.siacoinInputs ?? []) {
  // Find the address metadata to get the index.
  const address = addresses.find(
    (a) => a.address === input.parent.siacoinOutput.address
  )
  if (!address || !address.metadata.index) {
    throw Error('Address not found')
  }

  // Get the key pair for the address.
  const keyPair = sdk.wallet.keyPairFromSeedPhrase(
    seed.phrase,
    address.metadata.index
  )
  if ('error' in keyPair) {
    throw Error(keyPair.error)
  }

  // Add the signature to the input policy.
  const signatureForKeyPair = sdk.wallet.signHash(
    keyPair.privateKey,
    txnInputSigHash.sigHash
  )
  if ('error' in signatureForKeyPair) {
    throw Error(signatureForKeyPair.error)
  }
  input.satisfiedPolicy.signatures = [signatureForKeyPair.signature]
}

// Broadcast the v2 transaction with the basis from construct.
await walletd.txPoolBroadcast({
  data: {
    basis,
    v2transactions: [transaction],
    transactions: [],
  },
})
