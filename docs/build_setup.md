# 启动、检查与 Cloudflare Pages

## 环境

Node.js 22.17+（`.node-version` 固定 22 主版本），pnpm 精确版本见 package.json。项目 `.npmrc` 使用 npm 官方 registry，避免沿用本机不可用镜像。所有依赖以 pnpm-lock.yaml 为准。

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm build
pnpm preview
```

- `dev`：Vite 热更新开发环境。
- `check`：生成 SvelteKit 类型并运行 svelte-check。
- `build`：Cloudflare adapter 产出 `.svelte-kit/cloudflare`，不可手动编辑。
- `preview`：本地预览生产构建。
- `pages:dev`：构建后以 Wrangler Pages 本地模拟运行，部署前可检查平台行为。

首次浏览器测试运行 `pnpm exec playwright install chromium`，系统缺失浏览器依赖时按 Playwright 提示安装。运行 `pnpm build && pnpm test:e2e`；测试自行启动 4173 端口的生产预览。

## Pages Git 集成

1. 将仓库推送到你的 Git 提供商，在 Cloudflare Pages 新建并连接仓库。
2. 框架选择 SvelteKit，根目录为项目根目录。
3. 构建命令：`pnpm build`；构建输出：`.svelte-kit/cloudflare`。
4. 在构建环境设置 `NODE_VERSION=22`，`PNPM_VERSION` 与 package.json 的 packageManager 保持一致。
5. 当前无必需的应用环境变量或外部数据绑定。

## CLI 部署（需要授权与账户）

`wrangler.jsonc` 的 name 默认 tsnav。首次使用应在 Cloudflare 账户中创建或确认同名 Pages 项目。名称冲突时同步修改配置与命令中的项目名。

```sh
pnpm exec wrangler login
pnpm exec wrangler pages project create tsnav
pnpm deploy
```

`deploy` 依次执行检查、构建与 `wrangler pages deploy`，输出目录从 Wrangler 配置读取。只有真正发布时才运行；初始化不会自动创建云端资源。

## 凭据与绑定

不要提交 `.env*`、`.dev.vars*`、Cloudflare token 或账户凭据。以后增加 Pages 绑定时，同步更新 Wrangler 配置与 Wrangler 生成的绑定类型，再用 pages:dev 验证。服务器秘密不得以 PUBLIC_ 前缀暴露给前端。

参考：[Cloudflare 官方 SvelteKit Pages 指南](https://developers.cloudflare.com/pages/framework-guides/deploy-a-svelte-kit-site/)。

## i18n 构建

已接入 Paraglide JS 3。`pnpm check` 自动校验并编译语言资源，再进行类型检查；`pnpm build` 自动校验资源并由 Vite 编译消息。翻译源与 project.inlang 配置必须提交，src/lib/paraglide 是生成目录，禁止手改。格式插件使用锁文件中的本地依赖，无构建时 CDN 下载。Pages 的 nodejs_compat 用于 AsyncLocalStorage 请求语言隔离，不应移除。详见 [国际化架构](i18n.md)。
