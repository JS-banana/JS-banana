# GitHub Readme Stats Static Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate GitHub Readme Stats cards as repository-local SVGs and update the profile README to embed those local files.

**Architecture:** A dedicated GitHub Actions workflow owns the stats card generation and commits `profile/*.svg`. The existing README update workflow continues to own WakaTime and blog content only. README embeds local static SVG files instead of depending on the public Vercel endpoint.

**Tech Stack:** GitHub Actions, `readme-tools/github-readme-stats-action@v1`, Markdown README, existing `secrets.ACCESS_TOKEN`.

---

### Task 1: Add Stats Generation Workflow

**Files:**
- Create: `.github/workflows/readme-stats.yml`
- Create: `profile/.gitkeep`

- [ ] **Step 1: Add the workflow file**

Create `.github/workflows/readme-stats.yml` with:

```yaml
name: Update README Stats Cards

on:
  workflow_dispatch:
  schedule:
    - cron: "45 0 * * *"

permissions:
  contents: write

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Check out repo
        uses: actions/checkout@v4

      - name: Generate top languages card
        uses: readme-tools/github-readme-stats-action@v1
        with:
          card: top-langs
          options: username=JS-banana&hide=handlebars&langs_count=8&layout=compact&exclude_repo=blog,vuepress-theme-vdoing,hexo,hexo-theme-next,images,jack&bg_color=30,e96443,904e95&title_color=fff&text_color=fff
          path: profile/top-langs.svg
          token: ${{ secrets.ACCESS_TOKEN }}

      - name: Generate stats card
        uses: readme-tools/github-readme-stats-action@v1
        with:
          card: stats
          options: username=JS-banana&show_icons=true&theme=radical&layout=compact
          path: profile/stats.svg
          token: ${{ secrets.ACCESS_TOKEN }}

      - name: Commit cards
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add profile/*.svg
          git commit -m "Update README stats cards" || exit 0
          git push
```

- [ ] **Step 2: Keep the output directory present**

Create `profile/.gitkeep` as an empty file so the destination directory exists before the first workflow run.

- [ ] **Step 3: Validate YAML parse**

Run:

```bash
ruby -e 'require "yaml"; YAML.load_file(".github/workflows/readme-stats.yml"); puts "ok"'
```

Expected: `ok`.

### Task 2: Update README Image Sources

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace the remote top languages image**

Change the first GitHub Readme Stats image source from:

```md
https://github-readme-stats.vercel.app/api/top-langs/?username=js-banana&hide=handlebars&langs_count=8&layout=compact&exclude_repo=blog,vuepress-theme-vdoing,hexo,hexo-theme-next,images,jack&bg_color=30,e96443,904e95&title_color=fff&text_color=fff
```

to:

```md
./profile/top-langs.svg
```

- [ ] **Step 2: Replace the remote stats image**

Change the second GitHub Readme Stats image source from:

```md
https://github-readme-stats.vercel.app/api?username=JS-banana&show_icons=true&&theme=radical&layout=compact
```

to:

```md
./profile/stats.svg
```

- [ ] **Step 3: Confirm public endpoint is gone from active README**

Run:

```bash
rg "github-readme-stats\\.vercel\\.app" README.md
```

Expected: only commented historical examples may remain. No active `<img src="https://github-readme-stats.vercel.app/...">` references remain.

### Task 3: Verify Diff and Remote Workflow

**Files:**
- Read: `README.md`
- Read: `.github/workflows/readme-stats.yml`

- [ ] **Step 1: Inspect changed files**

Run:

```bash
git status --short
git diff -- README.md .github/workflows/readme-stats.yml profile/.gitkeep
```

Expected: changes are limited to README card sources, the new workflow, and the output directory placeholder.

- [ ] **Step 2: Trigger the new workflow**

Run:

```bash
gh workflow run "Update README Stats Cards" --repo JS-banana/JS-banana --ref master
```

Expected: workflow dispatch succeeds. If the workflow is not visible until pushed, report that local verification passed and the workflow must be triggered after pushing.

- [ ] **Step 3: If triggered, inspect the run**

Run:

```bash
gh run list --repo JS-banana/JS-banana --workflow "Update README Stats Cards" --limit 1
```

Expected: the newest run is queued, in progress, or completed. If completed with failure, inspect logs before changing code.
