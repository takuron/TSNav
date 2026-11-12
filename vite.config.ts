import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { validateNavigationJson } from './src/lib/data/config-validation.ts';

validateNavigationJson(new URL('./static/api', import.meta.url).pathname);

export default defineConfig({
  plugins: [tailwindcss(), sveltekit({ adapter: adapter({ pages: 'build', assets: 'build', fallback: undefined }), preprocess: vitePreprocess() })]
});
