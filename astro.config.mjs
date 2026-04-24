// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// デプロイ先ごとに base を切り替える
// - App Engine: base = '/'（GAE_APPLICATION がある）
// - 本番(既存の静的ホスティング想定): base = '/docs/as/info/'（NODE_ENV=production）
// - GitHub Pages: base/site を ASTRO_BASE / ASTRO_SITE で明示的に上書き
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
