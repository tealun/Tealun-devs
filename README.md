# dev.tealun.com

Tealun 的项目集网站。纯静态页面，没有构建步骤，部署在 Cloudflare Pages。

- `index.html`：全部内容
- `styles.css`：样式（不加载外部字体，保证国内访问速度）
- `favicon.svg`、`_headers`（Cloudflare Pages 的安全响应头）

## 部署

Cloudflare Pages 连接本仓库：构建命令留空，输出目录填 `/`。推送到 `main` 即自动发布。
自定义域名：在 Pages 项目的 Custom domains 里添加 `dev.tealun.com`。
