// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Next.js実装と同じ: App Engineではbase: '/'、本番ではbase: '/docs/as/info/'
const isAppEngine = !!process.env.GAE_APPLICATION;
const isProd = process.env.NODE_ENV === 'production';
const base = isAppEngine ? '/' : (isProd ? '/docs/as/info/' : '');

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [react()],
  site: 'https://waic.jp',
  base: base,
  outDir: './docs',
  build: {
    format: 'file', // .html拡張子付きファイルを生成（Next.js互換）
  },
});
