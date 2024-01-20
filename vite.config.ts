import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://43.138.70.109:8010',
        changeOrigin: true,
      },
      '/my': {
        target: 'http://43.138.70.109:8010',
        changeOrigin: true,
      },
    },
  },
  // 静态资源路径以./开头
  base: './',
})

