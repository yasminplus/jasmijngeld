/// <reference types="vitest/config" />
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
      }),
      react(), 
      tailwindcss(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/tests/setup.ts'],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    preview: {
      port: 8084,
      strictPort: true,
    },
    server: {
      port: 8084,
      strictPort: true,
      host: true,
      origin: "http://0.0.0.0:8084",
    },
    build: {
      outDir: env.VITE_OUT_DIR || 'dist',
      emptyOutDir: true
    }
  }
})
