import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // 🔥 Yahan 'plugin-react' hona chahiye!
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
