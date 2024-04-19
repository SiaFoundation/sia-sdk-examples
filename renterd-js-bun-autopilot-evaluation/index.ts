import { Autopilot, Bus } from '@siafoundation/renterd-js'

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

const g = await bus.settingGouging()
const r = await bus.settingRedundancy()
const c = await autopilot.config()

const e = await autopilot.configEvaluate({
  data: {
    autopilotConfig: c.data,
    gougingSettings: g.data,
    redundancySettings: r.data,
  },
})

console.log(e.data)
