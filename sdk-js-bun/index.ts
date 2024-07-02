import { initSDK } from '@siafoundation/sdk'

const sdk = await initSDK()

console.log(sdk.wallet.generateSeedPhrase())
console.log(sdk.wallet.generateKeyPair())
