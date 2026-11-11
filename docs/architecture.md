# TSNav 架构

## 技术选型

- SvelteKit 3 + Svelte 5：文件路由、SSR、客户端水合和响应式状态。
- TypeScript：严格类型与自定义元素属性、事件类型。
- `@sveltejs/adapter-cloudflare`：产出 Pages Worker 和静态资源。
- Tailwind CSS v4 + Vite 插件：CSS-first 配置，无 v3 的 tailwind.config.js / PostCSS 初始化步骤。
- `@material/web`：官方 Material 3 控件，通过 Lit / Shadow DOM 封装内部样式。
- Playwright：对真实浏览器中的组件升级、事件、令牌继承和移动布局做回归检查。
- Paraglide JS 3：编译期类型化消息、中英文基础能力和按请求隔离的 SSR 语言上下文。详见 [国际化架构](i18n.md)。
- pnpm：唯一包管理器，锁文件固定完整依赖图。

## 目录边界

```text
src/
  app.html                     HTML 壳、语言、元数据
  app.css                      Material 令牌、Tailwind 入口、最小基础样式
  app.d.ts                     SvelteKit App 类型扩展入口
  hooks.client.ts              水合前加载 Material 注册
  hooks.server.ts              i18n 请求上下文、文档语言、响应缓存
  lib/
    components/Sidebar.svelte  固定推荐入口、可定制分类和响应式侧栏
    components/Footer.svelte   页脚、反馈弹窗和返回顶部
    components/NavigationCard.svelte 单张站点卡片
    components/SearchBar.svelte 五引擎搜索、输入与清空
    components/LanguageSwitcher.svelte 语言入口
    types/navigation.ts        分类与站点组件的共享类型
    paraglide/                 自动生成的 i18n API（忽略提交）
    data/sites.ts              保留的早期示例数据（当前主页不引用）
    material/register.ts       仅浏览器执行的按需组件注册
    material/elements.d.ts     Svelte 自定义元素属性和事件类型
  routes/
    +layout.svelte             全局 CSS 和子页面渲染
    +page.svelte               可定制静态内容、分类和访问状态、组件组合
messages/                      中文与英文翻译源
project.inlang/                语言、格式插件与共享编译配置
scripts/check-messages.mjs     翻译资源一致性检查
static/                        不经过打包的公共资源
tests/                        生产预览浏览器集成测试
```

首页 SSR 输出所有静态链接。客户端在水合前注册所需 Web Components。Svelte 管理查询和分类；搜索采用带原生 input 的 M3 Search 表单，Material Web 保留空状态和反馈按钮。没有必要将整页改成 CSR。

## 状态与数据

主页按 `design/main` 实现侧栏、搜索引擎栏与八张快捷卡片。分类和站点数组按本次原型要求直接保存在 `+page.svelte`，使用稳定 ID；除固定推荐入口外，它们属于可定制内容，不进入翻译资源。旧的 `data/sites.ts` 示例暂保留但不再驱动主页。

`selected`、`collapsed` 和 `visited` 由页面持有，卡片集合通过 `$derived` 派生；`query` 和 `engine` 为 SearchBar 内部 `$state`。搜索按所选引擎编码关键词并在新标签页打开，不筛选站点。侧栏切换分类或本次页面中的最近访问；访问记录不持久化。桌面支持折叠侧栏，移动端使用原生模态 dialog 提供焦点约束与 Escape 关闭。设置对话框提供语言切换。

站点采用静态可信 HTTPS 链接。当前没有远程 API、数据库或账户系统；侧栏显示本地访客。死链反馈仅展示原型说明与站点信息复制，不提交数据。仅语言偏好通过 tsnav_locale Cookie 持久化。

## 部署边界

构建使用 Cloudflare Pages adapter，`wrangler.jsonc` 指定 Pages 输出目录，不使用 Workers-only 的 assets 配置。未来增加 KV / D1 等绑定时，需同步 Wrangler 配置、Wrangler 绑定类型和本文件。

## SvelteKit 3 配置约定

