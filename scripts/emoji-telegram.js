#!/usr/bin/env node
/*
 * Packs public/win-55-ui/emoji/*.gif into Telegram custom emoji sets.
 *
 * Transforms are cached under .cache/emoji-telegram/ (gitignored): static
 * stickers as 100x100 RGBA PNG, animated as 100x100 VP9 WEBM with alpha.
 * Every source pixel is upscaled by an integer factor and centred, so no
 * resampling ever touches the art.
 */
import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpegPath from 'ffmpeg-static'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const projectRoot = resolve(__dirname, '..')

const pathsConfig = JSON.parse(readFileSync(join(projectRoot, 'paths.config.json'), 'utf8'))
const emojiDir = join(projectRoot, pathsConfig.publicEmoji)
const registryPath = join(emojiDir, 'emoji-registry.csv')
const byCategoryPath = join(emojiDir, 'emoji-by-category.json')

const cacheRoot = join(projectRoot, '.cache', 'emoji-telegram')
const manifestPath = join(cacheRoot, 'manifest.json')
const statePath = join(cacheRoot, 'state.json')

const CANVAS = 100
const MAX_STATIC_BYTES = 512 * 1024
const MAX_ANIMATED_BYTES = 256 * 1024
const MAX_FPS = 30
const MAX_DURATION_MS = 3000
/* Compressed animations aim below the 3s ceiling so rounding never overshoots. */
const DURATION_TARGET_MS = 2900
const SET_CAPACITY = 200
const CREATE_BATCH = 50
const MANIFEST_VERSION = 1

/* Display order of the picker tabs, mirroring emoji-cli's classifier. */
const CATEGORY_ORDER = [
  'Smileys & People',
  'Animals & Nature',
  'Food & Drink',
  'Objects & Places',
  'Symbols & Flags',
]

const CATEGORY_SLUGS = {
  'Smileys & People': 'smileys',
  'Animals & Nature': 'animals',
  'Food & Drink': 'food',
  'Objects & Places': 'objects',
  'Symbols & Flags': 'symbols',
}

const TELEGRAM_API = process.env.TELEGRAM_API_BASE ?? 'https://api.telegram.org'

function usage(exitCode = 0) {
  const output = [
    'Usage:',
    '  npm run emoji:telegram -- build  [--force] [--only CODE,CODE] [--category NAME] [--jobs N]',
    '  npm run emoji:telegram -- check',
    '  npm run emoji:telegram -- plan   [--group category|flat] [--base omsky_gamedev] [--title "Omsky Gamedev"]',
    '  npm run emoji:telegram -- sync   [--dry-run] [--prune] [--user-id ID] [--group ...] [--base ...] [--title ...]',
    '  npm run emoji:telegram -- clean',
    '',
    'build  transform GIFs into 100x100 PNG/WEBM under .cache/emoji-telegram/',
    'check  verify the cached files against Telegram limits and the manifest',
    'plan   print the sticker sets build/sync would produce (no network)',
    'sync   create or update those sets through the Bot API',
    '',
    'Sets: one per category (Objects & Places split in two) plus omsky_gamedev_picks,',
    'which follows handpicked-emoji.txt.',
    '',
    'Environment:',
    '  TELEGRAM_BOT_TOKEN  bot token from @BotFather (or put it in .env)',
    '',
    'Examples:',
    '  npm run emoji:telegram -- build --only 008,C00 --force',
    '  npm run emoji:telegram -- plan',
    '  npm run emoji:telegram -- sync --dry-run',
  ].join('\n')

  if (exitCode === 0) console.log(output)
  else console.error(output)

  process.exit(exitCode)
}

function fail(message) {
  console.error(`emoji-telegram: ${message}`)
  process.exit(1)
}

function parseFlags(args) {
  const flags = { _: [] }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (!arg.startsWith('--')) {
      flags._.push(arg)
      continue
    }

    const separator = arg.indexOf('=')
    const key = separator === -1 ? arg.slice(2) : arg.slice(2, separator)
    const inline = separator === -1 ? undefined : arg.slice(separator + 1)
    const next = args[index + 1]

    if (inline !== undefined) {
      flags[key] = inline
    } else if (next !== undefined && !next.startsWith('--')) {
      flags[key] = next
      index += 1
    } else {
      flags[key] = true
    }
  }

  return flags
}

