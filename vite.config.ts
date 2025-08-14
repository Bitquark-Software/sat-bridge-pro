/// <reference types="node" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isLocalDevelopment = process.env.NODE_ENV === 'local'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: isLocalDevelopment ? '/' : '/sat-bridge-pro/',
})
