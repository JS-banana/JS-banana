# AGENTS.md

## 项目定位

这是 `JS-banana/JS-banana` GitHub profile 仓库，用来生成和展示个人主页 README。主要产物是根目录 `README.md`，不要把它当成普通应用项目处理。

## 主要自动化

- `build_readme.py` 更新 README 中 `code_time` 和 `blog` 两个 marker 区块。
- `.github/workflows/readme.yml` 每天运行 Python 脚本，并在 README 有变化时提交。
- `.github/workflows/readme-stats.yml` 生成 `profile/top-langs.svg` 和 `profile/stats.svg`，README 直接引用这两个本地 SVG。
- `.github/workflows/snk.yml` 生成贡献蛇图并推送到 `output` 分支。
- `packages/wakatime` 负责把 WakaTime 数据写入 gist；根 README 读取的是 gist raw 内容。

## 修改约束

- 保持改动小而明确。这个仓库的价值是 profile 展示稳定，不需要引入复杂应用结构。
- 不要把 `README.md` 里的自动生成区块改成手写内容；需要改展示数据时优先改对应脚本或 workflow。
- 不要恢复对 `github-readme-stats.vercel.app` 的实际图片依赖；stats 卡片应继续走本地 `profile/*.svg`。
- 使用 token 时只通过 GitHub Secrets 或本地环境变量传入，不要把真实 token 写进代码、README 或 workflow。
- 仓库里可能存在未提交的格式化或本地配置改动；提交前确认只包含本次任务需要的文件。

## 常用验证

```bash
python build_readme.py
ruby -e 'require "yaml"; Dir[".github/workflows/*.yml"].each { |f| YAML.load_file(f); puts "ok #{f}" }'
rg "github-readme-stats\\.vercel\\.app" README.md
```

`rg` 命中 README 注释里的历史示例可以接受；实际展示图片不应再指向公共 `github-readme-stats.vercel.app`。
