#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const projectRoot = resolve(__dirname, '..')

// Repo directory layout, read from paths.config.json at the project root rather than hardcoded
// here - scripts/font/src/paths.ts reads the same file independently (it can't share this module
// directly: that one compiles via tsc, this runs as plain JS straight from scripts/).
const pathsConfig = JSON.parse(readFileSync(join(projectRoot, 'paths.config.json'), 'utf8'))
const emojiDir = join(projectRoot, pathsConfig.publicEmoji)
const xEmojiDir = join(projectRoot, pathsConfig.publicXEmoji)
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
    '  npm run emoji -- classify',
    '  npm run emoji -- import',
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

const categoriesPath = join(emojiDir, 'emoji-categories.json')
const byCategoryPath = join(emojiDir, 'emoji-by-category.json')

/* Fixed display order for the emoji picker's category tabs. */
const CATEGORY_ORDER = [
  'Smileys & People',
  'Animals & Nature',
  'Food & Drink',
  'Objects & Places',
  'Symbols & Flags',
]

/*
 * emojibase-data's own group numbering (from its meta/groups.json), not to be
 * confused with an arbitrary 0-based index: 2 = "component" (skin-tone/hair
 * modifiers, not real standalone emoji) and 9 = "flags".
 */
const GROUP_TO_TAB = {
  0: 'Smileys & People', // smileys-emotion
  1: 'Smileys & People', // people-body
  3: 'Animals & Nature',
  4: 'Food & Drink',
  5: 'Objects & Places', // travel-places
  6: 'Objects & Places', // activities
  7: 'Objects & Places', // objects
  8: 'Symbols & Flags', // symbols
  9: 'Symbols & Flags', // flags
}

/* Our registry stores bare codepoints (e.g. "2708"), while emojibase-data
   canonicalizes text-default symbols with an explicit VS16 (e.g. "2708 FE0F").
   Strip variation selectors on both sides before matching. */
const VARIATION_SELECTOR_CODEPOINTS = new Set([0xfe0e, 0xfe0f])

function stripVariationSelectors(value) {
  return Array.from(value)
    .filter((char) => !VARIATION_SELECTOR_CODEPOINTS.has(char.codePointAt(0)))
    .join('')
}

/* Discord-style aliases: github's preset matches Discord's own shortcode
   naming almost exactly (:thumbsup:, :grinning:, :pizza:); iamcal/joypixels
   contribute a few extra aliases people commonly type. */
const SHORTCODE_PRESETS = ['github', 'iamcal', 'joypixels']

function toArray(value) {
  if (Array.isArray(value)) return value
  return value ? [value] : []
}

function loadShortcodeMap() {
  const merged = new Map()

  for (const preset of SHORTCODE_PRESETS) {
    const presetPath = join(
      projectRoot, 'node_modules', 'emojibase-data', 'en', 'shortcodes', `${preset}.json`,
    )

    if (!existsSync(presetPath)) {
      continue
    }

    const presetData = JSON.parse(readFileSync(presetPath, 'utf8'))

    for (const [hexcode, names] of Object.entries(presetData)) {
      const existing = merged.get(hexcode) ?? []
      merged.set(hexcode, [...new Set([...existing, ...toArray(names)])])
    }
  }

  return merged
}

function buildEmojibaseIndex() {
  const dataPath = join(projectRoot, 'node_modules', 'emojibase-data', 'en', 'data.json')

  if (!existsSync(dataPath)) {
    fail('emojibase-data is not installed. Run: npm install --save-dev emojibase-data')
  }

  const entries = JSON.parse(readFileSync(dataPath, 'utf8'))
  const shortcodeMap = loadShortcodeMap()
  const index = new Map()

  /* Skin-tone variants are intentionally not indexed: our GIFs are
     skin-color-neutral and don't have per-tone assets. */
  for (const entry of entries) {
    index.set(stripVariationSelectors(entry.emoji), {
      group: entry.group,
      tags: entry.tags ?? [],
      shortcodes: shortcodeMap.get(entry.hexcode) ?? [],
    })
  }

  return index
}

