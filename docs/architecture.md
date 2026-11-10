# TSNav 架构

## 技术选型

- SvelteKit 3 + Svelte 5：文件路由、SSR、客户端水合和响应式状态。
- TypeScript：严格类型与自定义元素属性、事件类型。
- `@sveltejs/adapter-cloudflare`：产出 Pages Worker 和静态资源。
- Tailwind CSS v4 + Vite 插件：CSS-first 配置，无 v3 的 tailwind.config.js / PostCSS 初始化步骤。
- `@material/web`：官方 Material 3 控件，通过 Lit / Shadow DOM 封装内部样式。
- Playwright：对真实浏览器中的组件升级、事件、令牌继承和移动布局做回归检查。
- pnpm：唯一包管理器，锁文件固定完整依赖图。

## 目录边界

```text
src/
  app.html                     HTML 壳、语言、元数据
  app.css                      Material 令牌、Tailwind 入口、最小基础样式
  app.d.ts                     SvelteKit App 类型扩展入口
  hooks.client.ts              水合前加载 Material 注册
  lib/
    data/sites.ts              站点结构、分类与示例数据
    material/register.ts       仅浏览器执行的按需组件注册
    material/elements.d.ts     Svelte 自定义元素属性和事件类型
  routes/
    +layout.svelte             全局 CSS 和子页面渲染
    +page.svelte               搜索、分类、导航展示
static/                        不经过打包的公共资源
tests/                        生产预览浏览器集成测试
```

首页 SSR 输出所有静态链接。客户端在水合前注册所需 Web Components，之后 Svelte 管理查询和分类，Material 自身管理输入控件内部交互。没有必要将整页改成 CSR。

## 状态与数据

`query` 和 `category` 是页面局部 `$state`；`filtered` 是 `$derived`。输入事件通过类型化 `event.currentTarget.value` 读取 Material 元素的公开 value。重置操作同时恢复查询和分类。

站点链接采用静态可信 HTTPS 数据。当前没有远程 API、数据库、持久化设置和账户系统。没有跨请求可变全局用户状态。

## 部署边界

构建使用 Cloudflare Pages adapter，`wrangler.jsonc` 指定 Pages 输出目录，不使用 Workers-only 的 assets 配置。未来增加 KV / D1 等绑定时，需同步 Wrangler 配置、平台类型和本文件。

## SvelteKit 3 配置约定

工程配置集中在 `vite.config.ts` 的 `sveltekit({ adapter, preprocess })` 中，不保留旧版 `svelte.config.js`。`tsconfig.json` 继承 `$app/tsconfig`；内部模块通过 package.json 的 `#lib/*` 子路径导入映射引用并写出扩展名。当前 TypeScript 使用上游要求的 6.x，不盲目安装不满足 peer 范围的新主版本。
