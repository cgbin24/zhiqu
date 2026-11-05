import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  build: {
    chunkSizeWarningLimit: 4096,
    rollupOptions: {
      output: {
        /**
         * 函数式 manualChunks：
         * - vite/preload-helper 必须单独成 chunk —— 否则它会与 monaco 合并，
         *   导致 entry 静态引用 3.3MB 的 monaco（首屏强制下载编辑器引擎）
         * - monaco / vendor / fx 按包隔离，随路由懒加载
         */
        manualChunks(id) {
          if (id.includes('vite/preload-helper')) return 'preload-helper';
          if (id.includes('node_modules/monaco-editor') || id.includes('node_modules/@monaco-editor')) return 'monaco';
          if (
            id.includes('node_modules/react') || id.includes('node_modules/scheduler') ||
            id.includes('node_modules/use-sync-external-store') || id.includes('node_modules/zustand')
          ) {
            return 'vendor';
          }
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/canvas-confetti') || id.includes('node_modules/lucide-react')) {
            return 'fx';
          }
        },
      },
    },
  },
});
