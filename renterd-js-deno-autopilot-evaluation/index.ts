import { Autopilot, Bus } from 'npm:@siafoundation/renterd-js'
import { load } from 'https://deno.land/std@0.223.0/dotenv/mod.ts'

const env = await load()
const api = env['RENTERD_API']
const password = env['RENTERD_PASSWORD']

const bus = Bus({
  api,
  password,
})

const autopilot = Autopilot({
  api,
  password,
})

const c = await bus.autopilotConfig()
const g = await bus.settingsGouging()
const r = await bus.settingsUpload()

const e = await autopilot.configEvaluate({
  data: {
    autopilotConfig: c.data,
    gougingSettings: g.data,
    redundancySettings: r.data.redundancy,
  },
})

console.log(e.data)
