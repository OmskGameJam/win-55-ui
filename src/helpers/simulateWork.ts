/** Stand-in for non-Vue work that receives a cursor tracking callback. */
export function simulateWork(track: (promise: Promise<unknown>) => void, ms: number): void {
  track(new Promise((resolve) => setTimeout(resolve, ms)))
}
