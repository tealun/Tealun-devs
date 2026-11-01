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

## 部署（自有服务器）

1. 运行 `node build.mjs`，生成 `dist/`。
2. 把 `dist/` 里的全部文件上传到服务器上 `dev.tealun.com` 站点的网站根目录，覆盖旧文件。

`dist/_headers` 是 Cloudflare 专用的安全响应头文件，普通服务器不会读取，上传时可以不传；需要的话把同样的响应头写进 nginx 配置。

## 作品字段

`works` 里每一项：`size`（`lead` 主打、`normal` 常规、`tool` 开源工具、`minor` 次要）、`name`、`subtitle`、`status`（`live` 已上线、`dev` 开发中、`open` 开源）、`what`、`facts`（标签与数值）、`note`、`code`、`links`。改了数字记得更新 `dataAsOf`。
