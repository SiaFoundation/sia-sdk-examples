import { initSDK } from '@siafoundation/sdk'
import { Walletd } from '@siafoundation/walletd-js'
import { humanSiacoin } from '@siafoundation/units'

const walletdApiAddress = Bun.env['WALLETD_API_ADDRESS']!
const walletdApiPassword = Bun.env['WALLETD_API_PASSWORD']!
const walletId = Bun.env['WALLETD_WALLET_ID']!
const seedPhrase = Bun.env['SEED_PHRASE']!
const recipientAddress = Bun.env['RECIPIENT_ADDRESS']!
const changeAddress = Bun.env['CHANGE_ADDRESS']!
const sendAmount = Bun.env['SEND_AMOUNT']!

console.log('Initializing walletd...')
const walletd = Walletd({
  api: walletdApiAddress,
  password: walletdApiPassword,
})
console.log('walletd initialized')

console.log('Initializing SDK...')
const sdk = await initSDK()
console.log('SDK initialized')

await sendTransactionSeedPhrase({
  seedPhrase,
  walletId,
  recipientAddress,
  changeAddress,
  sendAmount,
})

/**
 * Send a transaction using a seed phrase to generate any required key pairs.
 * @param seedPhrase The seed phrase.
 * @param walletId The wallet ID.
 * @param recipientAddress The recipient address.
 * @param changeAddress The change address.
 * @param sendAmount The amount to send.
 */
async function sendTransactionSeedPhrase({
  seedPhrase,
  walletId,
  recipientAddress,
  changeAddress,
  sendAmount,
}: {
  seedPhrase: string
  walletId: string
  recipientAddress: string
  changeAddress: string
  sendAmount: string
}) {
  console.log(`Sending ${humanSiacoin(sendAmount)} to ${recipientAddress}`)
  let siacoinOutputIds: string[] = []
  try {
    console.log('Constructing transaction...')

    const {
      data: { transaction, basis },
    } = await walletd.walletConstructV2Transaction({
      params: {
        id: walletId,
      },
      data: {
        changeAddress,
        siacoins: [
          {
            value: sendAmount,
            address: recipientAddress,
          },
        ],
      },
    })
    console.log('Transaction constructed')
    siacoinOutputIds = transaction.siacoinInputs?.map((i) => i.parent.id) || []

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

    // Broadcast the v2 transaction with the basis from construct.
    console.log('Broadcasting transaction...')
    await walletd.txPoolBroadcast({
      data: {
        basis,
        v2transactions: [transaction],
        transactions: [],
      },
    })
    console.log('Transaction broadcasted')
  } catch (error: any) {
    if (siacoinOutputIds.length > 0) {
      console.log('Releasing transaction...')
      await walletd.walletRelease({
        params: {
          id: walletId,
        },
        data: {
          siacoinOutputs: siacoinOutputIds,
        },
      })
      console.log('Transaction released')
    }
    console.error(error.response?.data || error)
  }
}
