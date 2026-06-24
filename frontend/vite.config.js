import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
 
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.JPG'],
  server: {
    port: 5173,
    host: '0.0.0.0',
    allowedHosts: ['all', 'pyromania-overpay-extended.ngrok-free.dev','https://vacations-sessions-kent-turning.trycloudflare.com'],
    proxy: {
      '/api': {
        // Si se usa Docker Compose para levantar frontend y backend,
        // apuntar al nombre del servicio: 'http://backend:8000'
        target: 'http://backend:8000',
        changeOrigin: true,
      },
      '/media': {
        target: 'http://backend:8000',
        changeOrigin: true,
      }
    }
  }
})

