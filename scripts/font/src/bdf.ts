import type { BdfFont, BdfGlyph, BdfPropertyValue, Bbx } from './types.js'

function parsePropertyValue(raw: string): BdfPropertyValue {
  const trimmed = raw.trim()

  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1)
  }

  const n = Number(trimmed)

  return Number.isNaN(n) ? trimmed : n
}

function formatPropertyValue(value: BdfPropertyValue): string {
  return typeof value === 'string' ? `"${value}"` : String(value)
}

function parseInts(rest: string): number[] {
  return rest.trim().split(/\s+/).filter(Boolean).map(Number)
}

export function parseBdf(text: string): BdfFont {
  const lines = text.split(/\r?\n/)

  let fontXlfd = ''
  let pointSize = 0
  let xres = 0
  let yres = 0
  let fontBoundingBox: Bbx = { w: 0, h: 0, xoff: 0, yoff: 0 }
  const properties: Record<string, BdfPropertyValue> = {}
  const glyphs: BdfGlyph[] = []

  let inProperties = false
  let glyph: Partial<BdfGlyph> | null = null
  let bitmapRowsRemaining = 0

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (line === '' || line.startsWith('COMMENT')) continue

    if (glyph && bitmapRowsRemaining > 0) {
      const width = glyph.bbx!.w
      const bytesPerRow = Math.ceil(width / 8)
      const value = parseInt(line.padEnd(bytesPerRow * 2, '0'), 16)
      const row: number[] = []

      for (let x = 0; x < width; x++) {
        const bitIndex = bytesPerRow * 8 - 1 - x
        row.push((value >> bitIndex) & 1)
      }

      glyph.bitmap!.push(row)
      bitmapRowsRemaining--
      continue
    }

    const spaceIndex = line.indexOf(' ')
    const keyword = spaceIndex === -1 ? line : line.slice(0, spaceIndex)
    const rest = spaceIndex === -1 ? '' : line.slice(spaceIndex + 1)

    switch (keyword) {
      case 'STARTFONT':
        break
      case 'FONT':
        fontXlfd = rest
        break
      case 'SIZE': {
        const [p, x, y] = parseInts(rest)
        pointSize = p
        xres = x
        yres = y
        break
      }
      case 'FONTBOUNDINGBOX': {
        const [w, h, xoff, yoff] = parseInts(rest)
        fontBoundingBox = { w, h, xoff, yoff }
        break
      }
      case 'STARTPROPERTIES':
        inProperties = true
        break
      case 'ENDPROPERTIES':
        inProperties = false
        break
      case 'CHARS':
        break
      case 'STARTCHAR':
        glyph = { name: rest, bitmap: [] }
        break
      case 'ENCODING':
        glyph!.encoding = Number(rest.trim().split(/\s+/)[0])
        break
      case 'SWIDTH': {
        const [x, y] = parseInts(rest)
        glyph!.swidth = [x, y]
        break
      }
      case 'DWIDTH': {
        const [x, y] = parseInts(rest)
        glyph!.dwidth = [x, y]
        break
      }
      case 'BBX': {
        const [w, h, xoff, yoff] = parseInts(rest)
        glyph!.bbx = { w, h, xoff, yoff }
        break
      }
      case 'BITMAP':
        bitmapRowsRemaining = glyph!.bbx!.h
        break
      case 'ENDCHAR':
        glyphs.push(glyph as BdfGlyph)
        glyph = null
        break
      case 'ENDFONT':
        break
      default:
        if (inProperties) {
          properties[keyword] = parsePropertyValue(rest)
        }
        break
    }
  }

  return { fontXlfd, pointSize, xres, yres, fontBoundingBox, properties, glyphs }
}

function formatBbx({ w, h, xoff, yoff }: Bbx): string {
  return `${w} ${h} ${xoff} ${yoff}`
}

function formatBitmapRow(row: number[]): string {
  const bytesPerRow = Math.ceil(row.length / 8)
  let value = 0

  for (let x = 0; x < row.length; x++) {
    if (row[x]) {
      value |= 1 << (bytesPerRow * 8 - 1 - x)
    }
  }

  return value.toString(16).toUpperCase().padStart(bytesPerRow * 2, '0')
}

export function writeBdf(font: BdfFont): string {
  const lines: string[] = []

  lines.push('STARTFONT 2.1')
  lines.push(`FONT ${font.fontXlfd}`)
  lines.push(`SIZE ${font.pointSize} ${font.xres} ${font.yres}`)
  lines.push(`FONTBOUNDINGBOX ${formatBbx(font.fontBoundingBox)}`)

  const propertyKeys = Object.keys(font.properties)

  lines.push(`STARTPROPERTIES ${propertyKeys.length}`)
  for (const key of propertyKeys) {
    lines.push(`${key} ${formatPropertyValue(font.properties[key])}`)
  }
  lines.push('ENDPROPERTIES')

  lines.push(`CHARS ${font.glyphs.length}`)

  for (const glyph of font.glyphs) {
    lines.push(`STARTCHAR ${glyph.name}`)
    lines.push(`ENCODING ${glyph.encoding}`)
    lines.push(`SWIDTH ${glyph.swidth[0]} ${glyph.swidth[1]}`)
    lines.push(`DWIDTH ${glyph.dwidth[0]} ${glyph.dwidth[1]}`)
    lines.push(`BBX ${formatBbx(glyph.bbx)}`)
    lines.push('BITMAP')
    for (const row of glyph.bitmap) {
      lines.push(formatBitmapRow(row))
    }
    lines.push('ENDCHAR')
  }

  lines.push('ENDFONT')

  return lines.join('\n') + '\n'
}
