import { Explored } from '@siafoundation/explored-js'
import { monthsToBlocks, TBToBytes } from '@siafoundation/units'
import BigNumber from 'bignumber.js'

const siascan = Explored({
  api: 'https://api.siascan.com',
})

const rates = await siascan.exchangeRate({
  params: {
    currency: 'usd',
  },
})

const storagePriceTBMonthInUSD = new BigNumber(5)
const storagePriceTBMonthInSC = storagePriceTBMonthInUSD.div(rates.data)
const storagePriceTBBlockInSC = storagePriceTBMonthInSC.div(monthsToBlocks(1))
const storagePriceByteBlockInSC = storagePriceTBBlockInSC.div(TBToBytes(1))
console.log({
  storagePriceTBMonthInUSD,
  storagePriceTBMonthInSC,
  storagePriceTBBlockInSC,
  storagePriceByteBlockInSC,
})
