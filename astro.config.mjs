// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Next.js実装と同じ: App Engineではbase: '/'、本番ではbase: '/docs/as/info/'
// GitHub Pagesなどでは ASTRO_BASE / ASTRO_SITE で上書き可能にする
const isAppEngine = !!process.env.GAE_APPLICATION;
const isProd = process.env.NODE_ENV === 'production';
const defaultBase = isAppEngine ? '/' : (isProd ? '/docs/as/info/' : '');
const base = process.env.ASTRO_BASE ?? defaultBase;

const defaultSite = 'https://waic.jp';
const site = process.env.ASTRO_SITE ?? defaultSite;

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [react()],
  site,
  base: base,
  outDir: './docs',
  build: {
    format: 'file', // .html拡張子付きファイルを生成（Next.js互換）
  },
});
