import { initSDK } from '@siafoundation/sdk'
import { Walletd } from '@siafoundation/walletd-js'
import { blake2bHex } from 'blakejs'
import { type Wallet } from '@siafoundation/walletd-types'

const walletdApiAddress = Bun.env['WALLETD_API_ADDRESS']!
const walletdApiPassword = Bun.env['WALLETD_API_PASSWORD']!

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
  const { seedPhrase, wallet } = await createWallet()

  console.log('Seed phrase:', seedPhrase)
  console.log('Wallet:', wallet)
} catch (error: any) {
  console.error(error.response?.data || error)
}

/**
 * Set up a seed wallet and add an address to walletd.
 * @returns The seed phrase and wallet.
 */
async function createWallet(): Promise<{
  seedPhrase: string
  wallet: Wallet
}> {
  console.log('Generating seed...')
  const seed = sdk.wallet.generateSeedPhrase()
  if ('error' in seed) {
    throw Error(seed.error)
  }
  console.log('Seed generated')

  // Add the wallet.
  console.log('Adding wallet...')
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

  return {
    seedPhrase: seed.phrase,
    wallet,
  }
}
