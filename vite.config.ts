import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Permite acceso desde subdominios (multi-tenant)
    hmr: {
      protocol: 'ws',
      host: 'localhost', // WebSocket usa localhost directamente
      port: 5173,
      clientPort: 5173
    }
  }
})
