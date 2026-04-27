#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const projectRoot = resolve(__dirname, '..')
const emojiDir = join(projectRoot, 'public', 'win-55-ui', 'emoji')
const registryPath = join(emojiDir, 'emoji-registry.csv')
const header = 'emoji,code'

function usage(exitCode = 0) {
  const output = [
    'Usage:',
    '  npm run emoji -- list',
    '  npm run emoji -- check',
    '  npm run emoji -- sort',
    '  npm run emoji -- add <emoji> <code|gif-path> [gif-path]',
    '  npm run emoji -- replace <emoji> <code|gif-path> [gif-path]',
    '  npm run emoji -- remove <emoji>',
    '',
    'Examples:',
    '  npm run emoji -- add 😀 123',
    '  npm run emoji -- add 😀 ./new-emoji.gif',
    '  npm run emoji -- replace 😀 123 ./new-emoji.gif',
  ].join('\n')

  if (exitCode === 0) {
    console.log(output)
  } else {
    console.error(output)
  }

  process.exit(exitCode)
}

function fail(message) {
  console.error(`emoji-cli: ${message}`)
  process.exit(1)
}

function normalizeCode(value) {
  const code = value.trim().replace(/\.gif$/i, '')

  if (!code) {
    fail('emoji code cannot be empty')
  }

  if (code.includes(',') || /[\r\n]/.test(code)) {
    fail('emoji code cannot contain commas or newlines')
  }

  return code
}

function assertEmoji(value) {
  if (!value) {
    fail('emoji is required')
  }

  if (value.includes(',') || /[\r\n]/.test(value)) {
    fail('emoji cannot contain commas or newlines')
  }
}

function parseRegistry() {
  if (!existsSync(registryPath)) {
    return []
  }

  const csv = readFileSync(registryPath, 'utf8').replace(/^\uFEFF/, '')
  const rows = []

  for (const [index, rawRow] of csv.split(/\r?\n/).entries()) {
    const row = rawRow.trim()

    if (!row) {
      continue
    }

    if (index === 0 && row.toLowerCase() === header) {
      continue
    }

    const separatorIndex = row.indexOf(',')

    if (separatorIndex === -1) {
      fail(`registry row ${index + 1} is missing a comma`)
    }

    const emoji = row.slice(0, separatorIndex).trim()
    const code = normalizeCode(row.slice(separatorIndex + 1))

    if (!emoji) {
      fail(`registry row ${index + 1} has an empty emoji`)
    }

    rows.push({ emoji, code })
  }

  return rows
}

function writeRegistry(rows) {
  mkdirSync(emojiDir, { recursive: true })
  const body = rows.map(({ emoji, code }) => `${emoji},${code}`).join('\n')
  writeFileSync(registryPath, `${header}\n${body}${body ? '\n' : ''}`, 'utf8')
}

function resolveCodeAndSource(codeOrPath, maybeSourcePath) {
  if (!codeOrPath) {
    fail('emoji code or gif path is required')
  }

  const firstArgLooksLikeGif = extname(codeOrPath).toLowerCase() === '.gif'
  const sourcePath = maybeSourcePath ?? (firstArgLooksLikeGif ? codeOrPath : null)
  const code = normalizeCode(firstArgLooksLikeGif ? basename(codeOrPath) : codeOrPath)

  return { code, sourcePath }
}

function copyGifIfNeeded(code, sourcePath) {
  if (!sourcePath) {
    return
  }

  const absoluteSourcePath = resolve(projectRoot, sourcePath)

  if (!existsSync(absoluteSourcePath)) {
    fail(`gif source does not exist: ${sourcePath}`)
  }

  if (extname(absoluteSourcePath).toLowerCase() !== '.gif') {
    fail(`gif source must be a .gif file: ${sourcePath}`)
  }

  mkdirSync(emojiDir, { recursive: true })
  copyFileSync(absoluteSourcePath, join(emojiDir, `${code}.gif`))
}

function upsertEmoji({ emoji, code, sourcePath, replace }) {
  assertEmoji(emoji)
  copyGifIfNeeded(code, sourcePath)

  const rows = parseRegistry()
  const existingIndex = rows.findIndex((row) => row.emoji === emoji)

  if (existingIndex !== -1 && !replace) {
    fail(`${emoji} already exists with code ${rows[existingIndex].code}`)
  }

  if (existingIndex === -1 && replace) {
    rows.push({ emoji, code })
  } else if (existingIndex === -1) {
    rows.push({ emoji, code })
  } else {
    rows[existingIndex] = { emoji, code }
  }

  writeRegistry(rows)
  warnIfGifMissing(code)
  console.log(`${replace ? 'Replaced' : 'Added'} ${emoji},${code}`)
}

function removeEmoji(emoji) {
  assertEmoji(emoji)
  const rows = parseRegistry()
  const nextRows = rows.filter((row) => row.emoji !== emoji)

  if (nextRows.length === rows.length) {
    fail(`${emoji} is not in the registry`)
  }

  writeRegistry(nextRows)
  console.log(`Removed ${emoji}`)
}

function sortRegistry() {
  const rows = parseRegistry().sort((a, b) => a.code.localeCompare(b.code))
  writeRegistry(rows)
  console.log(`Sorted ${rows.length} emoji`)
}

function listRegistry() {
  for (const { emoji, code } of parseRegistry()) {
    console.log(`${emoji},${code}`)
  }
}

function warnIfGifMissing(code) {
  const gifPath = join(emojiDir, `${code}.gif`)

  if (!existsSync(gifPath)) {
    console.warn(`emoji-cli: warning: missing gif for code ${code}: ${gifPath}`)
  }
}

function checkRegistry() {
  const rows = parseRegistry()
  const seenEmoji = new Set()
  const seenCodes = new Set()
  let ok = true

  for (const { emoji, code } of rows) {
    if (seenEmoji.has(emoji)) {
      console.warn(`duplicate emoji: ${emoji}`)
    }

    if (seenCodes.has(code)) {
      console.error(`duplicate code: ${code}`)
      ok = false
    }

    if (!existsSync(join(emojiDir, `${code}.gif`))) {
      console.error(`missing gif: ${code}.gif`)
      ok = false
    }

    seenEmoji.add(emoji)
    seenCodes.add(code)
  }

  if (!ok) {
    process.exit(1)
  }

  console.log(`Registry OK (${rows.length} emoji)`)
}

const [command, emoji, codeOrPath, sourcePath] = process.argv.slice(2)

switch (command) {
  case 'add': {
    const resolved = resolveCodeAndSource(codeOrPath, sourcePath)
    upsertEmoji({ emoji, ...resolved, replace: false })
    break
  }

  case 'replace': {
    const resolved = resolveCodeAndSource(codeOrPath, sourcePath)
    upsertEmoji({ emoji, ...resolved, replace: true })
    break
  }

  case 'remove':
    removeEmoji(emoji)
    break

  case 'list':
    listRegistry()
    break

  case 'sort':
    sortRegistry()
    break

  case 'check':
    checkRegistry()
    break

  case '-h':
  case '--help':
  case 'help':
  case undefined:
    usage(command === undefined ? 1 : 0)
    break

  default:
    fail(`unknown command: ${command}`)
}
