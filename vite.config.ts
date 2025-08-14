import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isGitHubPages = (import.meta.env.MODE === 'production')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: isGitHubPages ? '/sat-bridge-pro/' : '/',
})
