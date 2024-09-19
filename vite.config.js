import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig as defineVitestConfig } from 'vitest/config'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: defineVitestConfig({
    globals: true,
    environment: 'jsdom',
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  }),
})
