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
    const token = await page.getByRole('searchbox').evaluate((element) => getComputedStyle(element).getPropertyValue('--md-sys-color-primary').trim());
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

test('搜索清空按钮按内容显示，清空后保留输入焦点', async ({ page, context }) => {
  await page.goto('/');
  const input = page.getByRole('searchbox');
  const clear = page.getByRole('button', { name: '清空搜索', exact: true });
  await expect(clear).toHaveCount(0);
  await expect(page.locator('.engine-tabs .engine-tab svg')).toHaveCount(5);
  await expect(page.locator('.search-row')).toHaveCSS('height', '56px');
  await input.fill('Svelte 中文');
  await expect(clear).toBeVisible();
  await clear.click();
  await expect(input).toHaveValue('');
  await expect(input).toBeFocused();
  await expect(clear).toHaveCount(0);
  await input.fill(' ');
  await expect(clear).toBeVisible();
  await input.press('Enter');
  expect(context.pages()).toHaveLength(1);
  await input.fill('keyword');
  await input.press('Tab');
  await expect(clear).toBeFocused();
  await clear.press('Enter');
  await expect(input).toBeFocused();
  await expect(input).toHaveValue('');
});

test('窄搜索面板使用引擎下拉框，搜索与跨断点状态保持一致', async ({ page, context }) => {
  await context.route(/https:\/\/(www\.)?(google\.com|baidu\.com|bing\.com|sogou\.com|duckduckgo\.com)\//, (route) => route.fulfill({ body: 'search' }));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const picker = page.locator('.engine-trigger');
  const input = page.getByRole('searchbox');
  await expect(picker).toBeVisible();
  await expect(page.getByRole('button', { name: 'Google', exact: true })).toHaveCount(0);
  const query = 'Svelte & 中文';
  await input.fill(query);
  for (const [name, base] of [
    ['Google', 'https://www.google.com/search?q='],
    ['百度', 'https://www.baidu.com/s?wd='],
    ['Bing', 'https://www.bing.com/search?q='],
    ['搜狗', 'https://www.sogou.com/web?query='],
    ['DuckDuckGo', 'https://duckduckgo.com/?q=']
  ]) {
    await picker.click();
    await expect(picker).toHaveAttribute('aria-expanded', 'true');
    await page.getByRole('menuitem', { name, exact: true }).click();
    await expect(picker).toHaveText(name);
    await expect(picker).toHaveAttribute('aria-expanded', 'false');
    await expect(input).toHaveValue(query);
    const popup = page.waitForEvent('popup');
    await input.press('Enter');
    const result = await popup;
    await expect(result).toHaveURL(base + encodeURIComponent(query));
    await result.close();
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(picker).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'DuckDuckGo', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.engine-tabs .engine-tab svg').first()).toHaveCSS('width', '16px');
  await page.getByRole('button', { name: 'Bing', exact: true }).click();
  for (const width of [900, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(picker).toBeVisible();
    await expect(picker).toHaveText('Bing');
    await expect(input).toHaveValue(query);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  }
});


test('移动引擎按钮保持桌面样式，菜单支持键盘与外部关闭', async ({ page }) => {
  await page.goto('/');
  const desktopButton = page.getByRole('button', { name: 'Google', exact: true });
  const readStyle = (element: HTMLElement | SVGElement) => {
    const style = getComputedStyle(element);
    return { padding: style.padding, fontSize: style.fontSize, background: style.backgroundColor, radius: style.borderRadius, height: element.getBoundingClientRect().height };
  };
  const desktopStyle = await desktopButton.evaluate(readStyle);
  await page.setViewportSize({ width: 390, height: 844 });
  const trigger = page.locator('.engine-trigger');
  await expect(trigger).toBeVisible();
  expect(await trigger.evaluate(readStyle)).toEqual(desktopStyle);
  await expect(page.getByRole('menuitem')).toHaveCount(0);
  await trigger.focus();
  await trigger.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Google', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: '百度', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveText('百度');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole('searchbox').click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await page.setViewportSize({ width: 320, height: 844 });
  await trigger.click();
  const menuItem = page.getByRole('menuitem', { name: 'DuckDuckGo', exact: true });
  await expect(menuItem).toBeVisible();
  const bounds = await menuItem.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(trigger).not.toBeVisible();
  await expect(page.getByRole('menuitem')).toHaveCount(0);
});

test('移动顶栏仅保留菜单入口，侧栏仍保留品牌和设置', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const header = page.locator('.mobile-header');
  await expect(header.getByRole('button')).toHaveCount(1);
  await expect(header.getByRole('link')).toHaveCount(0);
  await expect(header.getByRole('img')).toHaveCount(0);
  await header.getByRole('button', { name: '打开导航菜单' }).click();
  const drawer = page.getByRole('dialog', { name: '站点分类' });
  await expect(drawer.getByRole('link', { name: 'TSNav 首页' })).toBeVisible();
});

test('短内容无多余滚动，页脚贴底且搜索和卡片整体居中', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [width, height] of [[1440, 900], [1024, 900], [390, 1200]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await expect(page.getByRole('searchbox')).toBeVisible();
    const layout = await page.evaluate(() => {
      const main = document.querySelector('.portal-main')!.getBoundingClientRect();
      const content = document.querySelector('.dashboard')!.getBoundingClientRect();
      const footer = document.querySelector('.portal-footer')!.getBoundingClientRect();
      return { scrollHeight: document.documentElement.scrollHeight, height: innerHeight, footerBottom: footer.bottom, mainCenter: (main.top + main.bottom) / 2, contentCenter: (content.top + content.bottom) / 2 };
    });
    expect(layout.scrollHeight).toBe(layout.height);
    expect(layout.footerBottom).toBeCloseTo(layout.height, 0);
    expect(layout.contentCenter).toBeCloseTo(layout.mainCenter, 0);
  }
});

test('长内容正常滚动，页脚位于最后且完整可达', async ({ page }) => {
  for (const [width, height] of [[1440, 400], [390, 600], [320, 600]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await expect(page.getByRole('searchbox')).toBeVisible();
    // 同一路由重新导航会恢复上一轮滚动位置，测量前显式回到文档顶部。
    await page.evaluate(() => window.scrollTo(0, 0));
    const layout = await page.evaluate(() => {
      const content = document.querySelector('.dashboard')!.getBoundingClientRect();
      const footer = document.querySelector('.portal-footer')!.getBoundingClientRect();
      return { contentTop: content.top, contentBottom: content.bottom, footerTop: footer.top, footerBottom: footer.bottom, scrollHeight: document.documentElement.scrollHeight, height: innerHeight };
    });
    expect(layout.scrollHeight).toBeGreaterThan(layout.height);
    expect(layout.contentTop).toBeGreaterThanOrEqual(0);
    expect(layout.footerTop).toBeGreaterThanOrEqual(layout.contentBottom);
    expect(layout.footerBottom).toBeCloseTo(layout.scrollHeight, 0);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect(page.getByRole('button', { name: '反馈死链', exact: true })).toBeInViewport();
  }
});

test('移动抽屉每次展开均滑入，遮罩固定且关闭后恢复焦点', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const trigger = page.getByRole('button', { name: '打开导航菜单' });
  const drawer = page.getByRole('dialog', { name: '站点分类' });
  for (const closeWith of ['escape', 'backdrop', 'category']) {
    await trigger.focus();
    const motion = await trigger.evaluate((button) => {
      if (!(button instanceof HTMLButtonElement)) throw new Error('抽屉入口必须是按钮');
      button.click();
      const dialog = document.querySelector<HTMLDialogElement>('.mobile-drawer')!;
      const panel = dialog.querySelector<HTMLElement>('.drawer-panel')!;
      const animation = panel.getAnimations().find((item) => item instanceof CSSAnimation && item.animationName === 'drawer-panel-enter');
      if (!animation) throw new Error('抽屉展开动画未启动');
      animation.pause();
      animation.currentTime = 0;
      const start = panel.getBoundingClientRect().left;
      animation.currentTime = 100;
      const middle = panel.getBoundingClientRect().left;
      const backdrop = dialog.querySelector('.drawer-backdrop')!.getBoundingClientRect();
      animation.finish();
      return { start, middle, end: panel.getBoundingClientRect().left, width: panel.getBoundingClientRect().width, backdropLeft: backdrop.left, backdropRight: backdrop.right, viewport: innerWidth, scrimAnimation: getComputedStyle(dialog, '::backdrop').animationName };
    });
    expect(motion.start).toBeCloseTo(-motion.width, 0);
    expect(motion.middle).toBeGreaterThan(motion.start);
    expect(motion.middle).toBeLessThan(0);
    expect(motion.end).toBe(0);
    expect(motion.backdropLeft).toBe(0);
    expect(motion.backdropRight).toBe(motion.viewport);
    expect(motion.scrimAnimation).toBe('drawer-scrim-enter');
    if (closeWith === 'escape') await page.keyboard.press('Escape');
    if (closeWith === 'backdrop') await page.locator('.drawer-backdrop').click({ position: { x: 350, y: 100 } });
    if (closeWith === 'category') await drawer.getByRole('button', { name: '设计与视觉灵感' }).click();
    await expect(drawer).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
});

test('减少动态效果时抽屉与遮罩直接显示', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: '打开导航菜单' }).click();
  await expect(page.locator('.drawer-panel')).toHaveCSS('animation-name', 'none');
  expect(await page.locator('.mobile-drawer').evaluate((element) => getComputedStyle(element, '::backdrop').animationName)).toBe('none');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: '站点分类' })).not.toBeVisible();
});

