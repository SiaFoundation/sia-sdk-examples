const { initSDK } = require('@siafoundation/sdk')

describe('generateSeed', () => {
  it('should generate a seed', async () => {
    const sdk = await initSDK()
    const seed = sdk.wallet.generateSeedPhrase()
    expect(seed).toBeDefined()
  })
})
