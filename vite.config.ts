import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isGitHubPages = import.meta.env.NODE_ENV === 'production'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: isGitHubPages ? '/sat-bridge-pro/' : '/',
})
