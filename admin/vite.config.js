import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
  },
  preview: {
    allowedHosts: [
      'central-jovem-production-741e.up.railway.app',
      'localhost',
    ],
  }
})