function readOptions(flags) {
  return {
    only: flags.only
      ? String(flags.only).split(',').map((code) => code.trim().toUpperCase().padStart(3, '0'))
      : null,
    category: flags.category ? String(flags.category) : null,
    limit: flags.limit ? Number(flags.limit) : null,
    jobs: flags.jobs ? Number(flags.jobs) : 4,
    group: flags.group ? String(flags.group) : 'category',
    base: flags.base ? String(flags.base).toLowerCase() : 'omsky_gamedev',
    title: flags.title ? String(flags.title) : 'Omsky Gamedev',
    userId: flags['user-id'] ? Number(flags['user-id']) : null,
    botUsername: flags.bot ? String(flags.bot) : null,
    force: Boolean(flags.force),
    prune: Boolean(flags.prune),
    dryRun: Boolean(flags['dry-run']),
  }
}

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback
  return JSON.parse(readFileSync(path, 'utf8').replace(/^\uFEFF/, ''))
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true })
  const temporary = `${path}.tmp`
  writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
  renameSync(temporary, path)
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex')
}

function chunk(items, size) {
  const chunks = []
  for (let index = 0; index < items.length; index += size) chunks.push(items.slice(index, index + size))
  return chunks
}

/* Balanced parts keep the Objects split even (123/122) instead of 200/45. */
function splitBalanced(items, capacity) {
  if (items.length === 0) return []
  const parts = Math.max(1, Math.ceil(items.length / capacity))
  return chunk(items, Math.ceil(items.length / parts))
}

async function mapPool(items, limit, worker) {
  const results = new Array(items.length)
  let cursor = 0
  const runners = Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, async () => {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      results[index] = await worker(items[index], index)
    }
  })
  await Promise.all(runners)
  return results
}

function parseRegistry() {
  if (!existsSync(registryPath)) fail(`registry not found: ${registryPath}`)

  const csv = readFileSync(registryPath, 'utf8').replace(/^\uFEFF/, '')
  const rows = []

  for (const [index, rawRow] of csv.split(/\r?\n/).entries()) {
    const row = rawRow.trim()
    if (!row) continue
    if (index === 0 && row.toLowerCase() === 'emoji,code') continue

    const separator = row.indexOf(',')
    if (separator === -1) fail(`registry row ${index + 1} is missing a comma`)

    rows.push({
      emoji: row.slice(0, separator).trim(),
      code: row.slice(separator + 1).trim().replace(/\.gif$/i, '').toUpperCase(),
    })
  }

  return rows
}

function loadCategories() {
  if (!existsSync(byCategoryPath)) {
    fail(`missing ${byCategoryPath} - run: npm run emoji -- classify`)
  }

  const index = new Map()
  for (const group of readJson(byCategoryPath, [])) {
    for (const { code } of group.emojis) index.set(code.toUpperCase(), group.category)
  }

  return index
}

const handpickedPath = join(projectRoot, 'handpicked-emoji.txt')
const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })

/* Mirrors EMOJI_DETECTION_PATTERN: text pasted around the emoji is ignored. */
const EMOJI_PATTERN = /^(?:[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]\uFE0F?\u20E3|\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?)*|\p{Emoji_Presentation})$/u

/* Picks are one emoji per line, but any layout works: emoji are extracted,
   `#` starts a comment, and repeats keep their first position. */
function readHandpicked(manifest) {
  if (!existsSync(handpickedPath)) return { entries: [], duplicates: [], unknown: [] }

  const codeByEmoji = new Map()
  for (const { emoji, code } of parseRegistry()) {
    if (!codeByEmoji.has(emoji)) codeByEmoji.set(emoji, code)
  }

  const entries = []
  const duplicates = []
  const unknown = []
  const seen = new Set()

  for (const line of readFileSync(handpickedPath, 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/)) {
    if (line.trimStart().startsWith('#')) continue

    for (const { segment } of segmenter.segment(line)) {
      if (!EMOJI_PATTERN.test(segment)) continue
      if (seen.has(segment)) {
        duplicates.push(segment)
        continue
      }

      seen.add(segment)

      const code = codeByEmoji.get(segment)
      const entry = code ? manifest.entries[code] : null

      if (entry) entries.push(entry)
      else unknown.push(segment)
    }
  }

  return { entries, duplicates, unknown }
}

