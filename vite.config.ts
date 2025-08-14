/// <reference types="node" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/sat-bridge-pro/',
  build: {
    outDir: 'build', // <-- genera directamente en build/
    emptyOutDir: true, // limpia build antes de compilar
  },
})
