import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { isAbsolute, resolve } from 'node:path'
import { emitKeypressEvents } from 'node:readline'
import type { Key } from 'node:readline'
import { parseArgs } from './cli-args.js'
import { parseBdf, writeBdf } from './bdf.js'
import { srcFontDir } from './paths.js'
import { rebuildFacesForBdf } from './facePipeline.js'
import type { BdfFont, BdfGlyph } from './types.js'

function usage(exitCode = 0): never {
  const output = [
    'Usage: npm run charedit -- <bdf-file> [glyph]',
    '  bdf-file: resolved against src-font/ unless absolute or starting with "."/".."',
    '  glyph: STARTCHAR name, "U+XXXX"/"0xXXXX" codepoint, decimal codepoint, or a single character',
    '  omit it to start at the first glyph in the file',
    '',
    'Keys:',
    '  arrows        move cursor',
    '  space         toggle pixel',
    '  [ / pageup    previous glyph',
    '  ] / pagedown  next glyph',
    '  g             jump to a glyph by name/codepoint/character',
    '  s             save',
    '  q / esc       quit (asks to save first if there are unsaved changes)',
    '',
    'Bitmap editing only - everything else (BBX, DWIDTH, properties, ...) is plain text, edit the .bdf directly.',
    '',
    'On exit, if you saved at least once, every fonts.json face that references this BDF (as its',
    'strikeBdf, a fallbackBdf, or its mergePath) gets re-merged (if needed) + rebuilt + republished to',
    'public/win-55-ui/font/, always overwriting. If `npm run dev` is running, Vite auto-reloads on that',
    'change since it watches public/ - no separate refresh step.',
  ].join('\n')

  if (exitCode === 0) console.log(output)
  else console.error(output)
  process.exit(exitCode)
}

function fail(message: string): never {
  console.error(`charedit: ${message}`)
  process.exit(1)
}

/** Matches a STARTCHAR name, "U+XXXX"/"0xXXXX", a decimal codepoint, or a single literal character. */
export function findGlyphIndex(font: BdfFont, query: string): number {
  const byName = font.glyphs.findIndex((g) => g.name === query)
  if (byName !== -1) return byName

  const hexMatch = query.match(/^(?:U\+|0x)([0-9a-fA-F]+)$/)
  if (hexMatch) {
    const codepoint = parseInt(hexMatch[1], 16)
    const byHex = font.glyphs.findIndex((g) => g.encoding === codepoint)
    if (byHex !== -1) return byHex
  }

  if (/^\d+$/.test(query)) {
    const codepoint = Number(query)
    const byDecimal = font.glyphs.findIndex((g) => g.encoding === codepoint)
    if (byDecimal !== -1) return byDecimal
  }

  if ([...query].length === 1) {
    const codepoint = query.codePointAt(0)!
    const byChar = font.glyphs.findIndex((g) => g.encoding === codepoint)
    if (byChar !== -1) return byChar
  }

  return -1
}

export function toggleBit(glyph: BdfGlyph, x: number, y: number): void {
  glyph.bitmap[y][x] = glyph.bitmap[y][x] ? 0 : 1
}

export function wrapIndex(index: number, count: number): number {
  return ((index % count) + count) % count
}

function previewChar(codepoint: number): string {
  if (codepoint < 0x20 || (codepoint >= 0x7f && codepoint <= 0x9f)) return ''
  if (codepoint >= 0xd800 && codepoint <= 0xdfff) return ''
  try {
    return String.fromCodePoint(codepoint)
  } catch {
    return ''
  }
}

export function renderGrid(glyph: BdfGlyph, cursorX: number, cursorY: number): string[] {
  const { w, h } = glyph.bbx
  const border = `+${'--'.repeat(w)}+`
  const lines: string[] = [border]

  for (let y = 0; y < h; y++) {
    let row = '|'
    for (let x = 0; x < w; x++) {
      const ink = glyph.bitmap[y][x] === 1
      const cell = ink ? '##' : '..'
      row += x === cursorX && y === cursorY ? `\x1b[7m${cell}\x1b[27m` : cell
    }
    row += '|'
    lines.push(row)
  }

  lines.push(border)
  return lines
}