function picksFor(manifest, options) {
  if (options.only || options.category || options.limit) return []

  const { entries, duplicates, unknown } = readHandpicked(manifest)

  if (entries.length > SET_CAPACITY) {
    fail(`${handpickedPath} has ${entries.length} unique emoji, the limit is ${SET_CAPACITY}`)
  }

  if (duplicates.length > 0) console.warn(`handpicked: ignoring repeated ${[...new Set(duplicates)].join(' ')}`)
  if (unknown.length > 0) console.warn(`handpicked: not in the registry, skipped ${[...new Set(unknown)].join(' ')}`)

  return entries
}

/* Frame delays are summed here rather than read from ffmpeg: only the
   duration matters, and GIF's 0-delay frames render at 100ms in clients. */
function probeGif(buffer, label) {
  if (buffer.toString('ascii', 0, 3) !== 'GIF') fail(`${label} is not a GIF`)

  const width = buffer.readUInt16LE(6)
  const height = buffer.readUInt16LE(8)
  const packed = buffer[10]
  let offset = 13

  if (packed & 0x80) offset += 3 * 2 ** ((packed & 7) + 1)

  let frames = 0
  let durationMs = 0

  const skipSubBlocks = () => {
    while (offset < buffer.length) {
      const size = buffer[offset]
      offset += 1 + size
      if (size === 0) break
    }
  }

  while (offset < buffer.length) {
    const block = buffer[offset]

    if (block === 0x3b) break

    if (block === 0x21) {
      const labelByte = buffer[offset + 1]

      if (labelByte === 0xf9 && buffer[offset + 2] === 4) {
        durationMs += buffer.readUInt16LE(offset + 4) * 10 || 100
        offset += 8
      } else {
        offset += 2
        skipSubBlocks()
      }

      continue
    }

    if (block === 0x2c) {
      frames += 1
      const localPacked = buffer[offset + 9]
      offset += 10
      if (localPacked & 0x80) offset += 3 * 2 ** ((localPacked & 7) + 1)
      offset += 1
      skipSubBlocks()
      continue
    }

    break
  }

  return { width, height, frames: Math.max(frames, 1), durationMs }
}

function geometry(source) {
  const scale = Math.max(1, Math.floor(CANVAS / Math.max(source.width, source.height)))
  const width = source.width * scale
  const height = source.height * scale

  return {
    scale,
    width,
    height,
    left: Math.floor((CANVAS - width) / 2),
    top: Math.floor((CANVAS - height) / 2),
  }
}

function outputFor(entry, geometryValue) {
  const directory = entry.format === 'animated' ? 'animated' : 'static'
  const extension = entry.format === 'animated' ? 'webm' : 'png'
  return {
    file: `${directory}/${entry.code}.${extension}`,
    path: join(cacheRoot, directory, `${entry.code}.${extension}`),
    geometry: geometryValue,
  }
}

function runFfmpeg(args) {
  const binary = process.env.FFMPEG_PATH ?? ffmpegPath

  if (!binary || !existsSync(binary)) {
    fail('ffmpeg not found - run: npm install (and allow the ffmpeg-static install script)')
  }

  return new Promise((resolvePromise, rejectPromise) => {
    execFile(binary, args, { maxBuffer: 4 * 1024 * 1024 }, (error, _stdout, stderr) => {
      if (error) rejectPromise(new Error(`ffmpeg: ${String(stderr).trim() || error.message}`))
      else resolvePromise()
    })
  })
}

async function transform(entry) {
  const sourcePath = join(emojiDir, `${entry.code}.gif`)
  const output = outputFor(entry, entry.geometry)
  const chain = []

  mkdirSync(dirname(output.path), { recursive: true })

  if (entry.format === 'animated' && entry.source.durationMs > MAX_DURATION_MS) {
    chain.push(`setpts=PTS*${(DURATION_TARGET_MS / entry.source.durationMs).toFixed(6)}`)
  }

  if (entry.format === 'animated') chain.push(`fps=${MAX_FPS}`)

  chain.push(
    `scale=${output.geometry.width}:${output.geometry.height}:flags=neighbor`,
    `pad=${CANVAS}:${CANVAS}:${output.geometry.left}:${output.geometry.top}:color=0x00000000`,
    `format=${entry.format === 'animated' ? 'yuva420p' : 'rgba'}`,
  )

  const common = ['-y', '-hide_banner', '-loglevel', 'error', '-i', sourcePath, '-vf', chain.join(',')]

  if (entry.format === 'animated') {
    await runFfmpeg([
      ...common,
      '-an',
      '-c:v', 'libvpx-vp9',
      '-pix_fmt', 'yuva420p',
      '-auto-alt-ref', '0',
      '-lossless', '1',
      '-row-mt', '1',
      '-map_metadata', '-1',
      output.path,
    ])
  } else {
    await runFfmpeg([...common, '-frames:v', '1', '-c:v', 'png', output.path])
  }

  return output
}

