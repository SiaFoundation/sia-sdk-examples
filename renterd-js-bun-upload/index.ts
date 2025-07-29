import { Worker } from '@siafoundation/renterd-js'
import fs from 'fs'

const api = Bun.env['RENTERD_API']!
const password = Bun.env['RENTERD_PASSWORD']

if (!api || !password) {
  console.error('RENTERD_API and RENTERD_PASSWORD must be set')
  process.exit(1)
}

const worker = Worker({
  api,
  password,
})

// Upload a file

const fileBuffer = fs.readFileSync('example.txt')

const responseFile = await worker.objectUpload({
  params: {
    key: 'testing/path/example.txt',
    bucket: 'default',
  },
  data: fileBuffer,
  config: {
    onUploadProgress: (progress) => {
      console.log(progress.loaded / (progress.total ?? 0))
    },
  },
})

console.log(responseFile.status)

// Upload JSON

const json = {
  foo: 'hello world',
}

const responseJson = await worker.objectUpload({
  params: {
    key: 'testing/path/example.json',
    bucket: 'default',
  },
  data: json,
  config: {
    onUploadProgress: (progress) => {
      console.log(progress.loaded / (progress.total ?? 0))
    },
  },
})

console.log(responseJson.status)

// Upload a string

const str = 'hello world'

const responseString = await worker.objectUpload({
  params: {
    key: 'testing/path/example.txt',
    bucket: 'default',
  },
  data: str,
  config: {
    onUploadProgress: (progress) => {
      console.log(progress.loaded / (progress.total ?? 0))
    },
  },
})

console.log(responseString.status)
