import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: process.env.VERCEL === '1' ? '/' : '/hearwise-child-health/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
              networkTimeoutSeconds: 10,
            }
          }
        ]
      },
      manifest: {
        name: 'HearWise — School Hearing Screening',
        short_name: 'HearWise',
        description: 'India\'s first mobile school hearing screening platform. Gamified ocean-themed hearing tests for children.',
        theme_color: '#0d2137',
        background_color: '#000b1d',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone', 'browser'],
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        id: '/',
        icons: [
          { src: 'pwa-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'pwa-512x512.svg', sizes: '512x512', type: 'image/svg+xml' },
          { src: 'pwa-512x512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' }
        ],
        categories: ['health', 'education', 'medical'],
        lang: 'en',
        screenshots: [
          {
            src: 'pwa-screenshot-landing.png',
            sizes: '1200x2029',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'HearWise Landing Page'
          },
          {
            src: 'pwa-screenshot-login.png',
            sizes: '1200x2029',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'HearWise Login'
          },
          {
            src: 'pwa-screenshot-about.png',
            sizes: '1200x2029',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'About HearWise'
          }
        ],
        shortcuts: [
          {
            name: 'Take a Hearing Test',
            short_name: 'Test',
            description: 'Start a new hearing screening session',
            url: '/setup',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'Dashboard',
            short_name: 'Dashboard',
            description: 'View screening analytics and reports',
            url: '/admin',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }]
          }
        ]
      },
      devOptions: { enabled: true }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['framer-motion', 'lucide-react'],
          charts: ['recharts'],
        }
      }
    }
  }
})