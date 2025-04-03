import { existsSync, chmodSync, constants } from 'node:fs'
import path, { join } from 'node:path'
import process, { env } from 'node:process'
import { mkdir, writeFile, copyFile } from 'node:fs/promises'
import json from './package.json' with { type: 'json' }
import { fileURLToPath } from 'node:url'

const platform = process.platform
const arch = process.arch

const archMap = {
  x64: 'amd64',
  ia32: '386',
  arm: 'arm',
  arm64: 'arm64',
}

const platformMap = {
  darwin: 'darwin',
  win32: 'windows',
  linux: 'linux',
  freebsd: 'freebsd',
}

const ext = platform === 'win32' ? '.exe' : ''

const binaryName = `tsgo-${platformMap[platform]}-${archMap[arch]}${ext}`

let tsgoProvider = 'rxliuli'

if (env.TSGO_PROVIDER) {
  tsgoProvider = env.TSGO_PROVIDER
}

const downloadUrl = `https://github.com/${tsgoProvider}/tsgo-npm-release/releases/download/v${json.version}/${binaryName}`

const binDir = join(path.dirname(fileURLToPath(import.meta.url)), 'bin')
await mkdir(binDir, { recursive: true })

const binaryPath = join(binDir, binaryName)

if (existsSync(binaryPath)) {
  // console.log('Binary file already exists, skipping download.')
  process.exit(0)
}

async function download() {
  if (env.TSGO_DIRECTORY) {
    const filePath = join(env.TSGO_DIRECTORY, 'built', 'local', `tsgo${ext}`)

    if (existsSync(filePath)) {
      try {
        await copyFile(filePath, binaryPath, constants.COPYFILE_EXCL)

        if (platform !== 'win32') {
          await chmod(binaryPath, 0o755)
        }

        process.exit(0);
      } catch (error) {
        console.error(`Copy file failed: ${error.message}`)
      }
    }
  }

  console.log(
    `Downloading binary file for ${platformMap[platform]}-${archMap[arch]}...`,
  )

  try {
    console.log('downloadUrl', downloadUrl)
    const response = await fetch(downloadUrl)

    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText} (${response.status})`)
    }

    const buffer = await response.arrayBuffer();
    await writeFile(binaryPath, Buffer.from(buffer))

    if (platform !== 'win32') {
      chmodSync(binaryPath, 0o755)
    }

    console.log('Download completed!')
  } catch (error) {
    console.error(`Download failed: ${error.message}`)
    process.exit(1)
  }
}

download().catch((err) => {
  console.error(`Error during installation: ${err.message}`)
  process.exit(1)
})
