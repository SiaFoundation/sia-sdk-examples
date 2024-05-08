import { SiaCentral } from '@siafoundation/sia-central-js'
import { monthsToBlocks, TBToBytes } from '@siafoundation/units'
import BigNumber from 'bignumber.js'

const siaCentral = SiaCentral()

const rates = await siaCentral.exchangeRates({
  params: {
    currencies: 'sc',
  },
})

const storagePriceTBMonthInUSD = new BigNumber(5)
const storagePriceTBMonthInSC = storagePriceTBMonthInUSD.div(
  rates.data.rates.sc.usd
)
const storagePriceTBBlockInSC = storagePriceTBMonthInSC.div(monthsToBlocks(1))
const storagePriceByteBlockInSC = storagePriceTBBlockInSC.div(TBToBytes(1))
console.log({
  storagePriceTBMonthInUSD,
  storagePriceTBMonthInSC,
  storagePriceTBBlockInSC,
  storagePriceByteBlockInSC,
})
