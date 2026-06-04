import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: false,
    proxy: {
      '/auth':        'http://localhost:3001',
      '/aeronaves':   'http://localhost:3001',
      '/funcionarios':'http://localhost:3001',
      '/health':      'http://localhost:3001',
    },
  },
})
