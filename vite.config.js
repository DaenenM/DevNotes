import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // The site is served from https://daenenm.github.io/DevNotes/, so asset
  // links need that prefix. Locally `npm run dev` ignores this.
  base: '/DevNotes/',
  plugins: [react(), tailwindcss()],
})
