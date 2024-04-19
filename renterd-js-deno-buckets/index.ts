import { Bus } from 'npm:@siafoundation/renterd-js'
import { load } from 'https://deno.land/std@0.223.0/dotenv/mod.ts'

const env = await load()
const api = env['RENTERD_API']
const password = env['RENTERD_PASSWORD']

const bus = Bus({
  api,
  password,
})

const b = await bus.buckets()

console.log(b.data)
