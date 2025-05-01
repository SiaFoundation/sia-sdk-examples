import { initSDK } from '@siafoundation/sdk'
import { Walletd } from '@siafoundation/walletd-js'
import { type WalletAddress } from '@siafoundation/walletd-types'

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

try {
  const { keyPair, addressData } = await generateAddress({
    walletId: walletId,
    seedPhrase,
    addressIndex: 10,
  })

  console.log('Key pair:', keyPair)
  console.log('Address data:', addressData)
} catch (error: any) {
  console.error(error.response?.data || error)
}

/**
 * Create an address for the wallet.
 * @param walletId The wallet ID.
 * @param seedPhrase The seed phrase.
 * @param addressIndex The address index.
 * @returns The key pair and address data.
 */
async function generateAddress({
  walletId,
  seedPhrase,
  addressIndex = 0,
}: {
  walletId: string
  seedPhrase: string
  addressIndex?: number
}): Promise<{
  keyPair: {
    publicKey: string
    privateKey: string
  }
  addressData: WalletAddress
}> {
  console.log('Generating key pair...')
  const keyPair = sdk.wallet.keyPairFromSeedPhrase(seedPhrase, addressIndex)
  if ('error' in keyPair) {
    throw Error(keyPair.error)
  }
  console.log('Key pair generated')

  console.log('Generating unlock conditions...')
  const unlockConditions = sdk.wallet.standardUnlockConditions(
    keyPair.publicKey
  )
  if ('error' in unlockConditions) {
    throw Error(unlockConditions.error)
  }
  console.log('Unlock conditions generated')
  console.log('Generating address...')
  const address0 = sdk.wallet.addressFromUnlockConditions(
    unlockConditions.unlockConditions
  )
  if ('error' in address0) {
    throw Error(address0.error)
  }
  console.log('Address generated')

  // Make sure to include the index in the metadata.
  const addressData = {
    description: '',
    address: address0.address,
    spendPolicy: {
      type: 'uc' as const,
      policy: unlockConditions.unlockConditions,
    },
    metadata: {
      index: addressIndex,
    },
  }

  // Add the address to the wallet.
  console.log('Adding address to wallet...')
  await walletd.walletAddressAdd({
    params: {
      id: walletId,
    },
    data: addressData,
  })
  console.log('Address added to wallet')

  return {
    keyPair: keyPair,
    addressData,
  }
}
