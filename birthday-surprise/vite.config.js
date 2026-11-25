import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: [
    '**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.webp', '**/*.gif', '**/*.avif', '**/*.bmp',
    '**/*.JPG', '**/*.JPEG', '**/*.PNG', '**/*.WEBP', '**/*.GIF', '**/*.AVIF', '**/*.BMP',
    '**/*.mp4', '**/*.mov', '**/*.webm', '**/*.m4v',
    '**/*.MP4', '**/*.MOV', '**/*.WEBM', '**/*.M4V',
    '**/*.mp3', '**/*.wav', '**/*.ogg', '**/*.m4a',
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          'react-three': ['@react-three/fiber', '@react-three/drei'],
          gsap: ['gsap'],
          'framer-motion': ['framer-motion'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei', 'gsap', 'framer-motion'],
  },
})
