import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt', // Automatically updates the app when you push new code to Vercel
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'TRAIL MATH',
        short_name: 'Trail Math',
        description: 'The definitive eMTB comparison tool and database.',
        theme_color: '#0B1121',
        background_color: '#0B1121',
        display: 'standalone', // This is the magic word that hides the Safari/Chrome URL bar!
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})