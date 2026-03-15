import { createApp } from 'vue'
import './index.css'
import './scrollbar.css'
import App from './App.vue'
import { registerGlobalImageErrorHandler } from './helpers/imgErrors.ts'

createApp(App).mount('#root')

registerGlobalImageErrorHandler((img) => {
  img.src = "/win-55-ui/icons/broken-image.png";
})
