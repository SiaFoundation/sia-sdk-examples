import { Bus } from '@siafoundation/renterd-js'

const api = Bun.env['RENTERD_API']!
const password = Bun.env['RENTERD_PASSWORD']

const bus = Bus({
  api,
  password,
})

const b = await bus.buckets()

console.log(b.data)
