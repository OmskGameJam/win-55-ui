import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerGlobalImageErrorHandler } from './helpers/imgErrors.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

registerGlobalImageErrorHandler((img) => {
  img.src = "/win-55-ui/icons/broken-image.png";
});