export function drawAngledBayerDitherGradient(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  colorHex1: string,
  colorHex2: string,
  offsetPx: number
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const blockSize = 2;

  // 8x8 Bayer matrix (0–63)
  const bayer8 = [
    [0, 48, 12, 60, 3, 51, 15, 63],
    [32, 16, 44, 28, 35, 19, 47, 31],
    [8, 56, 4, 52, 11, 59, 7, 55],
    [40, 24, 36, 20, 43, 27, 39, 23],
    [2, 50, 14, 62, 1, 49, 13, 61],
    [34, 18, 46, 30, 33, 17, 45, 29],
    [10, 58, 6, 54, 9, 57, 5, 53],
    [42, 26, 38, 22, 41, 25, 37, 21]
  ];

  const color1 = hexToRgb(colorHex1);
  const color2 = hexToRgb(colorHex2);

  const blocksX = Math.floor(width / blockSize);
  const blocksY = Math.floor(height / blockSize);

  for (let by = 0; by < blocksY; by++) {
    for (let bx = 0; bx < blocksX; bx++) {

      const px = bx * blockSize;
      const py = by * blockSize;

      // 45° gradient
      const gradient = (bx + by) / (blocksX + blocksY - 6);

      // Clamp edges so leftmost is fully color1 and rightmost fully color2
      // if (bx === 0) gradient = 0;
      // if (bx === blocksX - 1) gradient = 1;

      const threshold = (bayer8[by % 8][bx % 8] + 0.5) / 64;

      const t = gradient > threshold ? 1 : 0;

      const r = Math.round(color1.r * (1 - t) + color2.r * t);
      const g = Math.round(color1.g * (1 - t) + color2.g * t);
      const b = Math.round(color1.b * (1 - t) + color2.b * t);

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(px, py, blockSize, blockSize);
    }
  }
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(normalized, 16);

  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}
