import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  build: { format: 'file', inlineStylesheets: 'never' },

  site: 'https://lucas-nieto-portfolio.portfolio-lucas-nieto.workers.dev',
  vite: { plugins: [tailwindcss()] },
});
