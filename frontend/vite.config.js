import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env files so we can proxy API calls in dev.
  // We load all env vars (not only VITE_) because Vite config runs in Node.
  const env = loadEnv(mode, process.cwd(), '')

  // Backend can be a full URL with a path (e.g. Apache-served Laravel public folder).
  const backendOrigin = env.VITE_BACKEND_ORIGIN || 'http://127.0.0.1:8000'
  const backendUrl = new URL(backendOrigin)
  const backendBasePath = backendUrl.pathname.replace(/\/$/, '')

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5172,
      strictPort: true,
      proxy: {
        '/api': {
          target: backendUrl.origin,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => `${backendBasePath}${path}`,
        },
      },
    },
  }
})
