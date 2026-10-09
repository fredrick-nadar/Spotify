import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Same-origin API access in development keeps the session cookie SameSite=Strict.
    proxy: { '/api': 'http://localhost:4000' },
  },
})