type Mode = 'edit' | 'jump' | 'confirm-quit'

interface EditorState {
  font: BdfFont
  glyphIndex: number
  cursorX: number
  cursorY: number
  dirty: boolean
  mode: Mode
  promptBuffer: string
  message: string
}

function render(state: EditorState, bdfPath: string): void {
  const glyph = state.font.glyphs[state.glyphIndex]
  const cp = glyph.encoding
  const cpLabel = cp >= 0 ? `U+${cp.toString(16).toUpperCase().padStart(4, '0')} (${cp})` : 'unencoded'
  const preview = cp >= 0 ? previewChar(cp) : ''

  const lines: string[] = []
  lines.push(`charedit - ${bdfPath}`)
  lines.push(
    `glyph ${state.glyphIndex + 1}/${state.font.glyphs.length}: "${glyph.name}"  ${cpLabel}` +
      `${preview ? `  '${preview}'` : ''}${state.dirty ? '  [modified]' : ''}`,
  )
  lines.push(`bbx: ${glyph.bbx.w}x${glyph.bbx.h}  offset: ${glyph.bbx.xoff},${glyph.bbx.yoff}  dwidth: ${glyph.dwidth[0]},${glyph.dwidth[1]}`)
  lines.push('')
  lines.push(...renderGrid(glyph, state.cursorX, state.cursorY))
  lines.push('')

  if (state.mode === 'jump') {
    lines.push(`jump to glyph (name / U+XXXX / char), enter to confirm, esc to cancel: ${state.promptBuffer}`)
  } else if (state.mode === 'confirm-quit') {
    lines.push('unsaved changes - save before quitting? (y/n, esc to cancel)')
  } else {
    lines.push(state.message || ' ')
  }

  lines.push('')
  lines.push('arrows: move   space: toggle pixel   [ / pageup: prev glyph   ] / pagedown: next glyph')
  lines.push('g: jump to glyph   s: save   q / esc: quit')

  process.stdout.write(`\x1b[2J\x1b[H${lines.join('\n')}\n`)
}

