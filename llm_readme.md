# TSNav LLM 开发指南

本文件是 TSNav 的开发规范入口。修改代码前应阅读本文件及相关架构文档。

## 1. 项目与职责

TSNav 是基于 SvelteKit 3、Svelte 5、TypeScript、Tailwind CSS v4 和 Google 官方 `@material/web` 的 Material Design 3 网址导航，目标部署平台为 **Cloudflare Pages**。本项目不是浏览器扩展。

当前阶段：基础工程、静态站点数据、客户端搜索和分类，保留 SvelteKit SSR。暂不包含账户、后台管理、数据库和远端用户数据同步。

## 2. 文档入口

- [启动、构建和 Pages 部署](docs/build_setup.md)
- [架构与模块边界](docs/architecture.md)
- [Material Web / Tailwind 兼容约定](docs/material_tailwind.md)
- [国际化架构与文案规范](docs/i18n.md)
- [品牌图标与生成记录](docs/branding.md)
- [路线图](docs/TODO.md)
- [变更日志](docs/Changelog.md)

## 3. 编码规范

### 3.1 文档同步

新增模块、修改目录结构或变更 `src/lib/` 导出 API 时，同步更新对应文档。不要保留失效的架构说明。README 面向项目使用者，本文件面向代码贡献者。

### 3.2 变更记录

每完成一个编码任务，执行 `python3 llm_log.py "简要中文摘要"`，只追加 `llm_log.txt`。用户可感知的阶段变更同时更新 `docs/Changelog.md`。不要把命令未执行或未通过写成已验证。

### 3.3 TypeScript 与注释

- 使用严格 TypeScript，避免 `any` 和通过关闭诊断掩盖问题。
- 内部注释用中文，解释目的、时序与边界，不复述显而易见的代码。
- `src/lib/` 导出的函数、类型、接口、常量和状态使用中文 JSDoc。函数按需写 `@param` / `@returns`。
- 每个 Svelte 组件的 script 顶部写一行职责说明；可复用组件的 props 用类型描述用途和默认值。

### 3.4 Svelte 5

- 内部模块使用 `#lib/*` 子路径映射和显式扩展名；配置集中在 Vite 的 `sveltekit(...)` 插件中。
- 新代码使用 `$props`、`$state`、`$derived`，事件使用 `onclick`、`oninput` 等属性语法。
- 派生值用 `$derived`，不要用 `$effect` 同步同一份状态。局部状态就近保留。
- SSR 不可访问 `window`、`document`、`localStorage`、`customElements`；浏览器行为放在客户端入口或 `onMount`。
- 不通过关闭全局 SSR 来绕过 Web Components 兼容问题。
- 数据与界面分离。可复用 UI 放 `src/lib/components/`（需要时再建立），业务数据放 `src/lib/data/`。

### 3.5 Material Design 与 Tailwind

- 只使用 Tailwind v4、官方 Material Web 和 `src/app.css`，不引入 DaisyUI 或另一套 UI 框架。
- Tailwind 用于布局、间距、响应式和普通内容。Material 组件内部用官方 CSS 自定义属性调整，不依赖穿透 Shadow DOM 的选择器。
- 禁止恢复 `@import 'tailwindcss'`；必须保持分离导入 theme 和 utilities，省略 Preflight。
- 不给 `md-*` 宿主加 `p-*`、`bg-*`、`border-*`、`rounded-*`、`text-*` 来模拟内部主题；宿主只使用宽度、排列等布局工具类。
- 所有颜色使用语义令牌；在 `@theme inline` 中映射 Material 变量，浅深主题跟随系统。
- 组件注册仅在 `src/lib/material/register.ts` 按需导入，并由 `src/hooks.client.ts` 引入；禁止全量 `@material/web/all.js`。
- 新增自定义元素时同步维护 `elements.d.ts`，仅用 `import type` 引入元素类型。事件读取 `currentTarget`，不要假定 Shadow DOM 事件的 `target` 是原生 input。
- 遵循 [兼容文档](docs/material_tailwind.md)；不要用 `!important` 掩盖冲突。

### 3.6 验证与包管理

- **只用 pnpm**。提交 `pnpm-lock.yaml`，禁止生成 npm/yarn 锁文件。版本以 package.json 的 packageManager 和锁文件为准。
- 每个编码任务必须执行 `pnpm check`，涉及工程、样式或部署产物时执行 `pnpm build`。
- Material 注册、样式或交互变更时执行 `pnpm test:e2e`；先构建，浏览器测试使用生产预览。
- 不手工改 `.svelte-kit/`、`node_modules/` 和构建产物。
- 不无差别更新依赖；新增依赖需有实际用途。pnpm 的依赖安装脚本白名单在 `pnpm-workspace.yaml`。

### 3.7 可访问性、数据与安全

- 国际化使用 Paraglide JS 3，默认简体中文并提供英文，遵循 [国际化规范](docs/i18n.md)。所有 UI 文案及无障碍标签必须调用类型化消息函数；同时维护 `messages/zh-CN.json` 和 `messages/en.json` 的键与参数。品牌名与带 lang 的语言自称除外。
- 语言优先读取 Cookie，缺失或无效时回退中文；切换使用 `setLocale()` 默认重载，不自行维护全局语言 store、不关闭 AsyncLocalStorage。
- 分类使用稳定 ID；只保存消息函数引用，禁止模块顶层求值。自动生成的 `src/lib/paraglide/` 不提交、不手改，第三方生成代码不适用中文注释要求。
- 表单有明确 label，键盘焦点可见；筛选状态可读，空结果有恢复路径；尊重减少动态效果偏好。
- 导航用真实链接，外链使用 HTTPS；新标签链接带 `rel="noopener noreferrer"` 并说明打开方式。
- 不引入分析上报，不提交凭据与用户数据；浏览器不能读取服务端秘密。
- 后续若接入用户输入的 URL，先验证协议白名单，拒绝 `javascript:` 等可执行协议。
- 发布命令会写入 Cloudflare 账户，只有用户授权发布时才执行；普通编码任务以本地验证完成。
