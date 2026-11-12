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

装饰图标默认 aria-hidden；独立语义图标的 label 必须来自 `src/lib/copy.ts`。按钮或链接仍需自身可访问名称。组件只允许注册表中的 SVG，禁止把外部内容传给 @html。

新增图标在注册表静态导入具体子路径。数据包的 exports 不带 .js；项目自身 #lib 导入仍使用显式扩展名。注册表内的图标会随应用打包，保持有限集合，不把整个包动态加载进客户端。

配置文件的 icon 字段保存 `md://{id}`、`icon://{id}` 或受限的 `https://` 图片地址。所有已使用的 Material 图标由 `@iconify-icons/material-symbols` 静态导入并随应用本地缓存；项目登记的常见 Simple Icons 也静态导入，本地优先。未登记的 `icon://{id}` 由 `iconSource()` 标记为 `simple-online`，交给后续受控在线加载逻辑；不允许把未信任的 SVG 直接交给 `{@html}`。

图标 ID 查询页面：

- Material Design Icons：[Google Material Symbols](https://fonts.google.com/icons)
- Simple Icons：[Simple Icons 图标目录](https://simpleicons.org/)
- Simple Icons 图标数据：[Simple Icons GitHub](https://github.com/simple-icons/simple-icons/tree/develop/data/icons)

查询到的 Material 名称去掉空格并转换为项目注册表 ID，例如 `code blocks` 对应 `md://codeBlocks`；Simple Icons 使用目录中的 slug，例如 GitHub 对应 `icon://github`。当前注册表中的 Material 图标全部本地缓存，Simple Icons 注册表维护常用品牌的本地缓存，未缓存品牌才允许在线获取。

## 来源与许可

- [Google Material Symbols](https://github.com/google/material-design-icons)：Apache-2.0，许可见 licenses/material-symbols.md。
- [Simple Icons](https://github.com/simple-icons/simple-icons)：CC0-1.0，许可见 licenses/simple-icons.md；品牌商标及单个品牌使用规范仍需遵守。

## 搜索引擎图标

`SearchBar.svelte` 统一使用 Simple Icons 的 `google`、`baidu`、`microsoftbing`、`sogou`、`duckduckgo` 品牌 SVG，替换早期字母和通用搜索图形。它们由现有锁定依赖静态导入注册表，通过 `Icon.svelte` 以 16px 渲染并继承主题颜色，不请求远程 favicon。

来源：[Simple Icons](https://github.com/simple-icons/simple-icons)，通过当前 `@iconify-icons/simple-icons` 包获取；许可沿用 `licenses/simple-icons.md`。

引擎菜单选中项使用注册表中的 Material Symbols Rounded `check` 图标；按钮与菜单中的品牌 SVG 保持 16px。

分类目录按 design/child 原型补充 devices、dns、hub、code、codeBlocks、viewQuilt、bolt、cycle、spa、speed、hexagon、anchor、deployedCode、accountTree、sourceNotes、bugReport、api 等 Material Symbols Rounded 图标；仍通过有限静态注册表与 Icon.svelte 渲染，不使用在线字体或外部 SVG。

Simple Icons 使用 `src/lib/icons/index.ts` 中的 `brandColors` 保留官方品牌色；Material 图标和未登记的在线图标继续继承当前主题色。
