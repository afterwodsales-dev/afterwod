import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

// https://vite.dev/config/
// Base path configured for GitHub Pages deployment
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'create-nojekyll',
      closeBundle() {
        const outDir = resolve(__dirname, 'dist')
        writeFileSync(resolve(outDir, '.nojekyll'), '')
        console.log('✓ Created .nojekyll file for GitHub Pages')
      }
    }
  ],
  base: '/afterwod/',
})
