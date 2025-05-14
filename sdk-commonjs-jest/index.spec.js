const { initSDK } = require('@siafoundation/sdk')
const { sampleV2Transaction } = require('./mock')

describe('generateSeed', () => {
  it('should generate a seed', async () => {
    const sdk = await initSDK()
    const seed = sdk.wallet.generateSeedPhrase()
    expect(seed).toBeDefined()
  })

  it('should calculate the correct v2 transaction id', async () => {
    const sdk = await initSDK()
    const result = sdk.wallet.v2TransactionId(sampleV2Transaction)
    expect(result).toEqual({
      id: '38f1e7e2ce6c7ce84bff4d13e771ef2152cbeef36b6d67bc53f9831042042e8c',
    })
  })
})
