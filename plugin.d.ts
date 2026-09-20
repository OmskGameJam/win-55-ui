import type { Plugin } from 'vite'

/**
 * Vite plugin that serves win-55-ui assets.
 * In dev mode, intercepts /win-55-ui/ requests and serves files from the package.
 * In build mode, emits asset files into the output directory.
 * In dev mode, also injects the native-scrollbar warning stylesheet.
 */
export declare function win55ui(): Plugin[]

/**
 * Vite plugin that injects a stylesheet flashing native (non-Box) scrollbars red.
 * Active only while the dev server is running.
 */
export declare function win55uiDevWarnings(): Plugin
