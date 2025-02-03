import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  build: {
    outDir: 'build',
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false,
      },
      manifest: {
        name: 'iBOS',
        short_name: 'iBOS',
        description: 'iBOS',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/logo192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/logo512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        maximumFileSizeToCacheInBytes: Number.MAX_SAFE_INTEGER, // Set a very high value
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  assetsInclude: ['**/*.PNG'],
});
