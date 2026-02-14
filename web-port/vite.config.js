import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Base path configured for GitHub Pages deployment
export default defineConfig({
  plugins: [react()],
  base: '/',
})
