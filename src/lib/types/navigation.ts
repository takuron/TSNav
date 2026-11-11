import type { IconName } from '#lib/icons/index.ts';

/** 页面提供的可定制分类；固定推荐入口由侧栏组件管理。 */
export interface NavigationCategory {
  id: string;
  label: string;
  icon: IconName;
}

/** 导航卡片的静态内容，不随界面语言切换。 */
export interface NavigationSite {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  icon: IconName;
  tone: 'neutral' | 'blue' | 'accent' | 'primary';
  badge?: string;
}
