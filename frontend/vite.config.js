import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
 
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.JPG'],
  server: {
    port: 5173,
    host: '0.0.0.0',
    allowedHosts: ['all', 'pyromania-overpay-extended.ngrok-free.dev','backend-337307900667.southamerica-west1.run.app'],
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

