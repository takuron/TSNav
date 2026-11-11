# Material Web 与 Tailwind CSS 兼容方案

## 问题边界

两者并非整体不兼容。Material 组件的内部样式封装在 Shadow DOM 中，普通 Tailwind 选择器不能穿透；但全局基础样式仍可影响宿主、继承属性和 Light DOM 插槽。给宿主设置背景、内边距、字体大小也不等于给内部按钮或输入框设置主题。

此外，Material 的元素注册会访问浏览器环境，直接在通用 layout / page 中导入会影响 SvelteKit SSR。延迟到 onMount 才注册又容易造成属性在升级前写入的问题。

## 已落实的方案

1. `app.css` 分别导入 `tailwindcss/theme.css` 和 `tailwindcss/utilities.css`，不导入 Preflight。只在 base 层对 html、body、普通标题/段落和链接做有限调整，不使用通配符、button、input 的全局重置。
2. 层顺序固定为 `theme, base, components, utilities`。不关闭 Tailwind 功能，不使用全局 important。
3. Material 使用 `--md-sys-color-*`、`--md-ref-typeface-*` 和官方组件令牌。Tailwind 通过 `@theme inline` 共享 primary / muted / outline 等变量；不要复制出第二套颜色表。
4. Material 内部样式用公开令牌设置，例如 Material 按钮的 `--md-filled-button-container-shape`；Tailwind `w-full max-w-xl` 只负责宿主布局。不要尝试用 `rounded-*` 修改内部 field。
5. `hooks.client.ts` 同步导入注册模块，确保水合开始前元素已定义；SSR 不执行该入口。没有关闭 SSR，也没有把 `@material/web` 作为 CDN 脚本加载。
6. `elements.d.ts` 对项目用到的元素逐个声明类型，只使用类型导入。Material 的 value 通过属性传入，oninput 通过 currentTarget 读取，不用只适用于原生输入的 bind:value。
7. 未定义控件暂时 visibility:hidden，；当前搜索框是原生表单，SSR 即可显示；内容链接仍由 SSR 输出。禁用 JS 时搜索不可用，提供 noscript 提示，站点链接仍可访问。

## 验证

```sh
pnpm check
pnpm build
pnpm exec playwright install chromium # 首次
pnpm test:e2e
```

当前主页自动化覆盖八张卡片的 SSR 链接输出、原生 M3 Search 输入与五引擎搜索、侧栏分类和折叠、最近访问空状态恢复、浅深主题令牌继承、320–1440px 视口溢出、移动抽屉及交互过程中的浏览器异常。测试不等于全浏览器兼容证明；上线前仍需目标浏览器实际检查。

## 上游说明

官方仓库当前标注 Material Web 处于维护模式。本项目遵循用户指定技术栈继续使用它，采用按需注册和独立类型入口，后续替换组件时可控制影响范围。升级依赖前重新验证。

参考官方资料：

