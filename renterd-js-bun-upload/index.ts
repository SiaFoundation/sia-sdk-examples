import { Worker } from '@siafoundation/renterd-js'
import fs from 'fs'

const api = Bun.env['RENTERD_API']!
const password = Bun.env['RENTERD_PASSWORD']

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
      console.log(progress.loaded / progress.total)
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
      console.log(progress.loaded / progress.total)
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
      console.log(progress.loaded / progress.total)
    },
  },
})

console.log(responseString.status)
