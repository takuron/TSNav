import type { Handle } from '@sveltejs/kit/hooks';
import { paraglideMiddleware } from '#lib/paraglide/server.js';
import { getTextDirection } from '#lib/paraglide/runtime.js';

// 中间件用 AsyncLocalStorage 隔离每次请求的语言，不修改进程级全局状态。
export const handle: Handle = ({ event, resolve }) =>
  paraglideMiddleware(event.request, async ({ request, locale }) => {
    const response = await resolve({ ...event, request }, {
      transformPageChunk: ({ html }) => html
        .replace('%lang%', locale)
        .replace('%dir%', getTextDirection(locale))
    });
    // 同一 URL 的 HTML 随 Cookie 变化，禁止共享缓存复用其他访客的语言。
    if (response.headers.get('content-type')?.includes('text/html')) {
      response.headers.append('Vary', 'Cookie');
      response.headers.set('Cache-Control', 'private, no-store');
    }
    return response;
  });
