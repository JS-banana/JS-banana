// 获取环境变量
import dotenv from "dotenv";
dotenv.config();
// fetch
import fetch from "node-fetch";
import { updateGist } from "./util.js";

// 常量
// https://wakatime.com/developers
const URL = "https://wakatime.com/api/v1/users/current/stats/last_7_days";
const { GIST_ID: gistId, GH_TOKEN: githubToken, WAKATIME_API_KEY: wakatimeApiKey } = process.env;

// Key 需要经过 base64 编码
const Authorization = `Basic ${Buffer.from(wakatimeApiKey).toString("base64")}`;

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
  } catch (error) {
    console.log("请求失败：", error);
  }
  console.log("updateGist===>");
  await updateGist(stats, gistId, githubToken);
  console.log("完成===>");
}

(async () => {
  await main();
})();
