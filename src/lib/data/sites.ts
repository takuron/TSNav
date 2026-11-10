import { m } from '#lib/paraglide/messages.js';

/** 导航站点的分类，供筛选器和静态数据共同使用。 */
export type Category = 'development' | 'design' | 'reading';

/** 单个导航站点；地址须为可信的 HTTPS URL。 */
export interface NavSite {
  id: string;
  name: string;
  /** 在请求或渲染上下文中获取当前语言描述，禁止在模块顶层调用。 */
  description: () => string;
  url: string;
  category: Category;
  monogram: string;
}

/** 首页示例站点；先用静态数据验证导航体验，后续可替换数据源。 */
export const sites: readonly NavSite[] = [
  { id: 'github', name: 'GitHub', description: m.site_github_description, url: 'https://github.com', category: 'development', monogram: 'GH' },
  { id: 'svelte', name: 'Svelte', description: m.site_svelte_description, url: 'https://svelte.dev', category: 'development', monogram: 'Sv' },
  { id: 'cloudflare', name: 'Cloudflare', description: m.site_cloudflare_description, url: 'https://developers.cloudflare.com', category: 'development', monogram: 'Cf' },
  { id: 'material', name: 'Material Design', description: m.site_material_description, url: 'https://m3.material.io', category: 'design', monogram: 'M3' },
  { id: 'figma', name: 'Figma', description: m.site_figma_description, url: 'https://www.figma.com', category: 'design', monogram: 'Fi' },
  { id: 'mdn', name: 'MDN Web Docs', description: m.site_mdn_description, url: 'https://developer.mozilla.org/zh-CN/', category: 'reading', monogram: 'md' }
];

/** 可选择的分类，顺序与导航栏展示一致。 */
export const categories: readonly Category[] = ['development', 'design', 'reading'];

/** 稳定分类 ID 对应的消息函数；调用时才解析语言，避免 SSR 串语言。 */
export const categoryLabels: Record<Category, () => string> = {
  development: m.category_development,
  design: m.category_design,
  reading: m.category_reading
};