function readPngSize(buffer) {
  if (buffer.toString('ascii', 1, 4) !== 'PNG') return null
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
}

function describe(entry) {
  const source = `${entry.source.width}x${entry.source.height}`
  return `${entry.code} (${source}, x${entry.scale}, ${entry.format})`
}

function selectEntries(manifest, options) {
  let entries = Object.values(manifest.entries)

  if (options.only) {
    const wanted = new Set(options.only)
    entries = entries.filter((entry) => wanted.has(entry.code))
    const missing = [...wanted].filter((code) => !manifest.entries[code])
    if (missing.length > 0) fail(`not in the manifest: ${missing.join(', ')} - run build first`)
  }

  if (options.category) {
    const needle = options.category.toLowerCase()
    entries = entries.filter((entry) => {
      const slug = CATEGORY_SLUGS[entry.category] ?? ''
      return entry.category.toLowerCase() === needle || slug === needle
    })
    if (entries.length === 0) fail(`no cached emoji in category "${options.category}"`)
  }

  if (options.limit) entries = entries.slice(0, options.limit)

  return entries.sort((a, b) => a.order - b.order)
}

async function build(options) {
  const registry = parseRegistry()
  const categories = loadCategories()
  const manifest = readJson(manifestPath, { version: MANIFEST_VERSION, entries: {} })
  const nextEntries = { ...manifest.entries }
  const targets = []

  for (const [order, { emoji, code }] of registry.entries()) {
    const sourcePath = join(emojiDir, `${code}.gif`)

    if (!existsSync(sourcePath)) {
      console.warn(`emoji-telegram: warning: skipping ${code}, ${sourcePath} is missing`)
      continue
    }

    const buffer = readFileSync(sourcePath)
    const source = probeGif(buffer, `${code}.gif`)
    const format = source.frames > 1 ? 'animated' : 'static'
    const geometryValue = geometry(source)

    targets.push({
      order,
      code,
      emoji,
      category: categories.get(code) ?? 'Other',
      format,
      scale: geometryValue.scale,
      source: { ...source, sha256: sha256(buffer) },
      geometry: geometryValue,
    })
  }

  const selected = selectEntries({ entries: Object.fromEntries(targets.map((entry) => [entry.code, entry])) }, options)
  let built = 0
  let reused = 0
  const failures = []

  await mapPool(selected, options.jobs, async (entry) => {
    const previous = manifest.entries[entry.code]
    const output = outputFor(entry, entry.geometry)
    const settingsMatch = previous
      && previous.format === entry.format
      && previous.scale === entry.scale
      && previous.source.sha256 === entry.source.sha256
      && existsSync(join(cacheRoot, previous.output.file))

    if (settingsMatch && !options.force) {
      reused += 1
      nextEntries[entry.code] = { ...previous, emoji: entry.emoji, category: entry.category, order: entry.order }
      return
    }

    try {
      await transform(entry)
    } catch (error) {
      failures.push(`${entry.code}: ${error.message}`)
      return
    }

    const bytes = readFileSync(output.path)
    built += 1

    nextEntries[entry.code] = {
      code: entry.code,
      emoji: entry.emoji,
      category: entry.category,
      order: entry.order,
      format: entry.format,
      scale: entry.scale,
      source: entry.source,
      output: {
        file: output.file,
        bytes: bytes.length,
        sha256: sha256(bytes),
      },
    }

    process.stdout.write(`  ${describe(entry)} -> ${output.file} (${bytes.length} B)\n`)
  })

  /* Entries removed from the registry disappear from the manifest too. */
  const known = new Set(registry.map(({ code }) => code))
  for (const code of Object.keys(nextEntries)) if (!known.has(code)) delete nextEntries[code]

  writeJson(manifestPath, { version: MANIFEST_VERSION, canvas: CANVAS, entries: nextEntries })

  const counts = Object.values(nextEntries).reduce((totals, entry) => {
    totals[entry.format] += 1
    return totals
  }, { static: 0, animated: 0 })

  if (failures.length > 0) {
    for (const failure of failures) console.error(`  ${failure}`)
    fail(`${failures.length} file(s) failed to transform`)
  }

  console.log(`\nBuilt ${built}, reused ${reused} (${counts.static} static, ${counts.animated} animated) -> ${manifestPath}`)
}