test('所有移动抽屉关闭入口等待滑出和遮罩淡出，设置弹窗随后打开', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const action of ['button', 'backdrop', 'escape', 'category']) {
    await page.goto('/');
    await page.getByRole('button', { name: '打开导航菜单' }).click();
    const drawer = page.locator('.mobile-drawer');
    await page.locator('.drawer-panel').evaluate(async (element) => {
      await Promise.allSettled(element.getAnimations().map((animation) => animation.finished));
    });
    const motion = await drawer.evaluate(async (element, action) => {
      if (!(element instanceof HTMLDialogElement)) throw new Error('抽屉必须为 dialog');
      if (action === 'escape') element.dispatchEvent(new Event('cancel', { cancelable: true }));
      else {
        const selector = action === 'button' ? '.sidebar-heading button' : action === 'backdrop' ? '.drawer-backdrop' : '.destination';
        element.querySelector<HTMLButtonElement>(selector)!.click();
      }
      await new Promise(requestAnimationFrame);
      const panel = element.querySelector<HTMLElement>('.drawer-panel')!;
      const animations = element.getAnimations({ subtree: true });
      const exit = animations.find((animation) => animation instanceof CSSAnimation && animation.animationName === 'drawer-panel-exit');
      if (!exit) throw new Error('抽屉收回动画未启动');
      exit.pause();
      exit.currentTime = 0;
      const start = panel.getBoundingClientRect().left;
      exit.currentTime = 100;
      const middle = panel.getBoundingClientRect().left;
      const stillOpen = element.open;
      const settingsOpen = document.querySelector<HTMLDialogElement>('#settings-title')?.closest('dialog')?.open ?? false;
      exit.currentTime = 200;
      const end = panel.getBoundingClientRect().left;
      const scrim = getComputedStyle(element, '::backdrop').animationName;
      animations.forEach((animation) => animation.finish());
      return { start, middle, end, width: panel.getBoundingClientRect().width, stillOpen, settingsOpen, scrim };
    }, action);
    expect(motion.start).toBeCloseTo(0, 0);
    expect(motion.middle).toBeLessThan(motion.start);
    expect(motion.end).toBeCloseTo(-motion.width, 0);
    expect(motion.stillOpen).toBe(true);
    expect(motion.settingsOpen).toBe(false);
    expect(motion.scrim).toBe('drawer-scrim-exit');
    await expect(drawer).not.toBeVisible();
    await expect(page.getByRole('button', { name: '打开导航菜单' })).toBeFocused();
  }
});
