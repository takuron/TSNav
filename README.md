# TSNav

一个 Material Design 3 风格的网址导航，基于 SvelteKit + Cloudflare Pages + Tailwind CSS + Google Material Web。

## 本地开发

需要 Node.js 22.17+ 和 pnpm（精确版本见 package.json）。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

```sh
pnpm check
pnpm build
pnpm preview
```

首次运行浏览器测试前安装 Chromium：

```sh
pnpm exec playwright install chromium
pnpm build
pnpm test:e2e
```

已接入 Paraglide JS，中英文可在页头切换，默认中文并保存语言偏好。文案开发见 [国际化说明](docs/i18n.md)。

当前包含 6 个示例站点、搜索、分类筛选、响应式布局和跟随系统的浅深主题。更改站点数据请编辑 `src/lib/data/sites.ts`。

## 部署

已配置 `@sveltejs/adapter-cloudflare` 和 `wrangler.jsonc`。Pages 构建命令为 `pnpm build`，输出目录为 `.svelte-kit/cloudflare`。本项目初始化不自动发布。

完整步骤见 [构建说明](docs/build_setup.md)。开发前阅读 [开发规范](llm_readme.md) 和 [样式兼容说明](docs/material_tailwind.md)。
