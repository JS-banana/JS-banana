#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# cd packages/wakatime

npm install

npm run build

# cd - # 退回开始所在目录
