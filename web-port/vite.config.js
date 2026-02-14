import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync, copyFileSync } from 'fs'
import { resolve } from 'path'

// https://vite.dev/config/
// Base path configured for GitHub Pages deployment
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'configure-github-pages',
      closeBundle() {
        const outDir = resolve(__dirname, 'dist')
        // Create .nojekyll to prevent GitHub Pages from ignoring files starting with _
        writeFileSync(resolve(outDir, '.nojekyll'), '')
        console.log('✓ Created .nojekyll file')

        try {
          // Create 404.html for client-side routing fallback
          copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'))
          console.log('✓ Created 404.html fallback')
        } catch (e) {
          console.error('Error creating 404.html:', e)
        }
      }
    }
  ],
  base: '/afterwod/',
})
