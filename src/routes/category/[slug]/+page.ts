import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { findCategoryBySlug } from '#lib/data/categories.ts';

// 路由参数由 SvelteKit 解码一次；只解析已配置的 slug，未知分类明确返回 404。
export const load: PageLoad = ({ params }) => {
  const category = findCategoryBySlug(params.slug);
  if (!category) error(404, '分类不存在');
  return { category };
};
