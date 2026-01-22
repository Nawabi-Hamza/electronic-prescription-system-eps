import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['faveicon.ico'],
      manifest: {
        id: '/', 
        name: 'Paikar Electronic Prescription System',
        short_name: 'Paikar (EPS)',
        description: 'Electronic Prescription System Developed By PaikarSoft.',
        theme_color: '#0084d1',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '.',
        icons: [
          {
            src: '/heart-plus.svg',
            sizes: 'any',
            type: 'image/svg+xml', 
            purpose: 'any'
          },
          {
            src: '/logo-192x192.png', // Mandatory PNG for installation
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo-512x512.png', // Mandatory PNG for installation
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    host: true,
    port: 5000,
  }
})
