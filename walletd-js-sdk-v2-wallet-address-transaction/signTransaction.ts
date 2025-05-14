import { initSDK } from '@siafoundation/sdk'
import { Walletd } from '@siafoundation/walletd-js'
import type { V2Transaction } from '@siafoundation/types'
import { sampleV2Transaction } from './mock'

const walletdApiAddress = Bun.env['WALLETD_API_ADDRESS']!
const walletdApiPassword = Bun.env['WALLETD_API_PASSWORD']!
const walletId = Bun.env['WALLETD_WALLET_ID']!
const seedPhrase = Bun.env['SEED_PHRASE']!

console.log('Initializing walletd...')
const walletd = Walletd({
  api: walletdApiAddress,
  password: walletdApiPassword,
})
console.log('walletd initialized')

console.log('Initializing SDK...')
const sdk = await initSDK()
console.log('SDK initialized')

await signTransaction({
  seedPhrase,
  walletId,
  transaction: sampleV2Transaction,
})

/**
 * Sign a transaction using a seed phrase to generate any required key pairs.
 * @param seedPhrase The seed phrase.
 * @param walletId The wallet ID.
 * @param transaction The transaction to sign.
 */
async function signTransaction({
  seedPhrase,
  walletId,
  transaction,
}: {
  seedPhrase: string
  walletId: string
  transaction: V2Transaction
}) {
  try {
    // Prepare the transaction input sig hash used for signing.
    console.log('Preparing transaction input sig hash...')
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
    console.log('Transaction input sig hash prepared')

    // To best demonstate signing with a wallet in walletd, lets assume the wallet
    // may have more than just the one address added above.
    console.log('Getting addresses...')
    const { data: addresses } = await walletd.walletAddresses({
      params: {
        id: walletId,
      },
    })
    console.log('Addresses retrieved')

    console.log('Signing transaction...')
    for (const input of transaction.siacoinInputs ?? []) {
      // Find the address metadata to get the index.
      const address = addresses.find(
        (a) => a.address === input.parent.siacoinOutput.address
      )
      if (!address || address.metadata.index === undefined) {
        throw Error('Address not found')
      }

      // Get the key pair for the address.
      const keyPair = sdk.wallet.keyPairFromSeedPhrase(
        seedPhrase,
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
    console.log('Transaction signed')
    console.log(JSON.stringify(transaction, null, 2))
  } catch (error: any) {
    console.error(error.response?.data || error)
  }
}
