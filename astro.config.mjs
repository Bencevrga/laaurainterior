import { defineConfig } from 'astro/config';

export default defineConfig({
  outDir: 'docs',
  // GitHub Pages alatt a repo-útvonal miatt érdemes:
  base: '/laaurainterior',
  site: 'https://github.com/Bencevrga/laaurainterior',
});