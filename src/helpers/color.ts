export function parseHexPalette(hexColors: readonly string[]): [number, number, number][] {
  return hexColors.map((hex) => {
    const n = parseInt(hex.replace(/^#/, ''), 16)
    return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]
  })
}

export function findNearestColor(
  r: number,
  g: number,
  b: number,
  palette: readonly [number, number, number][],
): [number, number, number] {
  let minDist = Infinity
  let nearest: [number, number, number] = [0, 0, 0]

  for (const color of palette) {
    const dr = r - color[0]
    const dg = g - color[1]
    const db = b - color[2]
    const dist = dr * dr + dg * dg + db * db

    if (dist < minDist) {
      minDist = dist
      nearest = color
    }
  }

  return nearest
}