function readState() {
  return readJson(statePath, { version: MANIFEST_VERSION, sets: {} })
}

function loadManifest() {
  const manifest = readJson(manifestPath, null)
  if (!manifest || Object.keys(manifest.entries ?? {}).length === 0) {
    fail('no cached stickers - run: npm run emoji:telegram -- build')
  }
  return manifest
}

function planSets(entries, options, botUsername, picks = []) {
  const suffix = `_by_${String(botUsername).toLowerCase()}`
  const buckets = []

  if (options.group === 'flat') {
    const parts = splitBalanced(entries, SET_CAPACITY)
    parts.forEach((part, index) => buckets.push({ category: 'All', index: index + 1, total: parts.length, entries: part }))
  } else if (options.group === 'category') {
    const extra = [...new Set(entries.map((entry) => entry.category))]
      .filter((category) => !CATEGORY_ORDER.includes(category))
      .sort()

    for (const category of [...CATEGORY_ORDER, ...extra]) {
      const list = entries.filter((entry) => entry.category === category)
      const parts = splitBalanced(list, SET_CAPACITY)
      parts.forEach((part, index) => buckets.push({ category, index: index + 1, total: parts.length, entries: part }))
    }
  } else {
    fail(`unknown --group "${options.group}" (expected category or flat)`)
  }

  buckets.push({ category: 'Handpicked', index: 1, total: 1, entries: picks })

  return buckets.map((bucket) => {
    const label = bucket.category === 'All' ? 'Emoji' : bucket.category
    const slug = bucket.category === 'Handpicked' ? 'picks' : CATEGORY_SLUGS[bucket.category] ?? 'emoji'
    const numbered = bucket.total > 1 ? `_${bucket.index}` : ''
    const name = `${options.base}_${slug}${numbered}${suffix}`
    const title = `${options.title} - ${label}${bucket.total > 1 ? ` ${bucket.index}` : ''}`

    if (!/^[a-z][a-z0-9_]*$/.test(name) || name.length > 64) fail(`invalid sticker set name: ${name}`)
    if (title.length > 64) fail(`sticker set title is too long: ${title}`)

    return { ...bucket, name, title }
  }).filter((bucket) => bucket.entries.length > 0)
}

function printPlan(sets) {
  for (const set of sets) {
    const animated = set.entries.filter((entry) => entry.format === 'animated').length
    console.log(`${set.name}`)
    console.log(`  "${set.title}" - ${set.entries.length} sticker(s): ${set.entries.length - animated} static, ${animated} animated`)
    console.log(`  t.me/addemoji/${set.name}`)
  }

  const total = sets.reduce((sum, set) => sum + set.entries.length, 0)
  console.log(`\n${sets.length} set(s), ${total} sticker(s)`)
}

function runPlan(options) {
  const manifest = loadManifest()
  const entries = selectEntries(manifest, options)
  printPlan(planSets(entries, options, options.botUsername ?? 'bot', picksFor(manifest, options)))
}

function check() {
  const manifest = loadManifest()
  const problems = []
  const counts = { static: 0, animated: 0 }

  for (const entry of Object.values(manifest.entries)) {
    const path = join(cacheRoot, entry.output.file)

    if (!existsSync(path)) {
      problems.push(`${entry.code}: missing ${entry.output.file}`)
      continue
    }

    const bytes = readFileSync(path)
    const limit = entry.format === 'animated' ? MAX_ANIMATED_BYTES : MAX_STATIC_BYTES

    if (bytes.length > limit) problems.push(`${entry.code}: ${bytes.length} B exceeds ${limit} B`)
    if (sha256(bytes) !== entry.output.sha256) problems.push(`${entry.code}: content does not match the manifest`)

    if (entry.format === 'static') {
      const size = readPngSize(bytes)
      if (!size) problems.push(`${entry.code}: not a PNG`)
      else if (size.width !== CANVAS || size.height !== CANVAS) problems.push(`${entry.code}: ${size.width}x${size.height}, expected ${CANVAS}x${CANVAS}`)
    } else if (bytes.readUInt32BE(0) !== 0x1a45dfa3) {
      problems.push(`${entry.code}: not a WebM/EBML file`)
    }

    counts[entry.format] += 1
  }

  for (const problem of problems) console.error(`  ${problem}`)

  if (problems.length > 0) {
    console.error(`\n${problems.length} problem(s)`)
    process.exit(1)
  }

  console.log(`Cache OK (${counts.static} static, ${counts.animated} animated)`)
}

