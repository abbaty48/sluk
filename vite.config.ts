import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    strictPort: true,
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    proxy: {
      '/api': {
        secure: false,
        changeOrigin: true,
        target: 'http://localhost:8000',
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      }
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
