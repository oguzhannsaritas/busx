import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    server: {
        proxy: {
            '/api': { target: 'http://localhost:5174', changeOrigin: true },
        },
    },
    test: {
        environment: 'jsdom',
        setupFiles: 'src/test/setup.ts',
        globals: true,
        css: true,
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
        include: ['src/test/**/*.{test,spec}.{ts,tsx}'],
    },
})