function readDotenv() {
  const path = join(projectRoot, '.env')
  if (!existsSync(path)) return {}

  const values = {}
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line)
    if (!match) continue
    values[match[1]] = match[2].trim().replace(/^(['"])(.*)\1$/, '$2')
  }

  return values
}

function botToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN ?? readDotenv().TELEGRAM_BOT_TOKEN

  if (!token) {
    fail([
      'TELEGRAM_BOT_TOKEN is not set.',
      'Add it to .env (gitignored) or export it:',
      '  TELEGRAM_BOT_TOKEN=123456:ABC...',
    ].join('\n'))
  }

  return token
}

const sleep = (ms) => new Promise((resolvePromise) => { setTimeout(resolvePromise, ms) })

async function telegram(method, payload = {}, files = []) {
  const url = `${TELEGRAM_API}/bot${botToken()}/${method}`

  for (let attempt = 0; attempt < 5; attempt += 1) {
    /* Multipart only when something is attached; Telegram rejects an empty
       multipart body, so field-only calls travel as JSON. */
    const form = files.length > 0 ? new FormData() : null

    if (form) {
      for (const [key, value] of Object.entries(payload)) {
        if (value === undefined) continue
        form.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value))
      }

      for (const file of files) {
        form.append(file.name, new Blob([file.buffer], { type: file.type }), file.filename)
      }
    }

    let response
    try {
      response = await fetch(url, {
        method: 'POST',
        body: form ?? JSON.stringify(payload),
        headers: form ? undefined : { 'content-type': 'application/json' },
        signal: AbortSignal.timeout(120_000),
      })
    } catch (error) {
      if (attempt === 4) throw new Error(`${method}: ${error.message}`)
      await sleep(1000 * (attempt + 1))
      continue
    }

    const data = await response.json().catch(() => null)

    if (data?.ok) return data.result

    if (data?.error_code === 429) {
      await sleep((data.parameters?.retry_after ?? 1) * 1000 + 500)
      continue
    }

    if (response.status >= 500 && attempt < 4) {
      await sleep(1000 * (attempt + 1))
      continue
    }

    throw new Error(`${method}: ${data?.description ?? `HTTP ${response.status}`}`)
  }

  throw new Error(`${method}: giving up after 5 attempts`)
}

async function fetchSet(name) {
  try {
    return await telegram('getStickerSet', { name })
  } catch (error) {
    if (/STICKERSET_INVALID|not found/i.test(error.message)) return null
    throw error
  }
}

function stickerId(sticker) {
  return sticker.custom_emoji_id ?? sticker.file_id
}

function inputSticker(entry, attachName) {
  return {
    sticker: `attach://${attachName}`,
    /* WEBM uploads are "video" by Bot API naming; "animated" means TGS. */
    format: entry.format === 'animated' ? 'video' : 'static',
    emoji_list: [entry.emoji],
  }
}

function attachment(entry) {
  const buffer = readFileSync(join(cacheRoot, entry.output.file))
  return {
    buffer,
    filename: basename(entry.output.file),
    type: entry.format === 'animated' ? 'video/webm' : 'image/png',
  }
}

/*
 * Remote stickers are matched to codes by position, not by emoji: the set is
 * always written top-to-bottom, replaces keep their slot and prunes splice.
 * Emoji can repeat in the registry, so it is only a fallback for a lost state.
 */
function mapPositions(remote, entries, stateSet) {
  const positions = []

  for (const sticker of remote.stickers) {
    const code = Object.entries(stateSet?.stickers ?? {})
      .find(([, record]) => record.id === stickerId(sticker))?.[0]
    positions.push(code ?? null)
  }

  const claimed = new Set(positions.filter(Boolean))

  /* A set interrupted mid-sync still holds a prefix of the plan in order. */
  if (positions.length <= entries.length && positions.every((code, index) => code !== null || entries[index].emoji === remote.stickers[index].emoji)) {
    positions.forEach((code, index) => {
      if (code === null && !claimed.has(entries[index].code)) {
        positions[index] = entries[index].code
        claimed.add(entries[index].code)
      }
    })
  }

  /* Emoji is a last resort: the registry has two duplicate pairs. */
  const emojiCounts = entries.reduce((counts, entry) => counts.set(entry.emoji, (counts.get(entry.emoji) ?? 0) + 1), new Map())

  positions.forEach((code, index) => {
    if (code !== null) return
    const entry = entries.find((candidate) => candidate.emoji === remote.stickers[index].emoji && !claimed.has(candidate.code))
    if (entry && emojiCounts.get(entry.emoji) === 1) {
      positions[index] = entry.code
      claimed.add(entry.code)
    }
  })

  return positions
}

