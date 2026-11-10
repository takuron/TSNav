# 变更日志

## 0.1.0 · 2026-11-10

- 初始化 SvelteKit、Svelte 5、TypeScript 和 pnpm 工程。
- 接入 Cloudflare Pages、Tailwind v4 和官方 Material Web。
- 通过省略 Preflight、共享语义令牌和客户端注册划分样式与 SSR 边界。
- 提供站点搜索、分类、响应式首页和系统浅深主题。
- 将旧浏览器扩展指南改写为 TSNav 开发规范，增加构建、架构和兼容文档。

## 2026-11-10 · 默认主题更新

- 按两份原型 DESIGN.md 的结构化色表设置 Azure 亮暗默认主题，补齐 Material 与 Tailwind 语义颜色角色，未实现原型页面。

## 2026-11-10 · 国际化基础

- 接入 Paraglide JS 3，中英文翻译资源覆盖现有页面与无障碍文案，新增语言切换入口。
- 默认中文、Cookie 保存偏好，服务端按请求隔离语言，并输出正确的 HTML lang / dir。
- 为 Cloudflare Pages 启用 nodejs_compat，并为多语言 HTML 设置缓存边界。
- 增加资源一致性检查、生成流程和国际化开发规范，以及语言切换、回退和并发 SSR 回归测试。