function main(): void {
  const argv = process.argv.slice(2)
  if (argv.length === 0 || argv[0] === '-h' || argv[0] === '--help') usage(0)

  const { positional } = parseArgs(argv)
  const [bdfPathArg, glyphQuery] = positional
  if (!bdfPathArg) usage(1)

  const bdfPath = isAbsolute(bdfPathArg) ? resolve(bdfPathArg) : resolve(srcFontDir, bdfPathArg)
  if (!existsSync(bdfPath)) fail(`file not found: ${bdfPath}`)

  const font = parseBdf(readFileSync(bdfPath, 'utf8'))
  if (font.glyphs.length === 0) fail('BDF has no glyphs')

  let glyphIndex = 0
  if (glyphQuery) {
    const found = findGlyphIndex(font, glyphQuery)
    if (found === -1) fail(`glyph not found: ${glyphQuery}`)
    glyphIndex = found
  }

  if (!process.stdin.isTTY) fail('charedit needs an interactive terminal (stdin is not a TTY)')

  const state: EditorState = { font, glyphIndex, cursorX: 0, cursorY: 0, dirty: false, mode: 'edit', promptBuffer: '', message: '' }
  // Unlike state.dirty (flips back false right after a save), this never resets - it's what cleanup() checks to decide whether to re-run the pipeline.
  let savedDuringSession = false

  function cleanup(code: number): never {
    process.stdout.write('\x1b[?25h\n')
    process.stdin.setRawMode(false)
    process.stdin.pause()

    if (savedDuringSession) {
      console.log(`\ncharedit: rebuilding fonts that reference ${bdfPath} ...`)
      const results = rebuildFacesForBdf(bdfPath)

      if (results.length === 0) {
        console.log('charedit: no fonts.json face references this BDF - nothing to rebuild')
      } else {
        for (const result of results) {
          for (const line of result.log) console.log(`charedit: ${line}`)
        }
      }
    }

    process.exit(code)
  }

  function save(): void {
    writeFileSync(bdfPath, writeBdf(state.font), 'utf8')
    try {
      parseBdf(readFileSync(bdfPath, 'utf8')) // sanity round-trip before declaring success
      state.dirty = false
      savedDuringSession = true
      state.message = `saved to ${bdfPath}`
    } catch (e) {
      state.message = `WARNING: wrote file but round-trip check failed: ${(e as Error).message}`
    }
  }

  function switchGlyph(delta: number): void {
    state.glyphIndex = wrapIndex(state.glyphIndex + delta, state.font.glyphs.length)
    state.cursorX = 0
    state.cursorY = 0
    state.message = ''
  }

  function jumpTo(index: number): void {
    state.glyphIndex = index
    state.cursorX = 0
    state.cursorY = 0
  }

  emitKeypressEvents(process.stdin)
  process.stdin.setRawMode(true)
  process.stdout.write('\x1b[?25l') // hide the real cursor, we draw our own

  process.stdin.on('keypress', (str: string, key: Key | undefined) => {
    if (!key) return
    const lower = typeof str === 'string' ? str.toLowerCase() : ''

    if (state.mode === 'confirm-quit') {
      if (lower === 'y') {
        save()
        cleanup(0)
      } else if (lower === 'n') {
        cleanup(0)
      } else if (key.name === 'escape') {
        state.mode = 'edit'
        state.message = ''
      }
      render(state, bdfPath)
      return
    }

    if (state.mode === 'jump') {
      if (key.name === 'return') {
        const found = findGlyphIndex(state.font, state.promptBuffer.trim())
        if (found === -1) {
          state.message = `glyph not found: ${state.promptBuffer}`
        } else {
          jumpTo(found)
          state.message = ''
        }
        state.mode = 'edit'
        state.promptBuffer = ''
      } else if (key.name === 'escape') {
        state.mode = 'edit'
        state.promptBuffer = ''
      } else if (key.name === 'backspace') {
        state.promptBuffer = state.promptBuffer.slice(0, -1)
      } else if (!key.ctrl && !key.meta && str && str.length === 1 && str.charCodeAt(0) >= 0x20) {
        state.promptBuffer += str
      }
      render(state, bdfPath)
      return
    }

    // edit mode
    const glyph = state.font.glyphs[state.glyphIndex]
    const { w, h } = glyph.bbx

    if (key.ctrl && key.name === 'c') {
      if (state.dirty) state.mode = 'confirm-quit'
      else cleanup(0)
    } else if (lower === 'q' || key.name === 'escape') {
      if (state.dirty) state.mode = 'confirm-quit'
      else cleanup(0)
    } else if (key.name === 'up') {
      if (h > 0) state.cursorY = wrapIndex(state.cursorY - 1, h)
    } else if (key.name === 'down') {
      if (h > 0) state.cursorY = wrapIndex(state.cursorY + 1, h)
    } else if (key.name === 'left') {
      if (w > 0) state.cursorX = wrapIndex(state.cursorX - 1, w)
    } else if (key.name === 'right') {
      if (w > 0) state.cursorX = wrapIndex(state.cursorX + 1, w)
    } else if (key.name === 'space') {
      if (w > 0 && h > 0) {
        toggleBit(glyph, state.cursorX, state.cursorY)
        state.dirty = true
        state.message = ''
      }
    } else if (lower === 's') {
      save()
    } else if (key.name === 'pageup' || str === '[') {
      switchGlyph(-1)
    } else if (key.name === 'pagedown' || str === ']') {
      switchGlyph(1)
    } else if (lower === 'g') {
      state.mode = 'jump'
      state.promptBuffer = ''
    }

    render(state, bdfPath)
  })

  render(state, bdfPath)
}

main()
