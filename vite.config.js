import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  // Use '/' on Vercel or during local dev, fall back to subpath for GitHub Pages
  base: process.env.VERCEL || command === 'serve' ? '/' : '/LamahattaHigherSecondarySchool/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        gallery: 'gallery.html'
      }
    }
  }
}));
