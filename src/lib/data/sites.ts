/** 导航站点的分类，供筛选器和静态数据共同使用。 */
export type Category = '开发' | '设计' | '阅读';

/** 单个导航站点；地址须为可信的 HTTPS URL。 */
export interface NavSite {
  id: string;
  name: string;
  description: string;
  url: string;
  category: Category;
  monogram: string;
}

/** 首页示例站点；先用静态数据验证导航体验，后续可替换数据源。 */
export const sites: readonly NavSite[] = [
  { id: 'github', name: 'GitHub', description: '让想法在代码中生长。', url: 'https://github.com', category: '开发', monogram: 'GH' },
  { id: 'svelte', name: 'Svelte', description: '用更少的代码，构建更好的界面。', url: 'https://svelte.dev', category: '开发', monogram: 'Sv' },
  { id: 'cloudflare', name: 'Cloudflare', description: '把你的下一个作品带到世界各地。', url: 'https://developers.cloudflare.com', category: '开发', monogram: 'Cf' },
  { id: 'material', name: 'Material Design', description: '探索有表达力、可适应的设计。', url: 'https://m3.material.io', category: '设计', monogram: 'M3' },
  { id: 'figma', name: 'Figma', description: '从一个灵感，到完整的设计。', url: 'https://www.figma.com', category: '设计', monogram: 'Fi' },
  { id: 'mdn', name: 'MDN Web Docs', description: '每一次探索，都有可靠的参考。', url: 'https://developer.mozilla.org/zh-CN/', category: '阅读', monogram: 'md' }
];

/** 可选择的分类，顺序与导航栏展示一致。 */
export const categories: readonly Category[] = ['开发', '设计', '阅读'];
