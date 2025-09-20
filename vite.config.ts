import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      strict: false
    },
  },
  build: {
    assetsInlineLimit: 0,
  },
  assetsInclude: ['**/*.pdf'],
})
