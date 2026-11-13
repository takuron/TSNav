# TSNav 架构

## 技术选型

- SvelteKit 3 + Svelte 5：文件路由、构建时预渲染、客户端水合和响应式状态。
- TypeScript：严格类型与自定义元素属性、事件类型。
- `@sveltejs/adapter-static`：产出可直接部署的静态资源。
- Tailwind CSS v4 + Vite 插件：CSS-first 配置，无 v3 的 tailwind.config.js / PostCSS 初始化步骤。
- `@material/web`：官方 Material 3 控件，通过 Lit / Shadow DOM 封装内部样式。
- Playwright：对真实浏览器中的组件升级、事件、令牌继承和移动布局做回归检查。
- 单语言中文文案：界面文字集中在 `src/lib/copy.ts`，站点数据与界面文案分离。
- pnpm：唯一包管理器，锁文件固定完整依赖图。

## 目录边界

```text
src/
  app.html                     HTML 壳、语言、元数据
  app.css                      Material 令牌、Tailwind 入口、最小基础样式
  app.d.ts                     SvelteKit App 类型扩展入口
  hooks.client.ts              水合前注册 Material Web 组件
  lib/
    components/PortalShell.svelte 主页与分类页共享外壳、设置及折叠状态
    components/Sidebar.svelte  固定推荐入口、可定制分类和响应式侧栏
    components/Footer.svelte   页脚、反馈弹窗和返回顶部
    components/NavigationCard.svelte 单张站点卡片
    components/SearchBar.svelte 五引擎搜索、输入与清空
    types/navigation.ts        分类与站点组件的共享类型
    data/config.ts             编译期与 URL 配置加载及路径模型
    data/navigation-config.ts  配置到界面显示模型的适配
    copy.ts                    单语言界面文案
    material/register.ts       仅浏览器执行的按需组件注册
    material/elements.d.ts     Svelte 自定义元素属性和事件类型
  routes/
    +layout.svelte             全局 CSS 和子页面渲染
    +page.svelte               主页站点、本地分类筛选与访问状态
    category/[slug]/+page.ts   解析动态分类标识，不存在返回 404
    category/[slug]/+page.svelte 递归分类目录与分层卡片
  +layout.ts                   开启全站预渲染
static/                        不经过打包的公共资源
tests/                        生产预览浏览器集成测试
```

首页 预渲染输出所有静态链接。客户端在水合前注册所需 Web Components。Svelte 管理查询和分类；搜索采用带原生 input 的 M3 Search 表单，Material Web 保留空状态和反馈按钮。没有必要将整页改成 CSR。

## 状态与数据

主页按 `design/main` 实现侧栏、搜索引擎栏与八张快捷卡片。主页站点数组保存在 `+page.svelte`；侧栏分类和子分类目录由 `data/navigation-config.ts` 从配置文件生成，使用稳定 ID；除固定推荐入口外，它们属于可定制内容，不进入翻译资源。站点内容保存在主页和分类静态配置中，未来可替换为独立的数据获取逻辑。

`selected` 和 `visited` 由主页持有，`collapsed` 由 `PortalShell` 持有且默认收起，并通过 `localStorage` 记忆，卡片集合通过 `$derived` 派生；`query` 和 `engine` 为 SearchBar 内部 `$state`。搜索按所选引擎编码关键词并在新标签页打开，不筛选站点。侧栏切换分类或本次页面中的最近访问；访问记录不持久化。桌面支持折叠侧栏，移动端使用原生模态 dialog 提供焦点约束与 Escape 关闭。

站点采用静态可信 HTTPS 链接。当前没有远程 API、数据库或账户系统；侧栏显示本地访客。死链反馈仅展示原型说明与站点信息复制，不提交数据。不保存语言偏好。

## 部署边界

构建使用 adapter-static，`wrangler.jsonc` 指定 Pages 输出目录，不使用 Workers-only 的 assets 配置。未来增加 KV / D1 等绑定时，需同步 Wrangler 配置、Wrangler 绑定类型和本文件。

JSON 导航配置的字段、文件布局和校验规则见 [JSON 导航配置规范](navigation-config.md)。

## SvelteKit 3 配置约定

工程配置集中在 `vite.config.ts` 的 `sveltekit({ adapter, preprocess })` 中，不保留旧版 `svelte.config.js`。`tsconfig.json` 继承 `$app/tsconfig`；内部模块通过 package.json 的 `#lib/*` 子路径导入映射引用并写出扩展名。当前 TypeScript 使用上游要求的 6.x，不盲目安装不满足 peer 范围的新主版本。

## 文案边界

HTML 固定使用中文 `lang="zh-CN"` 和 `dir="ltr"`。界面文案集中在 `src/lib/copy.ts`，主页和分类页的数据结构保持静态示例，未来可替换为独立的数据获取逻辑。静态 HTML 可由 CDN 直接缓存。

## SVG 图标

`src/lib/icons/index.ts` 静态注册 Material Symbols Rounded 与 Simple Icons；`Icon.svelte` 以 currentColor 渲染内联 SVG，静态预渲染可用。站点数据的 icon 字段替代 monogram，保存类型化图标名。来源、许可、扩展方式见 [图标规范](icons.md)。

## 主页组件接口

