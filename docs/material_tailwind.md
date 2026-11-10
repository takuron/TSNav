# Material Web 与 Tailwind CSS 兼容方案

## 问题边界

两者并非整体不兼容。Material 组件的内部样式封装在 Shadow DOM 中，普通 Tailwind 选择器不能穿透；但全局基础样式仍可影响宿主、继承属性和 Light DOM 插槽。给宿主设置背景、内边距、字体大小也不等于给内部按钮或输入框设置主题。

此外，Material 的元素注册会访问浏览器环境，直接在通用 layout / page 中导入会影响 SvelteKit SSR。延迟到 onMount 才注册又容易造成属性在升级前写入的问题。

## 已落实的方案

1. `app.css` 分别导入 `tailwindcss/theme.css` 和 `tailwindcss/utilities.css`，不导入 Preflight。只在 base 层对 html、body、普通标题/段落和链接做有限调整，不使用通配符、button、input 的全局重置。
2. 层顺序固定为 `theme, base, components, utilities`。不关闭 Tailwind 功能，不使用全局 important。
3. Material 使用 `--md-sys-color-*`、`--md-ref-typeface-*` 和官方组件令牌。Tailwind 通过 `@theme inline` 共享 primary / muted / outline 等变量；不要复制出第二套颜色表。
4. Material 内部样式用公开令牌设置，例如搜索框的 `--md-outlined-text-field-container-shape`；Tailwind `w-full max-w-xl` 只负责宿主布局。不要尝试用 `rounded-*` 修改内部 field。
5. `hooks.client.ts` 同步导入注册模块，确保水合开始前元素已定义；SSR 不执行该入口。没有关闭 SSR，也没有把 `@material/web` 作为 CDN 脚本加载。
6. `elements.d.ts` 对项目用到的元素逐个声明类型，只使用类型导入。Material 的 value 通过属性传入，oninput 通过 currentTarget 读取，不用只适用于原生输入的 bind:value。
7. 未定义控件暂时 visibility:hidden，并给搜索框保留最小高度；内容链接仍由 SSR 输出。禁用 JS 时搜索不可用，提供 noscript 提示，站点链接仍可访问。

## 验证

```sh
pnpm check
pnpm build
pnpm exec playwright install chromium # 首次
pnpm test:e2e
```

自动化覆盖 SSR 链接输出、Material Shadow DOM 输入、搜索和分类组合、空结果重置、浅深主题令牌继承、390px 宽视口溢出以及交互过程中的浏览器异常。测试不等于全浏览器兼容证明；上线前仍需目标浏览器实际检查。

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
