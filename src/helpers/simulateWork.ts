/**
 * Deliberately has no Vue import at all - stands in for arbitrary non-Vue logic (a plain class, an
 * API client, anything) that a descendant hands a CursorContextApi callback off to. Proves
 * addBusy/addProgress (see cursorContext.ts) are ordinary functions that work when called from
 * anywhere, not something that has to stay inside a component's setup().
 */
export function simulateWork(track: (promise: Promise<unknown>) => void, ms: number): void {
  track(new Promise((resolve) => setTimeout(resolve, ms)))
}
