import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { win55uiDevWarnings, win55uiPreloadManifest } from './plugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), win55uiPreloadManifest(), win55uiDevWarnings()],
  server: {
    watch: {
      ignored: ['**/*.pdnSave'],
    },
  },
})
