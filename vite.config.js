import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  // Use '/' on Vercel or during local dev, fall back to subpath for GitHub Pages
  base: process.env.VERCEL || command === 'serve' ? '/' : '/LamahattaHigherSecondarySchool/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        about: 'about.html',
        headmaster: 'headmaster.html',
        academics: 'academics.html',
        admissions: 'admissions.html',
        faculty: 'faculty.html',
        notices: 'notices.html',
        gallery: 'gallery.html',
        alumni: 'alumni.html',
        contact: 'contact.html',
        admin: 'admin.html'
      }
    }
  }
}));
