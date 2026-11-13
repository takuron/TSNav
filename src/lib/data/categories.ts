/** 已移除旧版静态分类数据；此文件仅保留迁移期的 API 转发。 */
export { categoryPath, collectCategorySites, defaultNavigation as categoryNavigation, findCategoryBySlug, navigationCategories } from './navigation-config.ts';
export { defaultNavigation as categoryPagesSource } from './navigation-config.ts';
export { defaultNavigation } from './navigation-config.ts';
import { defaultNavigation } from './navigation-config.ts';
export const categoryPages = defaultNavigation.categoryPages;