function classifyRegistry() {
  const rows = parseRegistry()
  const emojibaseIndex = buildEmojibaseIndex()
  const classified = []
  const unmatched = []
  const noShortcode = []
  const tabCounts = {}

  for (const { emoji, code } of rows) {
    const entry = emojibaseIndex.get(stripVariationSelectors(emoji))
    const tab = entry ? GROUP_TO_TAB[entry.group] : undefined

    if (!tab) {
      unmatched.push(emoji)
      continue
    }

    if (entry.shortcodes.length === 0) {
      noShortcode.push(emoji)
    }

    classified.push({ emoji, code, category: tab, tags: entry.tags, shortcodes: entry.shortcodes })
    tabCounts[tab] = (tabCounts[tab] ?? 0) + 1
  }

  mkdirSync(emojiDir, { recursive: true })
  writeFileSync(categoriesPath, `${JSON.stringify(classified, null, 2)}\n`, 'utf8')

  const byCategory = CATEGORY_ORDER
    .map((category) => ({
      category,
      emojis: classified
        .filter((entry) => entry.category === category)
        .map(({ emoji, code, shortcodes }) => ({ emoji, code, shortcodes })),
    }))
    .filter((group) => group.emojis.length > 0)

  writeFileSync(byCategoryPath, `${JSON.stringify(byCategory, null, 2)}\n`, 'utf8')

  console.log(`Classified ${classified.length} of ${rows.length} emoji into ${categoriesPath}`)
  console.log(`Grouped ${classified.length} emoji into ${byCategory.length} categories in ${byCategoryPath}`)

  for (const [tab, count] of Object.entries(tabCounts)) {
    console.log(`  ${tab}: ${count}`)
  }

  if (unmatched.length > 0) {
    console.warn(`\n${unmatched.length} emoji had no emojibase match (not categorized):`)
    console.warn(unmatched.join(' '))
  }

  if (noShortcode.length > 0) {
    console.warn(`\n${noShortcode.length} categorized emoji had no :shortcode: name:`)
    console.warn(noShortcode.join(' '))
  }
}

/* x-emoji/ assets are named by alias (e.g. "rofl.gif") rather than emoji
   character. Invert emojibase-data's hexcode->shortcodes map into
   alias->emoji so a filename can be resolved to a real unicode emoji. */
function buildAliasIndex() {
  const dataPath = join(projectRoot, 'node_modules', 'emojibase-data', 'en', 'data.json')

  if (!existsSync(dataPath)) {
    fail('emojibase-data is not installed. Run: npm install --save-dev emojibase-data')
  }

  const entries = JSON.parse(readFileSync(dataPath, 'utf8'))
  const shortcodeMap = loadShortcodeMap()
  const index = new Map()

  for (const entry of entries) {
    if (entry.group === 2) {
      continue
    }

    for (const alias of shortcodeMap.get(entry.hexcode) ?? []) {
      if (!index.has(alias)) {
        index.set(alias, entry.emoji)
      }
    }
  }

  return index
}

/* New x-emoji codes are allocated from the historic Shift-JIS-derived Cxx
   range, distinct from the sequential 000-BA1 range used by the original
   registry. */
function allocateXEmojiCode(existingCodes) {
  for (let value = 0xc00; value <= 0xfff; value += 1) {
    const code = value.toString(16).toUpperCase().padStart(3, '0')

    if (!existingCodes.has(code)) {
      existingCodes.add(code)
      return code
    }
  }

  fail('no free codes remaining in the Cxx range')
}

function importXEmoji() {
  if (!existsSync(xEmojiDir)) {
    console.log(`Nothing to import: ${xEmojiDir} does not exist`)
    return
  }

  const files = readdirSync(xEmojiDir).filter((file) => extname(file).toLowerCase() === '.gif')

  if (files.length === 0) {
    console.log(`Nothing to import: no gifs found in ${xEmojiDir}`)
    return
  }

  const aliasIndex = buildAliasIndex()
  const rows = parseRegistry()
  const existingCodes = new Set(rows.map((row) => row.code))

  const resolved = files.map((file) => {
    const alias = basename(file, '.gif')
    const emoji = aliasIndex.get(alias)

    if (!emoji) {
      fail(`no emoji found for alias "${alias}" (from ${file}) in the github/iamcal/joypixels shortcode presets`)
    }

    return { file, alias, emoji }
  })

  const plan = resolved.map(({ file, alias, emoji }) => {
    const existingIndex = rows.findIndex((row) => row.emoji === emoji)
    const code = existingIndex === -1 ? allocateXEmojiCode(existingCodes) : rows[existingIndex].code
    return { file, alias, emoji, code, replace: existingIndex !== -1, existingIndex }
  })

  for (const { emoji, code, replace, existingIndex } of plan) {
    if (replace) {
      rows[existingIndex] = { emoji, code }
    } else {
      rows.push({ emoji, code })
    }
  }

  writeRegistry(rows)

  for (const { file, alias, emoji, code, replace } of plan) {
    mkdirSync(emojiDir, { recursive: true })
    copyFileSync(join(xEmojiDir, file), join(emojiDir, `${code}.gif`))
    console.log(`${replace ? 'Replaced' : 'Imported'} ${alias} -> ${emoji},${code}`)
  }

  classifyRegistry()
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

  case 'classify':
    classifyRegistry()
    break

  case 'import':
    importXEmoji()
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
