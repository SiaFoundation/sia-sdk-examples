import { Autopilot, Bus } from '@siafoundation/renterd-js'
import { toHastings } from '@siafoundation/units'

const api = Bun.env['RENTERD_API']!
const password = Bun.env['RENTERD_PASSWORD']

const bus = Bus({
  api,
  password,
})

const autopilot = Autopilot({
  api,
  password,
})

try {
  const g = await bus.settingGouging()
  const r = await bus.settingRedundancy()
  const c = await autopilot.config()

  // target
  c.data.contracts.amount = 500

  // gouging
  g.data.maxStoragePrice = toHastings(5000).toString()
  g.data.maxRPCPrice = toHastings(1000).toString()
  g.data.minMaxEphemeralAccountBalance = toHastings(1).toString()
  // g.data.minAccountExpiry = 1

  // pruning
  g.data.maxDownloadPrice = toHastings(1000).toString()

  // contract
  // c.data.contracts.period = 10
  // c.data.contracts.renewWindow = 10

  const e = await autopilot.configEvaluate({
    data: {
      autopilotConfig: c.data,
      gougingSettings: g.data,
      redundancySettings: r.data,
    },
  })

  console.log('config:')
  console.log(c.data)
  console.log('gouging:')
  console.log(g.data)
  console.log('redundancy:')
  console.log(r.data)
  console.log('eval:')
  console.log(e.data)
} catch (e) {
  console.log(e)
}
