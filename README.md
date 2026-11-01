# dev.tealun.com

Tealun 摆渡人的项目集网站，部署在 Cloudflare Pages。

- `content/site.json`：全部文字和数据（个人信息、作品、方法、联系方式）。改内容只改这里。
- `src/`：样式、图标、Cloudflare 安全响应头。
- `build.mjs`：把 `content/site.json` 生成为 `dist/index.html`，无需安装依赖。

## 本地预览

```bash
node build.mjs
# 然后用浏览器打开 dist/index.html
```

## 部署（Cloudflare Workers）

- 根目录：`/`（留空）
- 构建命令：`node build.mjs`
- 部署命令：`npx wrangler deploy`（读取 `wrangler.jsonc`，发布 `dist/` 里的静态文件）
- 自定义域名：`dev.tealun.com`

`wrangler.jsonc` 里的 `name` 要和 Cloudflare 后台的 Worker 名称一致。推送到 `main` 即自动发布。

## 作品字段

`works` 里每一项：`size`（`lead` 主打、`normal` 常规、`tool` 开源工具、`minor` 次要）、`name`、`subtitle`、`status`（`live` 已上线、`dev` 开发中、`open` 开源）、`what`、`facts`（标签与数值）、`note`、`code`、`links`。改了数字记得更新 `dataAsOf`。
