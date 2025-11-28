import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'; // Import the VitePWA plugin
// const API_URL = import.meta.env.VITE_API_URL;

// Add the PWA plugin configuration here
const configPWA = { 
    registerType: 'autoUpdate',
    devOptions: {
      enabled: true // Essential for testing on localhost
    },
    manifest: {
      name: 'PaikarSoft EPS',
      short_name: 'EPS-(Electronic Prescription Sysem)',
      description: 'Electronic Prescription System Developed By PaikarSoft.',
      theme_color: '#0084d1',
      background_color: '#0084d1',
      display: 'standalone',
      start_url: '/',
      icons: [
        { 
          src: '/pwa-512x512.svg',
          sizes: '512x512',
          type: 'image/svg',
        }
      ]
    }
}
// Adjust API base URL as per your backend
export default defineConfig({
  plugins: [ tailwindcss(), react(), VitePWA(configPWA) ],
  server: {
    host: true,
    port: 5555,
    // proxy: {
    //   '/api': {
    //     // target: API_URL, // Express backend
    //     // target: 'http://192.168.0.112:4050', // Express backend
    //     changeOrigin: true,
    //     secure: false,
    //   }
    // }
  }
})