工程配置集中在 `vite.config.ts` 的 `sveltekit({ adapter, preprocess })` 中，不保留旧版 `svelte.config.js`。`tsconfig.json` 继承 `$app/tsconfig`；内部模块通过 package.json 的 `#lib/*` 子路径导入映射引用并写出扩展名。当前 TypeScript 使用上游要求的 6.x，不盲目安装不满足 peer 范围的新主版本。

## 国际化边界

服务端 handle 通过 Paraglide 中间件隔离请求语言，并填充 HTML 的 lang/dir；Pages 启用 nodejs_compat。搜索、页脚、设置、反馈、空状态和无障碍提示通过编译消息函数获取文案；侧栏第一项调用 `m.nav_recommended()`，其稳定 ID 固定为 `recommended`。其余原型分类、站点名称与描述硬编码，不随界面语言变化。默认中文，Cookie 可选择英文；不改变现有路由。HTML 禁用共享缓存。生成产物不纳入版本控制，check / build 负责生成与校验。

## SVG 图标

`src/lib/icons/index.ts` 静态注册 Material Symbols Rounded 与 Simple Icons；`Icon.svelte` 以 currentColor 渲染内联 SVG，SSR 可用。站点数据的 icon 字段替代 monogram，保存类型化图标名。来源、许可、扩展方式见 [图标规范](icons.md)。

## 主页组件接口

- `Sidebar`：接收只读 `NavigationCategory[]`、`selected`、`collapsed`（默认 false）和 `onselect` / `ontoggle` / `onsettings` 回调；组件自身管理移动抽屉，并在可定制分类前渲染固定 i18n 推荐入口。
- `NavigationCard`：接收 `NavigationSite` 和可选 `onvisit(id)`，直接输出 SSR 外链；不拦截原生链接行为。
- `SearchBar`：无外部 props，独立管理五个搜索引擎和查询。原生 form 提交触发搜索，空白查询不打开窗口；有内容时显示 ×，清空后恢复输入焦点。输入法组合期间不提交。引擎图标统一 16px；搜索面板内容宽度不超过 600px 时通过 CSS 容器查询只显示当前引擎按钮，完全复用宽屏按钮的样式。点击后打开官方 `md-menu` 顶层浮层，使用 `md-menu-item` 和 `close-menu` 事件统一处理点击与键盘选择，与宽屏共用 `engineId` 状态。菜单关闭后恢复触发按钮焦点，进入宽屏隐藏触发按钮时通过 ResizeObserver 关闭浮层；跨断点保留引擎和查询。
- `Footer`：接收只读 `sites`，自身管理反馈选择、复制状态与返回顶部；没有站点时禁用反馈入口。
- `types/navigation.ts`：导出 `NavigationCategory` 和 `NavigationSite`，只描述内容结构，不保存业务数据。

组件样式仍统一维护在 `src/app.css`，共用 Material 系统语义令牌；没有新增 UI 框架或运行时图标请求。

## 主页高度布局

`.portal` 使用最小 `100dvh`（回退 `100svh`）和纵向 flex，将移动顶栏、主内容与页脚放在同一高度分配中。`.main-wrapper` 占据剩余空间，不单独设置视口最小高度；main 和 footer 不压缩内容，dashboard 通过自动外边距在 main 内整体居中。短内容页脚贴底，长内容撑开文档并正常滚动。main 统一维护上下留白，dashboard 不重复增加留白。移动顶栏只保留菜单按钮；侧栏和抽屉中的品牌、分类和设置保留。

## 移动抽屉动画

移动抽屉继续使用原生 dialog 提供模态、Escape 关闭和焦点恢复。dialog 作为透明的全屏外壳，内部 `.drawer-panel` 承载侧栏内容与个人区域，遮罩关闭按钮为独立的全屏点击区域。每次出现 `[open]` 时面板执行 260ms 从左侧滑入动画，原生 `::backdrop` 同步渐显；面板动画不会移动遮罩点击区域。所有关闭入口统一调用 `closeDrawer()`，先从面板当前位置执行 200ms 滑出与遮罩淡出，通过动画 finished Promise 等待完成后才执行原生 `close()`；分类切换和设置弹窗在抽屉退出后执行。Escape 的原生 cancel 被拦截以走同一流程，重复关闭请求被忽略。`prefers-reduced-motion: reduce` 下禁用面板及遮罩动画。
