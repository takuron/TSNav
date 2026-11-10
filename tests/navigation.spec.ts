import { expect, test } from '@playwright/test';

test('服务端保留站点链接且不依赖浏览器组件注册', async ({ request }) => {
  const response = await request.get('/');
  expect(response.ok()).toBeTruthy();
  expect(await response.text()).toContain('https://github.com');
});

test('Material 输入、Svelte 筛选和 Material 重置按钮协同工作', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('.site-card')).toHaveCount(6);
  await page.getByRole('button', { name: '设计', exact: true }).click();
  await expect(page.locator('.site-card')).toHaveCount(2);
  await page.getByRole('button', { name: '全部', exact: true }).click();
  await page.getByRole('searchbox').fill('svelte');
  await expect(page.locator('.site-card')).toHaveCount(1);
  await page.getByRole('searchbox').fill('no-such-site');
  const resetButton = page.getByRole('button', { name: '查看全部站点' });
  await resetButton.focus();
  await resetButton.press('Enter');
  await expect(page.locator('.site-card')).toHaveCount(6);
  await expect(page.getByRole('searchbox')).toHaveValue('');
  expect(errors).toEqual([]);
});

for (const colorScheme of ['light', 'dark'] as const) {
  test(`${colorScheme}：主题令牌进入 Shadow DOM，移动端没有横向溢出`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.getByRole('searchbox')).toBeVisible();
    const theme = await page.locator('md-outlined-text-field').evaluate(async (element) => {
      await customElements.whenDefined('md-outlined-text-field');
      const input = element.shadowRoot!.querySelector('input')!;
      return {
        token: getComputedStyle(input).getPropertyValue('--md-sys-color-primary').trim(),
        width: element.getBoundingClientRect().width,
        overflow: document.documentElement.scrollWidth > innerWidth
      };
    });
    expect(theme.token).toBe(colorScheme === 'dark' ? '#c3e8ff' : '#006194');
    expect(theme.width).toBeGreaterThan(200);
    expect(theme.overflow).toBe(false);
  });
}

test('语言切换持久化，文档、文案和 Material 控件同步更新', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.text().includes('hydration_mismatch')) errors.push(message.text());
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page).toHaveTitle('TSNav · Good places, one click away');
  await expect(page.getByRole('searchbox', { name: 'Search sites, categories, or keywords' })).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('Sites: 6');
  await page.getByRole('button', { name: 'Design', exact: true }).click();
  await expect(page.locator('.site-card')).toHaveCount(2);
  await expect(page.locator('.site-card').first()).toContainText('Explore expressive, adaptive design.');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('button', { name: '简体中文', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.getByRole('searchbox', { name: '搜索站点、分类或关键词' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('并发 SSR 请求隔离语言，未知语言安全回退中文', async ({ request }) => {
  const responses = await Promise.all(Array.from({ length: 12 }, async (_, index) => {
    const locale = index % 2 ? 'en' : 'zh-CN';
    const response = await request.get('/', { headers: { Cookie: `tsnav_locale=${locale}` } });
    return { locale, response, html: await response.text() };
  }));
  for (const { locale, response, html } of responses) {
    expect(response.ok()).toBeTruthy();
    expect(html).toContain(`lang="${locale}"`);
    expect(html).toContain(locale === 'en' ? 'Discover sites' : '发现好站');
    expect(response.headers()['vary']).toContain('Cookie');
    expect(response.headers()['cache-control']).toBe('private, no-store');
  }
  const fallback = await request.get('/', { headers: { Cookie: 'tsnav_locale=unsupported' } });
  expect(await fallback.text()).toContain('lang="zh-CN"');
});
