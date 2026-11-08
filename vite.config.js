import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { content } from './src/data/content.js';
import { siteConfig } from './src/data/siteConfig.js';
import { assetCompression } from './scripts/asset-compression.mjs';
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const metadata = {
 name: 'portfolio-metadata',
 generateBundle() { this.emitFile({ type: 'asset', fileName: 'robots.txt', source: siteConfig.robots }); },
 transformIndexHtml: { order: 'pre', handler() {
  const themeScript = `try{var t=localStorage.getItem(${JSON.stringify(siteConfig.themeStorageKey)});document.documentElement.dataset.theme=t==='dark'||t==='light'?t:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}catch(e){document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}`;
  const homePreloadScript = `if(location.pathname===${JSON.stringify(siteConfig.routes.home)}){var p=document.createElement('link');p.rel='preload';p.as='image';p.href=${JSON.stringify(content.hero.art)};p.fetchPriority='high';document.head.appendChild(p)}`;
  return [
   { tag: 'script', children: themeScript, injectTo: 'head-prepend' },
   { tag: 'script', children: homePreloadScript, injectTo: 'head' },
   ...(siteConfig.url ? [{ tag: 'link', attrs: { rel: 'canonical', href: siteConfig.url }, injectTo: 'head' }] : []),
   { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '32x32', href: siteConfig.faviconPng }, injectTo: 'head' },
   { tag: 'link', attrs: { rel: 'apple-touch-icon', sizes: '180x180', href: siteConfig.appleIcon }, injectTo: 'head' },
   { tag: 'title', children: escape(siteConfig.title), injectTo: 'head' },
   { tag: 'meta', attrs: { name: 'description', content: siteConfig.description }, injectTo: 'head' },
   ...(siteConfig.favicon ? [{ tag: 'link', attrs: { rel: 'icon', type: 'image/svg+xml', href: siteConfig.favicon }, injectTo: 'head' }] : []),
   ...Object.entries({ 'og:type': 'website', 'og:title': siteConfig.title, 'og:description': siteConfig.description, ...(siteConfig.url ? { 'og:image': new URL(siteConfig.ogImage, siteConfig.url).href, 'og:image:width': '1200', 'og:image:height': '630', 'og:image:type': 'image/png', 'og:url': siteConfig.url, 'og:image:alt': siteConfig.ogAlt } : {}) }).map(([property, content]) => ({ tag: 'meta', attrs: { property, content }, injectTo: 'head' })),
   ...Object.entries({ 'twitter:card': 'summary_large_image', 'twitter:title': siteConfig.title, 'twitter:description': siteConfig.description, ...(siteConfig.url ? { 'twitter:image': new URL(siteConfig.ogImage, siteConfig.url).href, 'twitter:image:alt': siteConfig.ogAlt } : {}) }).map(([name, content]) => ({ tag: 'meta', attrs: { name, content }, injectTo: 'head' })),
  ];
 } },
};
export default defineConfig({
 plugins: [react(), tailwindcss(), metadata, assetCompression()],
 // Use equivalent source exports so renderer/core modules can form separate lazy chunks.
 resolve: { alias: [{ find: /^three$/, replacement: fileURLToPath(new URL('./node_modules/three/src/Three.js', import.meta.url)) }] },
 build: { rolldownOptions: { output: { strictExecutionOrder: true, codeSplitting: { groups: [
  { name: 'three-renderer', test: /three[\\/]src[\\/]renderers[\\/]/, maxSize: 400000, includeDependenciesRecursively: false },
  { name: 'three-core', test: /three[\\/]src[\\/]/, maxSize: 400000, includeDependenciesRecursively: false },
 ] } } } },
});