async function sync(options) {
  const manifest = loadManifest()
  const entries = selectEntries(manifest, options)
  const state = readState()
  const me = options.dryRun
    ? { id: options.userId ?? 0, username: options.botUsername ?? 'bot' }
    : await telegram('getMe')

  /* Custom emoji sets may not be owned by a bot (USER_IS_BOT), so the owner is
     a human id: --user-id, then TELEGRAM_OWNER_USER_ID from .env. */
  const envOwner = Number(readDotenv().TELEGRAM_OWNER_USER_ID)
  const ownerId = options.userId ?? (Number.isFinite(envOwner) && envOwner > 0 ? envOwner : me.id)
  const sets = planSets(entries, options, me.username, picksFor(manifest, options))

  if (options.dryRun) {
    printPlan(sets)
    console.log(`\nDry run: nothing was sent. Owner user_id would be ${ownerId || '<bot id>'}.`)
    return
  }

  if (state.bot && state.bot.id !== me.id) {
    console.warn(`State was written by bot ${state.bot.id} (@${state.bot.username}), now running as ${me.id}.`)
  }

  state.bot = { id: me.id, username: me.username }
  console.log(`Bot @${me.username} (id ${me.id}), owner user_id ${ownerId}\n`)

  let added = 0
  let replaced = 0
  let removed = 0
  let unchanged = 0

  for (const [index, set] of sets.entries()) {
    const prefix = `[${index + 1}/${sets.length}] ${set.name}`

    if (set.entries.length > SET_CAPACITY) fail(`${set.name} holds ${set.entries.length} stickers, the limit is ${SET_CAPACITY}`)

    let remote = await fetchSet(set.name)
    let positions = remote ? mapPositions(remote, set.entries, state.sets[set.name]) : []

    if (remote && remote.sticker_type !== 'custom_emoji') {
      fail(`${set.name} exists but is a ${remote.sticker_type} set`)
    }

    if (!remote) {
      const first = set.entries.slice(0, CREATE_BATCH)
      const files = first.map((entry, fileIndex) => ({ name: `file${fileIndex}`, ...attachment(entry) }))
      const stickers = first.map((entry, fileIndex) => inputSticker(entry, `file${fileIndex}`))

      console.log(`${prefix}: creating with ${first.length} sticker(s)`)

      try {
        await telegram('createNewStickerSet', {
          user_id: ownerId,
          name: set.name,
          title: set.title,
          sticker_type: 'custom_emoji',
          stickers,
        }, files)
      } catch (error) {
        if (/USER_IS_BOT/.test(error.message)) {
          throw new Error(`${error.message}\nHint: the owner must be a human; pass --user-id <your id> or set TELEGRAM_OWNER_USER_ID in .env.`)
        }
        if (/user_id|user not found|owner/i.test(error.message)) {
          throw new Error(`${error.message}\nHint: pass --user-id <telegram user id>.`)
        }
        throw error
      }

      positions = first.map((entry) => entry.code)
      remote = await fetchSet(set.name)
      if (!remote) fail(`${set.name} was created but getStickerSet returned nothing`)
      added += first.length
    } else if (remote.title !== set.title) {
      await telegram('setStickerSetTitle', { name: set.name, title: set.title })
      console.log(`${prefix}: retitled to "${set.title}"`)
    }

    const records = { ...(state.sets[set.name]?.stickers ?? {}) }
    const remoteStickers = remote?.stickers ?? []
    const byId = new Map(remoteStickers.map((sticker) => [stickerId(sticker), sticker]))

    const knownCodeFor = (slot) => positions[slot]
    const localByCode = new Map(set.entries.map((entry) => [entry.code, entry]))

    for (const [slot, sticker] of remoteStickers.entries()) {
      const code = knownCodeFor(slot)
      if (!code) continue

      const entry = localByCode.get(code)
      if (!entry) continue

      const record = records[code]

      if (record && record.sha256 === entry.output.sha256 && record.id === stickerId(sticker)) {
        unchanged += 1
        continue
      }

      if (record && record.sha256 === entry.output.sha256) continue

      if (record) {
        await telegram('replaceStickerInSet', {
          user_id: ownerId,
          name: set.name,
          old_sticker: byId.get(record.id)?.file_id ?? record.fileId,
          sticker: inputSticker(entry, 'file0'),
        }, [{ name: 'file0', ...attachment(entry) }])
        replaced += 1
        process.stdout.write(`  ${prefix}: ~ ${entry.code}\n`)
      }
    }

    const present = new Set(positions.filter(Boolean))
    const prunable = []
    let unmapped = 0

    for (const [slot, code] of positions.entries()) {
      if (!code) {
        unmapped += 1
        continue
      }

      if (localByCode.has(code)) continue

      if (options.prune) prunable.push({ code, sticker: remoteStickers[slot] })
      else console.warn(`  ${prefix}: remote sticker ${code} is not in this plan; rerun with --prune to delete it`)
    }

    if (unmapped > 0) {
      console.warn(`  ${prefix}: ${unmapped} remote sticker(s) could not be matched to a code; they are left alone`)
    }

    for (const { code, sticker } of prunable) {
      await telegram('deleteStickerFromSet', { sticker: sticker.file_id })
      delete records[code]
      removed += 1
      process.stdout.write(`  ${prefix}: - ${code}\n`)
    }

    if (prunable.length > 0) {
      const prunedCodes = new Set(prunable.map(({ code }) => code))
      positions = positions.filter((code) => code === null || !prunedCodes.has(code))
      for (const pruned of prunable) present.delete(pruned.code)
    }

    for (const entry of set.entries) {
      if (present.has(entry.code)) continue

      await telegram('addStickerToSet', {
        user_id: ownerId,
        name: set.name,
        sticker: inputSticker(entry, 'file0'),
      }, [{ name: 'file0', ...attachment(entry) }])

      positions.push(entry.code)
      present.add(entry.code)
      added += 1
      process.stdout.write(`  ${prefix}: + ${entry.code}\n`)
    }

    remote = await fetchSet(set.name)
    if (!remote) fail(`${set.name} disappeared after syncing`)

    const aligned = remote.stickers.length === positions.length
    if (!aligned) {
      console.warn(`  ${prefix}: remote has ${remote.stickers.length} stickers, expected ${positions.length}; not recording ids`)
    } else {
      for (const [slot, sticker] of remote.stickers.entries()) {
        const code = positions[slot]
        if (!code) continue
        const entry = localByCode.get(code)
        if (!entry) continue
        records[code] = {
          id: stickerId(sticker),
          fileId: sticker.file_id,
          sha256: entry.output.sha256,
          emoji: entry.emoji,
        }
      }
    }

    state.sets[set.name] = {
      title: set.title,
      category: set.category,
      stickers: records,
    }
    writeJson(statePath, state)
    console.log(`${prefix}: ${remote.stickers.length}/${set.entries.length} in place`)
  }

  writeJson(statePath, state)
  console.log(`\nDone: ${added} added, ${replaced} replaced, ${removed} removed, ${unchanged} unchanged.`)
  console.log(`State: ${statePath}`)
}

function clean() {
  const manifest = readJson(manifestPath, null)

  if (!manifest) {
    console.log('Nothing to clean')
    return
  }

  const kept = { ...manifest.entries }
  let dropped = 0

  for (const [code, entry] of Object.entries(kept)) {
    if (!existsSync(join(cacheRoot, entry.output.file))) {
      delete kept[code]
      dropped += 1
    }
  }

  writeJson(manifestPath, { ...manifest, entries: kept })
  console.log(`Dropped ${dropped} stale manifest entr${dropped === 1 ? 'y' : 'ies'}`)
}

const [command, ...rest] = process.argv.slice(2)
const flags = parseFlags(rest)
const options = readOptions(flags)

async function report(action) {
  try {
    await action()
  } catch (error) {
    console.error(`emoji-telegram: ${error.message}`)
    process.exit(1)
  }
}

switch (command) {
  case 'build':
    await report(() => build(options))
    break

  case 'check':
    check()
    break

  case 'plan':
    runPlan(options)
    break

  case 'sync':
    await report(() => sync(options))
    break

  case 'clean':
    clean()
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
