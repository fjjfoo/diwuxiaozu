import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 强制指向项目安装的 tslib
      tslib: path.resolve(__dirname, 'node_modules/tslib/tslib.es6.js'),
    },
  },
  // 可选：禁用 HMR 错误覆盖层（临时规避）
  server: {
    hmr: {
      overlay: false,
    },
    // 配置代理，将/api请求转发到后端服务器
    proxy: {
      '/api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
    },
  },
});