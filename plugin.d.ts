import type { Plugin } from 'vite'

/**
 * Vite plugin that serves win-55-ui assets.
 * In dev mode, intercepts /win-55-ui/ requests and serves files from the package.
 * In build mode, emits asset files into the output directory.
 * In dev mode, also injects the native-scrollbar and off-grid warnings.
 */
export declare function win55ui(): Plugin[]

/**
 * Vite plugin that injects dev-only warnings: native (non-Box) scrollbars flash
 * red, and elements off the 2px grid get side-specific outlines (red = bad
 * position, blue = bad size, yellow = both; horizontal on left/right, vertical
 * on top/bottom). Holding Shift freezes the pulse at full visibility; pressing
 * Ctrl clears accumulated warnings.
 * Active only while the dev server is running.
 */
export declare function win55uiDevWarnings(): Plugin

/**
 * Vite plugin that generates `win-55-ui/assets.json` - every file under the
 * package's public directory, scanned at dev/build time - and serves it in dev.
 * The helper `useWin55Preload()` consumes it to preload the win-55-ui asset set.
 * Already included in `win55ui()`.
 */
export declare function win55uiPreloadManifest(): Plugin
