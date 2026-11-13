import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';
import { validateNavigationJson } from './src/lib/data/config-validation.ts';

const apiDirectory = fileURLToPath(new URL('./src/api/', import.meta.url));
validateNavigationJson(apiDirectory);

/** 将 src/api 中的 JSON 原样提供给 /api URL，并作为构建产物输出。 */
function navigationApiAssets(): Plugin {
  return {
    name: 'navigation-api-assets',
    configureServer(server: { middlewares: { use: (handler: (req: any, res: any, next: () => void) => void) => void } }) {
      server.middlewares.use((request, response, next) => {
        if (!request.url?.startsWith('/api/')) return next();
        const relativePath = decodeURIComponent(request.url.slice('/api/'.length).split('?')[0]);
        if (!relativePath.endsWith('.json') || relativePath.includes('..')) return next();
        try {
          const source = readFileSync(join(apiDirectory, relativePath));
          response.statusCode = 200;
          response.setHeader('Content-Type', 'application/json; charset=utf-8');
          response.end(source);
        } catch {
          next();
        }
      });
    },
    generateBundle() {
      for (const file of jsonFiles(apiDirectory)) {
        this.emitFile({ type: 'asset', fileName: `api/${relative(apiDirectory, file).replaceAll('\\', '/')}`, source: readFileSync(file) });
      }
    }
  };
}

function jsonFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? jsonFiles(path) : entry.name.endsWith('.json') ? [path] : [];
  });
}

export default defineConfig({
  resolve: { alias: { '#api': apiDirectory } },
  plugins: [tailwindcss(), navigationApiAssets(), sveltekit({ adapter: adapter({ pages: 'build', assets: 'build', fallback: undefined }), preprocess: vitePreprocess() })]
});
