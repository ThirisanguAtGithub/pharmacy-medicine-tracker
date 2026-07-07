import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Requests to /api are proxied to the .NET API, so the UI code
// never hardcodes the backend URL.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
