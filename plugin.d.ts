import type { Plugin } from 'vite'

/**
 * Vite plugin that serves win-55-ui assets.
 * In dev mode, intercepts /win-55-ui/ requests and serves files from the package.
 * In build mode, emits asset files into the output directory.
 */
export declare function win55ui(): Plugin
