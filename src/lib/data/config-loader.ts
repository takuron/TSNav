import compiledMaster from '../../api/master.json';
import type { CategoryConfig, MasterConfig } from '#lib/types/config.ts';

type JsonModule = MasterConfig | CategoryConfig;

/** 仅编译期导入顶层默认配置；user/{uuid} 配置必须通过 URL 按需读取。 */
const compiledFiles = import.meta.glob('../../api/*.json', { eager: true, import: 'default' }) as Record<string, JsonModule>;

function categoryPath(slug: string): string { return `/api/${encodeURIComponent(slug)}.json`; }

function indexCategories(master: MasterConfig, files: Record<string, JsonModule>): ReadonlyMap<string, CategoryConfig> {
  const categories = new Map<string, CategoryConfig>();
  for (const registration of master.categories) {
    const file = files[`../../api/${registration.slug}.json`];
    if (!file || !('category' in file) || file.slug !== registration.slug) throw new Error(`导航分类配置缺失或 slug 不匹配：${registration.slug}.json`);
    categories.set(registration.slug, file);
  }
  return categories;
}

/** 编译期默认配置的原始数据模型。 */
export const compiledNavigationConfig = {
  master: compiledMaster as MasterConfig,
  categories: indexCategories(compiledMaster as MasterConfig, compiledFiles)
} as const;

/** 返回指定用户配置目录中的 master.json 路径。 */
export function userMasterPath(uuid: string): string { return `/api/user/${encodeURIComponent(uuid)}/master.json`; }
/** 返回指定用户分类文件的路径。 */
export function userCategoryPath(uuid: string, slug: string): string { return `/api/user/${encodeURIComponent(uuid)}/${encodeURIComponent(slug)}.json`; }

async function fetchJson<T extends JsonModule>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`导航配置加载失败（${response.status}）：${url}`);
  return await response.json() as T;
}
/** 从 URL 加载原始 master 配置，供运行时用户配置使用。 */
export function loadMaster(url = '/api/master.json'): Promise<MasterConfig> { return fetchJson<MasterConfig>(url); }
/** 从 URL 加载原始分类配置，供运行时用户配置使用。 */
export function loadCategory(slug: string, url = categoryPath(slug)): Promise<CategoryConfig> { return fetchJson<CategoryConfig>(url); }

export { categoryPath };
