import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,      // 👈 mobile / network access allow
    port: 5172,      // 👈 tumhara current port
    proxy: {
      // Laravel is currently served by Apache under this sub-path.
      // Proxying keeps frontend calls same-origin (no CORS) and avoids
      // accidentally hitting the Vite dev server for API routes.
      '/api': {
        target: 'http://127.0.0.1',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => `/ultra-hustle/bcakend_api/public${path}`,
      },
      // URLs returned by Laravel's public disk are usually like `/storage/...`
      '/storage': {
        target: 'http://127.0.0.1',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => `/ultra-hustle/bcakend_api/public${path}`,
      },
    },
  }
})
