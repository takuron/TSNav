import { expect, test } from '@playwright/test';

test('SSR 保留八个真实站点链接', async ({ request }) => {
  const response = await request.get('/');
  expect(response.ok()).toBeTruthy();
  const html = await response.text();
  for (const url of ['https://github.com', 'https://claude.ai', 'https://figma.com', 'https://vercel.com', 'https://www.notion.so', 'https://www.bilibili.com', 'https://stackoverflow.com', 'https://dribbble.com']) expect(html).toContain(url);
});

test('侧栏分类、折叠和最近访问在页面内工作', async ({ page, context }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await context.route('https://github.com/**', (route) => route.fulfill({ body: 'GitHub' }));
  await page.goto('/');
  await expect(page.locator('.site-card')).toHaveCount(8);
  await page.getByRole('button', { name: '设计与视觉灵感', exact: true }).click();
  await expect(page.locator('.site-card')).toHaveCount(2);
  await page.getByRole('button', { name: '人工智能与前沿', exact: true }).click();
  await expect(page.locator('.site-card')).toHaveCount(1);
  await page.getByRole('button', { name: '历史与最近访问', exact: true }).click();
  await expect(page.getByText('还没有最近访问的网站', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '查看全部站点' }).click();
  const popup = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'GitHub（在新标签页打开）', exact: true }).click();
  await (await popup).close();
  await page.getByRole('button', { name: '历史与最近访问', exact: true }).click();
  await expect(page.locator('.site-card')).toHaveCount(1);
  await page.getByRole('button', { name: '收起或展开侧栏' }).click();
  await expect(page.locator('.portal')).toHaveClass(/collapsed/);
  await expect(page.locator('.sidebar')).toHaveCSS('width', '72px');
  expect(errors).toEqual([]);
});

test('五个搜索引擎使用各自地址并编码查询词', async ({ page, context }) => {
  await context.route(/https:\/\/(www\.)?(google\.com|baidu\.com|bing\.com|sogou\.com|duckduckgo\.com)\//, (route) => route.fulfill({ body: 'search' }));
  await page.goto('/');
  const query = 'Svelte & 中文';
  const engines = [
    ['Google', 'https://www.google.com/search?q='],
    ['百度', 'https://www.baidu.com/s?wd='],
    ['Bing', 'https://www.bing.com/search?q='],
    ['搜狗', 'https://www.sogou.com/web?query='],
    ['DuckDuckGo', 'https://duckduckgo.com/?q=']
  ];
  await page.getByRole('searchbox').press('Enter');
  expect(context.pages()).toHaveLength(1);
  for (const [name, base] of engines) {
    await page.getByRole('button', { name, exact: true }).click();
    await expect(page.getByRole('button', { name, exact: true })).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('searchbox').fill(query);
    const popup = page.waitForEvent('popup');
    await page.getByRole('searchbox').press('Enter');
    const result = await popup;
    await expect(result).toHaveURL(base + encodeURIComponent(query));
    await result.close();
  }
});

for (const colorScheme of ['light', 'dark'] as const) {
  test(`${colorScheme}：移动抽屉、主题继承和窄屏布局`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.getByRole('searchbox')).toBeVisible();
    const token = await page.locator('md-outlined-text-field').evaluate((element) => getComputedStyle(element.shadowRoot!.querySelector('input')!).getPropertyValue('--md-sys-color-primary').trim());
    expect(token).toBe(colorScheme === 'dark' ? '#c3e8ff' : '#006194');
    await page.getByRole('button', { name: '打开导航菜单' }).click();
    const drawer = page.getByRole('dialog', { name: '站点分类' });
    await expect(drawer).toBeVisible();
    await drawer.getByRole('button', { name: '设计与视觉灵感' }).click();
    await expect(drawer).not.toBeVisible();
    await expect(page.locator('.site-card')).toHaveCount(2);
    await page.getByRole('button', { name: '打开导航菜单' }).click();
    await page.keyboard.press('Escape');
    await expect(drawer).not.toBeVisible();
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    }
  });
}

test('语言仅切换通用界面，分类和站点保留自定义内容', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.text().includes('hydration_mismatch')) errors.push(message.text()); });
  await page.goto('/');
  await page.getByRole('button', { name: '界面设置', exact: true }).click();
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle('TSNav · Good places, one click away');
  await expect(page.getByRole('searchbox', { name: 'Search the web, technical keywords, or quick commands…' })).toBeVisible();
  await expect(page.getByRole('button', { name: '设计与视觉灵感', exact: true })).toBeVisible();
  await expect(page.locator('.site-card').first()).toContainText('全球最大的开源代码托管与协作平台');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('button', { name: 'Report a broken link' }).click();
  await expect(page.getByRole('dialog')).toContainText('This frontend prototype has no feedback service yet.');
  await page.getByRole('combobox').selectOption('figma');
  await expect(page.getByRole('dialog')).toContainText('https://figma.com');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Interface settings', exact: true }).click();
  await page.getByRole('button', { name: '简体中文', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  expect(errors).toEqual([]);
});

test('并发 SSR 隔离语言，未知语言回退中文', async ({ request }) => {
  const responses = await Promise.all(Array.from({ length: 12 }, async (_, index) => {
    const locale = index % 2 ? 'en' : 'zh-CN';
    const response = await request.get('/', { headers: { Cookie: `tsnav_locale=${locale}` } });
    return { locale, response, html: await response.text() };
  }));
  for (const { locale, response, html } of responses) {
    expect(response.ok()).toBeTruthy();
    expect(html).toContain(`lang="${locale}"`);
    expect(html).toContain(locale === 'en' ? 'Search engines' : '搜索引擎');
    expect(response.headers()['vary']).toContain('Cookie');
    expect(response.headers()['cache-control']).toBe('private, no-store');
  }
  const fallback = await request.get('/', { headers: { Cookie: 'tsnav_locale=unsupported' } });
  expect(await fallback.text()).toContain('lang="zh-CN"');
});
