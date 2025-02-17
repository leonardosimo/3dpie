import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    cors: true, // Permite CORS para todos los orígenes
  },
  build: {
    // Ajustes para producción
    target: 'esnext',
    sourcemap: true, // Solo para debug en producción (opcional)
  },
})
