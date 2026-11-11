import { expect, test } from '@playwright/test';

for (const route of ['/', '/category/development']) {
  test(`${route}：卡片网格按实际空间展示 1、2、3、4 列`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(route);
    const grid = page.locator('.navigation-card-grid').first();
    for (const [width, columns] of [[320, 1], [390, 2], [900, 2], [1024, 3], [1440, 4]]) {
      await page.setViewportSize({ width, height: 1000 });
      await expect.poll(() => grid.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length)).toBe(columns);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    }
    await page.setViewportSize({ width: 1024, height: 1000 });
    await page.getByRole('button', { name: '收起或展开侧栏', exact: true }).click();
    await expect.poll(() => grid.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length)).toBe(4);
  });

  test(`${route}：访问图标按悬停和键盘焦点显示，长描述限制两行`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route);
    const cards = page.locator('.site-card');
    const arrow = cards.first().locator('.card-arrow');
    await expect(arrow).toHaveCSS('opacity', '0');
    await cards.first().hover();
    await expect(arrow).toHaveCSS('opacity', '1');
    await page.mouse.move(0, 0);
    await expect(arrow).toHaveCSS('opacity', '0');
    await cards.first().focus();
    await page.keyboard.press('Tab');
    await expect(cards.nth(1)).toBeFocused();
    await expect(cards.nth(1).locator('.card-arrow')).toHaveCSS('opacity', '1');
    const description = cards.first().locator('.card-copy p');
    await description.evaluate((element) => { element.textContent = '这是一段用来检查自定义站点说明的很长文字，应该在两行后省略。'.repeat(12); });
    const layout = await description.evaluate((element) => ({ height: element.clientHeight, fullHeight: element.scrollHeight, clamp: getComputedStyle(element).webkitLineClamp, overflow: getComputedStyle(element).overflow }));
    expect(layout.height).toBe(40);
    expect(layout.fullHeight).toBeGreaterThan(layout.height);
    expect(layout.clamp).toBe('2');
    expect(layout.overflow).toBe('hidden');
  });
}
