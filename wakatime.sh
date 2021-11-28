#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

cd packages/wakatime

npm install

npm run build

# Git
# cd ../../
# nowDate=$(date "+%Y-%m-%d %H:%M:%S")
# githubUrl=https://JS-banana:${ACCESS_TOKEN}@github.com/JS-banana/JS-banana.git

# git config --global user.name "JS-banana"
# git config --global user.email "sss213018@163.com"

# git init
# git add -A
# git commit -m "update time.txt => ${nowDate}"
# git pull
# git push -f $githubUrl master:master # 推送到github


cd - # 退回开始所在目录
