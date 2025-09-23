import { defineConfig } from 'astro/config';

export default defineConfig({
  outDir: 'docs',
  // GitHub Pages alatt a repo-útvonal miatt érdemes:
  base: '/laaurainteriors',
  site: 'https://bencevrga.github.io/laaurainterior',
});