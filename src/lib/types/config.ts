import type { NavigationTone } from '#lib/types/navigation.ts';

/** 配置文件中的用户身份信息。 */
export interface ConfigProfile {
  username: string;
  email: string;
}

/** 站点页脚的两行可配置内容。 */
export interface SiteFooter {
  line1: string;
  line2: string;
}

/** master.json 中的站点信息。 */
export interface ConfigSite {
  name: string;
  description: string;
  footer: SiteFooter;
}

/** 搜索、主题和语言设置。 */
export interface ConfigSettings {
  defaultSearchEngine: string;
  theme: 'system' | 'light' | 'dark';
  language: string;
}

/** 主页常用链接卡片。 */
export interface ConfigLink {
  name: string;
  description: string;
  url: string;
  icon: string;
  tone: NavigationTone;
  badge?: string;
}

/** master.json 中的顶层分类注册信息。 */
export interface ConfigCategoryRegistration {
  slug: string;
  label: string;
  title: string;
  description: string;
  icon: string;
}

/** master.json 的完整结构。 */
export interface MasterConfig {
  version: number;
  scope: 'default' | 'user';
  profile: ConfigProfile;
  site: ConfigSite;
  homepage: { commonLinks: ConfigLink[] };
  settings: ConfigSettings;
  categories: ConfigCategoryRegistration[];
}

/** 分类文件中的递归分组；根 category 是页面元信息，子级最多三层。 */
export interface CategoryGroup {
  id: string;
  title: string;
  icon?: string;
  links: ConfigLink[];
  children: CategoryGroup[];
}

/** {slug}.json 的完整结构。 */
export interface CategoryConfig {
  version: number;
  scope: 'default' | 'user';
  slug: string;
  category: {
    label: string;
    title: string;
    description: string;
    icon: string;
    links: ConfigLink[];
    children: CategoryGroup[];
  };
}
