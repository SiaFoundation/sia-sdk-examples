import { initSDK } from '@siafoundation/sdk'
import { Walletd } from '@siafoundation/walletd-js'

const walletdApiAddress = process.env['WALLETD_API_ADDRESS']!
const walletdApiPassword = process.env['WALLETD_API_PASSWORD']!

console.log('Initializing walletd...')
Walletd({
  api: walletdApiAddress,
  password: walletdApiPassword,
})
console.log('walletd initialized')

console.log('Initializing SDK...')
const sdk = await initSDK()
console.log('SDK initialized')

const seed = sdk.wallet.generateSeedPhrase()
console.log('Seed:', seed)
