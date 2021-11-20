// 获取环境变量
import dotenv from "dotenv";
dotenv.config();
// Github API 工具：Octokit
import Octokit from "@octokit/rest";
// fetch
import fetch from "node-fetch";
import { trimRightStr, generateBarChart } from "./util.js";

// 常量
// https://wakatime.com/developers
const URL = "https://wakatime.com/api/v1/users/current/stats/last_7_days";
const { GIST_ID: gistId, GH_TOKEN: githubToken, WAKATIME_API_KEY: wakatimeApiKey } = process.env;
const octokit = new Octokit({ auth: `token ${githubToken}` });

// Key 需要经过 base64 编码
const Authorization = `Basic ${Buffer.from(wakatimeApiKey).toString("base64")}`;

// updateGist
export async function updateGist(stats) {
  let gist;
  try {
    gist = await octokit.gists.get({ gist_id: gistId });
  } catch (error) {
    console.error(`Unable to get gist\n${error}`);
  }

  const lines = [];
  for (let i = 0; i < Math.min(stats.data.languages.length, 5); i++) {
    const data = stats.data.languages[i];
    const { name, percent, text: time } = data;

    const line = [
      trimRightStr(name, 10).padEnd(10),
      time.padEnd(14),
      generateBarChart(percent, 21),
      String(percent.toFixed(1)).padStart(5) + "%",
    ];

    lines.push(line.join(" "));

    console.log("lines", lines);
  }

  if (lines.length == 0) return;

  try {
    // Get original filename to update that same file
    const filename = Object.keys(gist.data.files)[0];
    await octokit.gists.update({
      gist_id: gistId,
      files: {
        [filename]: {
          filename: `📊 Weekly development breakdown`,
          content: lines.join("\n"),
        },
      },
    });
  } catch (error) {
    console.error(`Unable to update gist\n${error}`);
  }
}

// 执行主函数
async function main() {
  try {
    const response = await fetch(URL, {
      method: "get",
      headers: {
        Authorization,
      },
      // timeout: 30000,
    });
    const stats = await response.json();
    console.log("请求成功：", stats);
    await updateGist(stats);
    console.log("完成===>");
  } catch (error) {
    console.log("请求失败：", error);
  }
}

(async () => {
  await main();
})();
