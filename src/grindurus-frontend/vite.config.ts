import react from '@vitejs/plugin-react'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import environment from 'vite-plugin-environment'

dotenv.config({ path: '../../.env' })

// Resolve ESM-friendly __dirname
const __dirnameResolved = path.dirname(fileURLToPath(new URL(import.meta.url)))

export default defineConfig({
  // Ensure Vite treats this package directory as the root
  root: __dirnameResolved,
  build: {
    emptyOutDir: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4943',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    environment('all', { prefix: 'CANISTER_' }),
    environment('all', { prefix: 'DFX_' }),
  ],
  resolve: {
    alias: [
      {
        find: 'declarations',
        replacement: fileURLToPath(new URL('../declarations', import.meta.url)),
      },
      {
        find: '@',
        // Use resolved dir to avoid relying on CommonJS __dirname
        replacement: path.resolve(__dirnameResolved, 'src'),
      },
    ],
    dedupe: ['@dfinity/agent'],
  },
})
