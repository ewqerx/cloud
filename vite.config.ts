import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'

/**
 * Preloads the Latin Open Sans file so the wordmark renders in the right font
 * on first paint instead of swapping (and shifting) after the CSS is parsed.
 */
function preloadFont(pattern: RegExp): Plugin {
  return {
    name: 'preload-font',
    apply: 'build',
    transformIndexHtml(_, ctx) {
      const file = Object.keys(ctx.bundle ?? {}).find((f) => pattern.test(f))
      if (!file) return
      return [
        {
          tag: 'link',
          attrs: { rel: 'preload', href: `/${file}`, as: 'font', type: 'font/woff2', crossorigin: '' },
          injectTo: 'head',
        },
      ]
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    preloadFont(/open-sans-latin-wght-normal-.*\.woff2$/),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2023',
    rolldownOptions: {
      output: {
        // Framework code changes rarely; keep it in its own long-cached chunk.
        codeSplitting: {
          groups: [{ name: 'react', test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/ }],
        },
      },
    },
  },
})
