import type { IconName } from '#lib/icons/index.ts';

/** 页面提供的可定制分类；固定推荐入口由侧栏组件管理。 */
export interface NavigationCategory {
  id: string;
  label: string;
  icon: IconName;
  /** 有独立页面时提供真实路由；缺省时由页面处理本地筛选。 */
  href?: string;
}

/** 导航卡片可使用的颜色语义。 */
export type NavigationTone = 'default' | 'theme';

/** 导航卡片的静态内容，属于静态示例内容。 */
export interface NavigationSite {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  icon: IconName;
  tone: NavigationTone;
  badge?: string;
}

/** 分类目录中的递归分组；标题、图标及站点均为可定制内容。 */
export interface CategorySection {
  id: string;
  title: string;
  icon?: IconName;
  children?: CategorySection[];
  sites?: NavigationSite[];
}

/** 分类页面配置：稳定 ID、URL 标识与显示名称互相独立。 */
export interface CategoryPage extends NavigationCategory {
  slug: string;
  title: string;
  description: string;
  sections: CategorySection[];
}
