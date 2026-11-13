import defaultCategory from '../../../static/api/development.json';
import defaultMaster from '../../../static/api/master.json';
import type { IconName } from '#lib/icons/index.ts';
import { copy } from '#lib/copy.ts';
import type { CategoryConfig, CategoryGroup, ConfigLink, MasterConfig } from '#lib/types/config.ts';
import type { CategoryPage, CategorySection, NavigationCategory, NavigationSite } from '#lib/types/navigation.ts';

const master = defaultMaster as MasterConfig;
const development = defaultCategory as CategoryConfig;

function iconName(value: string): IconName {
  const id = value.startsWith('md://') || value.startsWith('simple://') || value.startsWith('icon://') ? value.slice(value.indexOf('://') + 3) : value.includes('weibo') ? 'sinaweibo' : value.includes('baidutieba') ? 'baiduTieba' : value.includes('zhihu') ? 'zhihu' : value.includes('bilibili') ? 'bilibili' : value.includes('iqiyi') ? 'iqiyi' : value.includes('neteasecloudmusic') ? 'neteasecloudmusic' : value.includes('/qq') ? 'qqMail' : value.includes('deepseek') ? 'deepseek' : 'link';
  return id as IconName;
}

function link(site: ConfigLink, id: string, category: string): NavigationSite {
  return { id, name: site.name, description: site.description, url: site.url, category, icon: iconName(site.icon), ...(site.badge ? { badge: site.badge } : {}) };
}

function section(group: CategoryGroup, category: string, path: string): CategorySection {
  return { id: group.id, title: group.title, ...(group.icon ? { icon: iconName(group.icon) } : {}), sites: group.links.map((site, index) => link(site, `${category}-${path}-${index}`, category)), children: group.children.map((child) => section(child, category, `${path}-${child.id}`)) };
}

const categoryFile = development.category;
const categoryPage: CategoryPage = {
  id: development.slug,
  slug: development.slug,
  label: categoryFile.label ?? categoryFile.title,
  icon: iconName(categoryFile.icon),
  title: categoryFile.title,
  description: categoryFile.title,
  sections: [
    ...(categoryFile.links.length > 0 ? [{ id: `${development.slug}-links`, title: categoryFile.title, icon: iconName(categoryFile.icon), sites: categoryFile.links.map((site, index) => link(site, `${development.slug}-root-${index}`, development.slug)), children: [] }] : []),
    ...categoryFile.children.map((child) => section(child, development.slug, child.id))
  ]
};

/** 构建时预载的默认导航数据，供主页和分类页共享。 */
export const defaultNavigation = {
  master,
  categoryPages: [categoryPage] as readonly CategoryPage[],
  shortcuts: master.homepage.commonLinks.map((site, index) => link(site, `home-${index}`, 'discover')) as readonly NavigationSite[]
};

/** 根据配置生成侧栏分类；仅注册 master.json 中存在的顶层分类。 */
export const navigationCategories: readonly NavigationCategory[] = [
  { id: 'recommended', label: copy.nav_recommended(), icon: 'star' },
  ...defaultNavigation.categoryPages.map((category) => ({ id: category.id, label: category.label, icon: category.icon, href: `/category/${encodeURIComponent(category.slug)}` })),
];

export function findCategoryBySlug(slug: string): CategoryPage | undefined { return defaultNavigation.categoryPages.find((category) => category.slug === slug); }
export function categoryPath(id: string): string | undefined { const category = defaultNavigation.categoryPages.find((item) => item.id === id); return category ? `/category/${encodeURIComponent(category.slug)}` : undefined; }
export function collectCategorySites(sections: readonly CategorySection[]): NavigationSite[] { return sections.flatMap((section) => [...(section.sites ?? []), ...collectCategorySites(section.children ?? [])]); }
