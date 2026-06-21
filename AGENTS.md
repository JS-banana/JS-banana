# AGENTS.md

## 项目定位

这是 `JS-banana/JS-banana` GitHub profile 仓库，用来生成和展示个人主页 README。主要产物是根目录 `README.md`，不要把它当成普通应用项目处理。

## 主要自动化

- `.github/workflows/readme-stats.yml` 生成 `profile/top-langs.svg` 和 `profile/stats.svg`，README 直接引用这两个本地 SVG。
- `.github/workflows/snk.yml` 生成贡献蛇图并推送到 `output` 分支。
- WakaTime 展示图由 [`JS-banana/dev-stats`](https://github.com/JS-banana/dev-stats) 仓库维护，README 通过 raw URL 引用其 SVG。

## 修改约束

- 保持改动小而明确。这个仓库的价值是 profile 展示稳定，不需要引入复杂应用结构。
- 需要改 WakaTime 展示时，改 `dev-stats` 仓库而非本仓库 README 手写内容。
- 不要恢复对 `github-readme-stats.vercel.app` 的实际图片依赖；stats 卡片应继续走本地 `profile/*.svg`。
- 使用 token 时只通过 GitHub Secrets 或本地环境变量传入，不要把真实 token 写进代码、README 或 workflow。
- 仓库里可能存在未提交的格式化或本地配置改动；提交前确认只包含本次任务需要的文件。

## 常用验证

```bash
ruby -e 'require "yaml"; Dir[".github/workflows/*.yml"].each { |f| YAML.load_file(f); puts "ok #{f}" }'
rg "github-readme-stats\\.vercel\\.app" README.md
```

`rg` 命中 README 注释里的历史示例可以接受；实际展示图片不应再指向公共 `github-readme-stats.vercel.app`。
