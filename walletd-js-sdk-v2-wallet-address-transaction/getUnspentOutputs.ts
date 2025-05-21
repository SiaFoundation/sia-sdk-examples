import { Walletd } from '@siafoundation/walletd-js'

const walletdApiAddress = Bun.env['WALLETD_API_ADDRESS']!
const walletdApiPassword = Bun.env['WALLETD_API_PASSWORD']!
const walletId = Bun.env['WALLETD_WALLET_ID']!

console.log('Initializing walletd...')
const walletd = Walletd({
  api: walletdApiAddress,
  password: walletdApiPassword,
})
console.log('walletd initialized')

const walletAddressesResponse = await walletd.walletAddresses({
  params: {
    id: walletId,
  },
})

const walletOutputsResponse = await walletd.walletOutputsSiacoin({
  params: {
    id: walletId,
  },
})

console.log('Wallet outputs:')
console.log(walletOutputsResponse.data.outputs)
console.log(walletOutputsResponse.data.outputs[0].confirmations)

const addressOutputsResponse = await walletd.walletAddressOutputsSiacoin({
  params: {
    addr: walletAddressesResponse.data[0]!.address,
  },
})

console.log('Address outputs:')
console.log(addressOutputsResponse.data.outputs)
console.log(addressOutputsResponse.data.outputs[0].confirmations)
