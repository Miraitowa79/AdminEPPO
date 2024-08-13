import react from '@vitejs/plugin-react';
import svgr from "vite-plugin-svgr";

export default {
  plugins: [react(), svgr()],
  resolve: {
    alias: [
      { find: '@src', replacement: '/src' },
      { find: '@routes', replacement: '/src/routes' },
      { find: '@components', replacement: '/src/components' },
      { find: '@pages', replacement: '/src/pages' },
      { find: '@layouts', replacement: '/src/layouts' },
      { find: '@constants', replacement: '/src/constants' },
      { find: '@assets', replacement: '/src/assets' },
      { find: '@utils', replacement: '/src/utils' },
    ],
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: "dist",
    minify: true,
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    chunkSizeWarningLimit: 1000,
  },
};