- [Tailwind Preflight 与禁用方式](https://tailwindcss.com/docs/preflight)
- [Material Web 设计令牌](https://material-web.dev/theming/material-theming/)
- [Material Web 按需导入](https://material-web.dev/about/quick-start/)
- [Material Web 项目与维护状态](https://github.com/material-components/material-web)
- [SvelteKit 客户端 hooks](https://svelte.dev/docs/kit/hooks)

## 本次验证记录（2026-11-10）

- `pnpm check`：0 错误、0 警告。
- `pnpm build`：成功生成 Cloudflare Pages Worker 与静态资源。
- `pnpm peers check`：无 peer dependency 冲突。
- `pnpm install --frozen-lockfile --offline`：通过。
- `pnpm test:e2e`：Chromium 下 4 项测试全部通过（含 Material 按钮 Enter 键激活）。
- 尚未部署到 Cloudflare 账户，未验证线上域名与目标浏览器的完整矩阵。

受限工作区执行检查时，可用 `WRANGLER_LOG_PATH=/tmp/tsnav-wrangler.log` 将 Wrangler 日志写入可写目录；这只影响本地诊断日志，不改变构建或部署配置。

## 默认主题配色来源

亮色取自 `design/main/DESIGN.md`、暗色取自 `design/child-dark/DESIGN.md` 的完整 `colors` 色表。正文示例有不同取值，统一优先结构化色表。亮色 primary 为 `#006194`、surface 为 `#f7f9fb`；暗色 primary 为 `#c3e8ff`、surface 为 `#101418`。所有色表角色（包括 fixed、surface-tint、background）均映射到 Material 系统变量和 Tailwind 语义颜色，继续跟随系统主题；shadow / scrim 保持黑色。仅配置全局颜色，不实现原型布局、字体或组件样式。

## 主页原型验证（2026-11-11）

- `pnpm check`：0 错误、0 警告。
- `pnpm build`：成功生成 Cloudflare Pages 产物。
- `pnpm test:e2e`：Chromium 下 7 项测试全部通过。
- 搜索框圆角使用 28px；Material 会用 shape 令牌计算内部留白，不能用 999px 模拟胶囊，否则会挤掉输入区。
- 未部署到 Cloudflare。

## M3 Search 调整（2026-11-11）

主页搜索改为 `SearchBar.svelte` 中的原生 form + input，不再用 Outlined Text Field 模拟 Search，因此移除未使用的 Material textfield 注册与类型。搜索栏为 56px 高、全圆角、surface-container-high 背景，正文为 16px / 24px，左侧 24px 搜索图形，右侧有内容时显示 24px 清空图形，其点击区域为 48px。没有浮动标签或右侧搜索提交按钮；回车提交，清空恢复焦点。焦点环使用 secondary 令牌，输入框通过 aria-label 提供可访问名称。

参考：[M3 Search](https://m3.material.io/components/search/overview)、[Google 官方 SearchBarTokens](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/SearchBarTokens.kt)。网页规范需要 JavaScript，尺寸与颜色角色另核对官方源代码。此处仅实现导航主页需要的搜索栏，不实现本地搜索建议或结果视图。

验证：`pnpm check` 0 错误、0 警告；`pnpm build` 成功；`pnpm test:e2e` 8 项全部通过，包括五引擎搜索、原生输入令牌继承、条件清空、焦点恢复与固定推荐入口国际化。

## 搜索栏窄屏适配（2026-11-11）

搜索面板设置 `container: search-panel / inline-size`；早期内容宽度 ≤600px 时隐藏引擎按钮组并显示原生 select（现已由下述 Material 菜单方案替代）。两种入口共享稳定 `engineId`，通过 `$derived` 获取引擎对象；没有额外的视口监听或双份状态。SVG 统一为 16px，下拉框有 44px 点击高度，并显示当前引擎图标。移动布局不播放主内容区 margin-left 位移动画，避免跨断点时短暂横向溢出。

验证：`pnpm check` 0 错误、0 警告；`pnpm build` 成功；`pnpm test:e2e` 9 项全部通过，新增窄屏五引擎搜索及跨断点状态同步回归。

## 引擎菜单改为官方 Material Web（2026-11-11）

移动入口复用桌面 `.engine-tab` 的字体、16px 图标、间距、胶囊形状和选中底色，不再渲染原生 select，也不添加箭头或扩大按钮。使用官方 `md-menu` / `md-menu-item`（仅客户端按需注册），`positioning="popover"` 避免浮层被容器或卡片遮挡。菜单通过公开令牌设为 24px 圆角、三级阴影、surface-container-low 底色和 48px 行高，选中项带勾选标记，悬停由官方 ripple 状态层处理。

菜单项使用 `close-menu` 事件区分点击选择、Enter / Space 确认与 Escape 取消；不能仅监听 click，否则键盘选择不会更新引擎。触发按钮通过 opening / closed 事件同步 aria-expanded，在关闭动画结束前不重新打开。支持方向键导航、键入定位、Escape / 外部点击关闭与焦点恢复，并按减少动态效果偏好跳过动画。隐藏移动入口时关闭浮层。

参照：[Material Web Menus](https://material-web.dev/components/menu/) 及用户提供的浮层菜单截图。菜单组件类型同步维护在 `elements.d.ts`，所有样式通过公开令牌配置，不穿透 Shadow DOM。

本次验证：`pnpm check` 0 错误、0 警告；`pnpm build` 成功；`pnpm test:e2e` 10 项全部通过，覆盖移动与桌面按钮样式一致、五引擎菜单搜索、方向键选择及菜单关闭与焦点恢复。


## 导航网格与侧栏色彩（2026-11-11）

主页网格最大宽度为 1240px，容器宽度达到 1088px 时最多 5 列；分类页的分组在站点数量达到 5 个时使用 `repeat(auto-fit, minmax(220px, 1fr))`，每个额外的可用卡片空间自动产生一列。两者均使用容器查询，避免依赖整个视口宽度。侧栏桌面展开、折叠和移动抽屉共享 `--sidebar-surface: var(--md-sys-color-surface-container-low)`，随浅深主题统一变化。
