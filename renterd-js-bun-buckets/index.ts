import { Bus } from '@siafoundation/renterd-js'

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

const b = await bus.buckets()

console.log(b.data)
