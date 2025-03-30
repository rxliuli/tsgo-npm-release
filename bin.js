#!/usr/bin/env node

import { join } from 'node:path'
import { existsSync, chmodSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import json from './package.json' with { type: 'json' }

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

const binaryName = `tsgo-${platformMap[platform]}-${archMap[arch]}${ext}`;

const binDir = join(path.dirname(fileURLToPath(import.meta.url)), 'bin')
const binaryPath = join(binDir, binaryName)

async function download() {
  console.log(
    `First time running tsgo, downloading binary file for ${platformMap[platform]}-${archMap[arch]}...`,
  )

  try {
    const downloadUrl = `https://github.com/rxliuli/tsgo-npm-release/releases/download/v${json.version}/${binaryName}`
    console.log('downloadUrl', downloadUrl)
    const response = await fetch(downloadUrl)

    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText} (${response.status})`)
    }

    const buffer = await response.arrayBuffer();
    await writeFile(binaryPath, Buffer.from(buffer))

    console.log('Download completed!')
  } catch (error) {
    console.error(`Download failed: ${error.message}`)
    process.exit(1)
  }
}

if (!existsSync(binaryPath)) {
  await mkdir(binDir, { recursive: true })
  await download()
}

if (platform !== 'win32') {
  try {
    chmodSync(binaryPath, 0o755)
  } catch (err) {
    console.error(`Error setting executable permission for binary file:`, err)
  }
}

const result = spawnSync(binaryPath, process.argv.slice(2), {
  stdio: 'inherit',
})

process.exit(result.status)