- `Sidebar`：接收只读 `NavigationCategory[]`、`selected`、`collapsed`（默认 true）和 `onselect` / `ontoggle` 回调；组件自身管理移动抽屉，并在可定制分类前渲染固定推荐入口。
- `NavigationCard`：主页和分类页共用同一张卡片，接收 `NavigationSite`、可选 `onvisit(id)` 和 `headingLevel`（默认 2）。访问图标默认隐藏，仅悬停或键盘焦点显示；说明固定为最多两行并省略；直接输出静态外链。`NavigationCardGrid` 负责按实际容器宽度使用 1 / 2 / 3 / 4 列；主页最多 5 列并限制主网格宽度，分类分组达到 5 张卡片时切换按最小卡片宽度自动流式换列。
- `SearchBar`：无外部 props，独立管理五个搜索引擎和查询。原生 form 提交触发搜索，空白查询不打开窗口；有内容时显示 ×，清空后恢复输入焦点。输入法组合期间不提交。引擎图标统一 16px；搜索面板内容宽度不超过 600px 时通过 CSS 容器查询只显示当前引擎按钮，完全复用宽屏按钮的样式。点击后打开官方 `md-menu` 顶层浮层，使用 `md-menu-item` 和 `close-menu` 事件统一处理点击与键盘选择，与宽屏共用 `engineId` 状态。菜单关闭后恢复触发按钮焦点，进入宽屏隐藏触发按钮时通过 ResizeObserver 关闭浮层；跨断点保留引擎和查询。
- `Footer`：接收只读 `sites`，自身管理反馈选择、复制状态与返回顶部；没有站点时禁用反馈入口。
- `types/navigation.ts`：导出 `NavigationCategory`、`NavigationSite`、递归 `CategorySection` 和 `CategoryPage`，只描述内容结构，不保存业务数据。
- `PortalShell`：接收 `categories`、`selected`、`onselect`、`sites`、内容 snippet 与 `variant`（home / directory），统一渲染侧栏、页脚、移动抽屉及设置。

组件样式仍统一维护在 `src/app.css`，共用 Material 系统语义令牌；没有新增 UI 框架或运行时图标请求。

## 主页高度布局

`.portal` 使用最小 `100dvh`（回退 `100svh`）和纵向 flex，将移动顶栏、主内容与页脚放在同一高度分配中。`.main-wrapper` 占据剩余空间，不单独设置视口最小高度；main 和 footer 不压缩内容，dashboard 通过自动外边距在 main 内整体居中。短内容页脚贴底，长内容撑开文档并正常滚动。main 统一维护上下留白，dashboard 不重复增加留白。移动顶栏只保留菜单按钮；侧栏和抽屉中的品牌与分类保留。

## 移动抽屉动画

移动抽屉继续使用原生 dialog 提供模态、Escape 关闭和焦点恢复。dialog 作为透明的全屏外壳，内部 `.drawer-panel` 承载侧栏内容与个人区域，遮罩关闭按钮为独立的全屏点击区域。每次出现 `[open]` 时面板执行 260ms 从左侧滑入动画，原生 `::backdrop` 同步渐显；面板动画不会移动遮罩点击区域。所有关闭入口统一调用 `closeDrawer()`，先从面板当前位置执行 200ms 滑出与遮罩淡出，通过动画 finished Promise 等待完成后才执行原生 `close()`；分类切换和设置弹窗在抽屉退出后执行。Escape 的原生 cancel 被拦截以走同一流程，重复关闭请求被忽略。`prefers-reduced-motion: reduce` 下禁用面板及遮罩动画。

## 动态分类路由与可定制名称

分类页使用 `/category/[slug]`，当前示例为 `/category/development`。页面复现 `design/child` 的多级分组、桌面四列卡片、两行说明及缩进；主页面最多 5 列并限制网格最大宽度；分类页分组默认按 1 / 2 / 3 / 4 列，达到 5 张卡片时使用 220px 最小宽度的 auto-fit 流式策略，小屏自动回落单列。目录页从顶部排列，主页仍整体居中。

分类配置分开存储 `id`（稳定标识 dev）、`label`（侧栏显示名）、`title`（页标题）与 `slug`（URL 标识 development）。改显示名不会改变 URL 或选中状态，slug 支持中文与空格并在生成链接时由 `encodeURIComponent` 编码。每个配置应有唯一的 id 和 slug；slug 是单个路径段，而非任意 URL。

`data/navigation-config.ts` 的导出 API：

- `categoryPages`：静态原型配置，包含递归 children / sites。新增分类只需配置数据，通用页面没有 development 分支。
- `findCategoryBySlug(slug, pages = categoryPages)`：按已解码 slug 精确查找；不以显示名称猜测、不回退为默认分类。可注入后续用户配置数据源。
- `categoryPath(id, pages = categoryPages)`：按稳定 ID 生成编码后的分类路由；未配置独立页返回 undefined。
- `navigationCategories`：固定推荐入口之外的侧栏静态内容；注册的分类页自动生成真实 href，其他入口保留本地筛选。
- `collectCategorySites(sections)`：递归收集站点，供共享页脚反馈选择使用。

`category/[slug]/+page.ts` 在静态页面 / 客户端导航时使用同一解析规则，未知 slug 返回 HTTP 404。不要再次手动解码路由参数，也不把显示名称硬编码成路由分支。以后接入用户配置时，替换分类数据来源并在写入配置时检查标识唯一性即可。

已注册分类在侧栏使用真实链接，保留修饰键新标签行为；普通点击等待移动抽屉退场后通过页面回调导航。分类页返回常用推荐使用 `/`，返回未注册独立页的分类使用 `/?category=<稳定 ID>`，由主页初始化对应本地筛选。
