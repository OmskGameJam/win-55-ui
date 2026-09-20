import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { win55uiDevWarnings } from './plugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), win55uiDevWarnings()],
  server: {
    watch: {
      ignored: ['**/*.pdnSave'],
    },
  },
})
