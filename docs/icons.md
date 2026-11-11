# 内置 SVG 图标

界面采用 Google 官方 Material Symbols Rounded 图形，使用第三方 Iconify 数据封装 `@iconify-icons/material-symbols`，不是 Google 官方发布的 npm 包。品牌采用 Simple Icons（`@iconify-icons/simple-icons`），简洁单色便于继承亮暗主题的 currentColor。

参考 TSTab 的 dashboard-icons 离线内置思路，本项目不读取姊妹项目运行时文件、不在线请求 favicon 或 Iconify API。全部使用静态单图标子路径导入，SSR 直接输出 SVG；不导入整套图标集合。

- 注册表：`src/lib/icons/index.ts`，导出 materialIcons、brandIcons、icons 与 IconName。
- 渲染组件：`src/lib/components/Icon.svelte`，参数 name（类型化名称）、size（默认24）、label（可选本地化无障碍名称）、class。
- 静态内置搜索、侧栏分类、折叠、历史、反馈与返回顶部等 Material Symbols Rounded 图标，以及 GitHub、Svelte、Cloudflare、Material Design、Figma、MDN、Google、YouTube、Wikipedia、Stack Overflow、Vercel 品牌图标。主页卡片混合使用品牌图形与原型中的语义图形。

```svelte
<Icon name="search" />
<Icon name="github" size={24} class="text-primary" />
```

装饰图标默认 aria-hidden；独立语义图标的 label 必须来自 i18n。按钮或链接仍需自身可访问名称。组件只允许注册表中的 SVG，禁止把外部内容传给 @html。

新增图标在注册表静态导入具体子路径。数据包的 exports 不带 .js；项目自身 #lib 导入仍使用显式扩展名。注册表内的图标会随应用打包，保持有限集合，不把整个包动态加载进客户端。

站点的 icon 字段保存 IconName；当前为显式绑定，不包含自动域名识别功能。

## 来源与许可

- [Google Material Symbols](https://github.com/google/material-design-icons)：Apache-2.0，许可见 licenses/material-symbols.md。
- [Simple Icons](https://github.com/simple-icons/simple-icons)：CC0-1.0，许可见 licenses/simple-icons.md；品牌商标及单个品牌使用规范仍需遵守。
