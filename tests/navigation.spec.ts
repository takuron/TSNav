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
    expect(theme.token).toBe(colorScheme === 'dark' ? '#b5ccb5' : '#4f6352');
    expect(theme.width).toBeGreaterThan(200);
    expect(theme.overflow).toBe(false);
  });
}
