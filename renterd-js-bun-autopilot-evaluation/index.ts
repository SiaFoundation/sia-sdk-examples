import { Autopilot, Bus } from '@siafoundation/renterd-js'
import { toHastings } from '@siafoundation/units'

const api = Bun.env['RENTERD_API']!
const password = Bun.env['RENTERD_PASSWORD']

if (!api || !password) {
  console.error('RENTERD_API and RENTERD_PASSWORD must be set')
  process.exit(1)
}

const bus = Bus({
  api,
  password,
})

const autopilot = Autopilot({
  api,
  password,
})

try {
  const g = await bus.settingsGouging()
  const r = await bus.settingsUpload()
  const a = await bus.autopilotConfig()

  // target
  a.data.contracts.amount = 500

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
      autopilotConfig: a.data,
      gougingSettings: g.data,
      redundancySettings: r.data.redundancy,
    },
  })

  console.log('config:')
  console.log(a.data)
  console.log('gouging:')
  console.log(g.data)
  console.log('redundancy:')
  console.log(r.data)
  console.log('eval:')
  console.log(e.data)
} catch (e) {
  console.log(e)
}
