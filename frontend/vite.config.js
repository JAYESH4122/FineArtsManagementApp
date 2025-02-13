import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from '@rollup/plugin-commonjs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),],
  build: {
    outDir: 'build', // Custom output folder
    rollupOptions: {
      external: ['@mui/material/Unstable_Grid2'], // Add this line
    },
    optimizeDeps: {
      include: ["@mui/material/Unstable_Grid2"],
    },
    
  },
  server: {
    proxy: {
      '/': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})