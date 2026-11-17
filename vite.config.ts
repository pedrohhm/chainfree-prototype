import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'

// Plugin to inject mobile viewport meta tags
const mobileViewportPlugin = (): Plugin => ({
  name: 'mobile-viewport-meta',
  transformIndexHtml(html) {
    return html.replace(
      '</head>',
      `  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="theme-color" content="#8B5CF6">
</head>`
    )
  }
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'API_PORT')
  const authTarget = `http://127.0.0.1:${process.env.API_PORT || env.API_PORT || 3001}`

  return {
    plugins: [
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
      mobileViewportPlugin(),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(__dirname, './src'),
      },
    },

    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ['**/*.svg', '**/*.csv'],
    server: {
      proxy: { '/api/auth': authTarget },
    },
  }
})
