import { expect, test } from '@playwright/test';
import { categoryPages, categoryPath, findCategoryBySlug } from '../src/lib/data/categories.ts';

test('分类显示名、稳定 ID 与可定制中文 slug 独立', () => {
  const custom = [{ ...categoryPages[0], label: '我的技术收藏', slug: '开发 工具' }];
  expect(categoryPath('dev', custom)).toBe(`/category/${encodeURIComponent('开发 工具')}`);
  expect(findCategoryBySlug('开发 工具', custom)?.id).toBe('dev');
  expect(findCategoryBySlug('我的技术收藏', custom)).toBeUndefined();
  expect(findCategoryBySlug('development', custom)).toBeUndefined();
  expect(categoryPath('missing', custom)).toBeUndefined();
});

test('分类页可直达且 SSR 输出完整分组、16 个站点和安全外链', async ({ request, page }) => {
  const response = await request.get('/category/development');
  expect(response.status()).toBe(200);
  const html = await response.text();
  for (const name of ['开发技术与基础架构', '现代前端生态与框架', '核心语言运行时与微框架', '容器化与集群编排调度', 'DevOps 与研发效能']) expect(html).toContain(name);
  expect(html).toContain('https://react.dev');
  expect(html).toContain('https://istio.io');
  await page.goto('/category/development');
  await expect(page.locator('.site-card')).toHaveCount(16);
  await expect(page.locator('.directory-section.level-2')).toHaveCount(3);
  await expect(page.locator('.directory-section.level-4')).toHaveCount(2);
  for (const link of await page.locator('.site-card').all()) {
    await expect(link).toHaveAttribute('href', /^https:\/\//);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
  await page.reload();
  await expect(page.getByRole('heading', { name: '开发技术与基础架构', exact: true })).toBeVisible();
});

test('未注册 slug 返回 404，不用显示名或默认分类替代', async ({ request }) => {
  for (const slug of ['missing-category', 'constructor', encodeURIComponent('开发与云原生')]) {
    const response = await request.get(`/category/${slug}`);
    expect(response.status()).toBe(404);
  }
});

test('主页与分类页通过侧栏往返，其他分类继续使用本地筛选', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('link', { name: '开发与云原生', exact: true }).click();
  await expect(page).toHaveURL(/\/category\/development$/);
  await expect(page.getByRole('link', { name: '开发与云原生', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('button', { name: '设计与视觉灵感', exact: true }).click();
  await expect(page).toHaveURL(/\/\?category=design$/);
  await expect(page.locator('.site-card')).toHaveCount(2);
  await page.getByRole('link', { name: '开发与云原生', exact: true }).click();
  await page.getByRole('button', { name: '常用推荐', exact: true }).click();
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  await expect(page.locator('.site-card')).toHaveCount(8);
  expect(errors).toEqual([]);
});

for (const colorScheme of ['light', 'dark'] as const) {
  test(`分类页 ${colorScheme}：窄屏布局、抽屉导航与内容语言`, async ({ page, context }) => {
    await page.emulateMedia({ colorScheme });
    await context.addCookies([{ name: 'tsnav_locale', value: 'en', url: 'http://127.0.0.1:4173' }]);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/category/development');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { name: '开发技术与基础架构', exact: true })).toBeVisible();
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole('button', { name: 'Open navigation menu' }).click();
    const drawer = page.getByRole('dialog', { name: 'Site categories' });
    await expect(drawer.getByRole('link', { name: '开发与云原生', exact: true })).toHaveAttribute('aria-current', 'page');
    await drawer.getByRole('button', { name: 'Recommended', exact: true }).click();
    await expect(page).toHaveURL('http://127.0.0.1:4173/');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
}
