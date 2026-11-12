# JSON 导航配置规范

TSNav 使用多文件 JSON 保存默认导航和特定用户导航。配置源文件位于 `static/api/`，静态构建后会原样发布到网站对应的 `/api/` 路径。

## 文件布局

```text
static/api/master.json                  -> /api/master.json
static/api/{slug}.json                  -> /api/{slug}.json
static/api/user/{uuid}/master.json      -> /api/user/{uuid}/master.json
static/api/user/{uuid}/{slug}.json      -> /api/user/{uuid}/{slug}.json
```

`{uuid}` 使用标准 36 位 UUID。默认配置的 `scope` 为 `default`，用户配置的 `scope` 为 `user`。

用户配置入口先读取对应目录下的 `master.json`，再按照 `categories` 注册表读取分类文件。用户配置不存在或校验失败时回退默认配置。

## `master.json`

`master.json` 保存用户信息、站点信息、主页常用链接、显示设置、页脚和顶层分类注册信息。

```json
{
  "version": 1,
  "scope": "default",
  "profile": {
    "username": "default",
    "email": "default@example.com"
  },
  "site": {
    "name": "TSNav",
    "description": "可定制的网址导航",
    "footer": {
      "line1": "TSNav · 发现值得收藏的网站",
      "line2": "内容由配置文件维护"
    }
  },
  "homepage": {
    "commonLinks": []
  },
  "settings": {
    "defaultSearchEngine": "google",
    "theme": "system",
    "language": "zh-CN"
  },
  "categories": [
    {
      "slug": "development",
      "label": "开发与云原生",
      "title": "开发技术与基础架构",
      "description": "开发、云原生和工程效率工具",
      "icon": "md://terminal"
    }
  ]
}
```

`version` 必须是整数。主页直接读取 `site.name` 和 `site.description`，不在 `homepage` 中重复保存。页脚固定支持 `site.footer.line1` 和 `site.footer.line2` 两行，空字符串表示隐藏对应行。

`homepage.commonLinks` 直接内联链接对象，不使用全局链接数组和索引。

## 分类文件

每个顶层分类对应一个 `{slug}.json`。链接直接内联在分类节点的 `links` 数组中，分类可以通过 `children` 继续分组。

```json
{
  "version": 1,
  "scope": "default",
  "slug": "development",
  "category": {
    "label": "开发与云原生",
    "title": "开发技术与基础架构",
    "description": "开发、云原生和工程效率工具",
    "icon": "md://terminal",
    "links": [],
    "children": [
      {
        "id": "frontend",
        "title": "前端与客户端架构",
        "icon": "md://devices",
        "links": [],
        "children": []
      }
    ]
  }
}
```

分类层级从 slug 对应的页面按第 0 层计算。`category` 根节点只是本页面的元信息和直属链接，不计入分组层级；其下最多允许三层 `children` 分组：

```text
第 0 层：slug 对应的分类页面
第 1 层：category.children
第 2 层：category.children[].children
第 3 层：继续向下的 children
```

出现第 4 层或更深的非空 `children` 时，配置非法。只有顶层分类注册信息定义 `slug`；子分组不定义 `slug`、`label` 或 `description`。

每个分类节点可以同时包含 `links` 和 `children`。链接可以重复出现在多个分类中，但每个分类文件只维护自己的内联链接。

## 链接卡片

链接对象至少包含以下字段：

```json
{
  "name": "GitHub",
  "description": "代码托管和协作平台",
  "url": "https://github.com",
  "icon": "icon://github",
  "badge": "常用"
}
```

`badge` 可选。卡片图标统一使用界面的默认 Material 主题样式，不再配置单独的颜色选项。

## 图标格式

分类图标只允许使用项目预载的 Material Design 图标：

```text
md://{id}
```

网站图标允许三种格式：

```text
md://{id}
icon://{id}
https://...
```

- `md://{id}`：Material Design 图标，全部预载入项目。
- `icon://{id}`：Simple Icons，常见图标预载；不常见图标由图标解析器在线获取。
- `https://...`：在线 PNG、JPG/JPEG 或 SVG 图片。

分类图标不得使用 `icon://` 或在线图片。所有站点链接必须使用 `https://`。解析器必须拒绝 `http://`、`javascript:`、`data:` 等协议；在线图片还应校验允许的图片 MIME 类型。

## 构建与代码加载

默认 `master.json` 由 [NavigationConfig](../src/lib/data/config.ts) 在构建时预载入代码。该类提供默认分类路径、用户 `master.json` 路径和用户分类文件路径：

```ts
navigationConfig.defaultMaster;
navigationConfig.categoryPath('development');
navigationConfig.userMasterPath(uuid);
navigationConfig.userCategoryPath(uuid, slug);
```

静态文件由 SvelteKit adapter-static 原样复制到 `build/api/`，因此 `static/api/{file}.json` 与发布后的 `/api/{file}.json` 保持一致。

Vite 构建开始时会扫描 `static/api/**/*.json` 并执行结构校验。所有文件都必须使用 `version: 1`；默认配置文件校验失败会终止构建，用户配置文件校验失败只输出 warning。JSON 会先被解析和校验，再进入构建流程，避免版本或结构异常的内容被直接使用。
