import type { IconName } from '#lib/icons/index.ts';
import { copy } from '#lib/copy.ts';
import type { CategoryConfig, CategoryGroup, ConfigLink, MasterConfig } from '#lib/types/config.ts';
import type { CategoryPage, CategorySection, NavigationCategory, NavigationSite } from '#lib/types/navigation.ts';
import { compiledNavigationConfig } from './config-loader.ts';

const master = compiledNavigationConfig.master;
function iconName(value: string): IconName {
  const id = value.startsWith('md://') || value.startsWith('simple://') || value.startsWith('icon://') ? value.slice(value.indexOf('://') + 3) : value.includes('weibo') ? 'sinaweibo' : value.includes('baidutieba') ? 'baiduTieba' : value.includes('zhihu') ? 'zhihu' : value.includes('bilibili') ? 'bilibili' : value.includes('iqiyi') ? 'iqiyi' : value.includes('neteasecloudmusic') ? 'neteasecloudmusic' : value.includes('/qq') ? 'qqMail' : value.includes('deepseek') ? 'deepseek' : 'link';
  return id as IconName;
}
function link(site: ConfigLink, id: string, category: string): NavigationSite { return { id, name: site.name, description: site.description, url: site.url, category, icon: iconName(site.icon), ...(site.badge ? { badge: site.badge } : {}) }; }
function section(group: CategoryGroup, category: string, path: string): CategorySection { return { id: group.id, title: group.title, ...(group.icon ? { icon: iconName(group.icon) } : {}), sites: group.links.map((site, index) => link(site, `${category}-${path}-${index}`, category)), children: group.children.map((child) => section(child, category, `${path}-${child.id}`)) }; }
/** 将原始分类配置转换为所有界面共用的显示模型。 */
export function toCategoryPage(config: CategoryConfig): CategoryPage {
  const category = config.category;
  return { id: config.slug, slug: config.slug, label: category.label ?? category.title, icon: iconName(category.icon), title: category.title, description: category.title, href: `/category/${encodeURIComponent(config.slug)}`, sections: [...(category.links.length > 0 ? [{ id: `${config.slug}-links`, title: category.title, icon: iconName(category.icon), sites: category.links.map((site, index) => link(site, `${config.slug}-root-${index}`, config.slug)), children: [] }] : []), ...category.children.map((child) => section(child, config.slug, child.id))] };
}
const categoryPages = master.categories.flatMap((registration) => { const config = compiledNavigationConfig.categories.get(registration.slug); return config ? [toCategoryPage(config)] : []; });
/** 构建时预载的默认导航数据，供主页和分类页共享。 */
export const defaultNavigation = { master, categoryPages: categoryPages as readonly CategoryPage[], shortcuts: master.homepage.commonLinks.map((site, index) => link(site, `home-${index}`, 'discover')) as readonly NavigationSite[] };
/** 根据 master.json 注册表生成侧栏分类。 */
export const navigationCategories: readonly NavigationCategory[] = [{ id: 'recommended', label: copy.nav_recommended(), icon: 'star' }, ...defaultNavigation.categoryPages.map((category) => ({ id: category.id, label: category.label, icon: category.icon, href: category.href }))];
export function findCategoryBySlug(slug: string, pages: readonly CategoryPage[] = defaultNavigation.categoryPages): CategoryPage | undefined { return pages.find((category) => category.slug === slug); }
export function categoryPath(id: string, pages: readonly CategoryPage[] = defaultNavigation.categoryPages): string | undefined { return pages.find((item) => item.id === id)?.href; }
export function collectCategorySites(sections: readonly CategorySection[]): NavigationSite[] { return sections.flatMap((section) => [...(section.sites ?? []), ...collectCategorySites(section.children ?? [])]); }
export type { CategoryConfig, MasterConfig };
