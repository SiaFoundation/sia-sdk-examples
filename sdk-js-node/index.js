import { initSDK } from '@siafoundation/sdk'
import { sampleV2Transaction } from './mock.js'

const sdk = await initSDK()

console.log(sdk.wallet.generateSeedPhrase())
console.log(sdk.wallet.generateKeyPair())

// Should be 38f1e7e2ce6c7ce84bff4d13e771ef2152cbeef36b6d67bc53f9831042042e8c
console.log(sdk.wallet.v2TransactionId(sampleV2Transaction))
