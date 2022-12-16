// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import crossOriginIsolation from 'vite-plugin-cross-origin-isolation'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
    crossOriginIsolation(),
    {
      name: 'inject',
      transformIndexHtml() {
        return [
          {
            tag: 'script',
            attrs: { type: 'module', src: '/07-oracle-zkApp/coiServiceWorker.js' },
          },
        ];
      },
    },
  ],
  define: { 'process.env': {cookieName:"zkAppUserAddress"} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  build: { target: "es2020" },
  optimizeDeps: {
    esbuildOptions: { target: "es2020", supported: { bigint: true } },
  },
  server: {
    port: 3000,
  },
})
