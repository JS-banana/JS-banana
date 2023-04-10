import feedparser
import httpx
import pathlib
import re

# blog_feed_url = "https://ssscode.com/atom.xml"
# blog_feed_url = "https://serverless-page-bucket-ybyz8f6i-1258454899.cos-website.ap-hongkong.myqcloud.com/atom.xml"
blog_feed_url = "https://js-banana.github.io/blog/atom.xml"
wakatime_raw_url = "https://gist.githubusercontent.com/JS-banana/b4b79e0deb0164edaae772ecbc5bd8bc/raw/"

root = pathlib.Path(__file__).parent.resolve()


def replace_chunk(content, marker, chunk, inline=False):
    r = re.compile(
        r"<!\-\- {} starts \-\->.*<!\-\- {} ends \-\->".format(marker, marker),
        re.DOTALL,
    )
    if not inline:
        chunk = "\n{}\n".format(chunk)
    chunk = "<!-- {} starts -->{}<!-- {} ends -->".format(
        marker, chunk, marker)
    return r.sub(chunk, content)


# 已废弃：读取项目下文件的方案
# def fetch_code_time():
#     timeTxt = root / "packages/wakatime/time.txt"
#     timeTxt_contents = timeTxt.open(encoding='UTF-8').read()
#     return timeTxt_contents

def fetch_code_time():
    return httpx.get(wakatime_raw_url)

# 优化展示长度
def elipisisString(str):
  if len(str) > 18:
    return str[:18] + '...'
  return str

def fetch_blog_entries():
    entries = feedparser.parse(blog_feed_url)["entries"]
    return [
        {
            "title": elipisisString(entry["title"]),
            "url": entry["link"].split("#")[0],
            "published": entry["published"].split("T")[0],
        }
        for entry in entries
    ]


if __name__ == "__main__":
    readme = root / "README.md"
    readme_contents = readme.open(encoding='UTF-8').read()

    code_time_text = "\n```text\n"+fetch_code_time().text+"\n```\n"
    rewritten = replace_chunk(readme_contents, "code_time", code_time_text)

    entries = fetch_blog_entries()[:5]
    entries_md = "\n".join(
        ["* <a href='{url}' target='_blank' title='{title}'>{title}</a> - {published}".format(
            **entry) for entry in entries]
    )
    rewritten = replace_chunk(rewritten, "blog", entries_md)

    readme.open("w", encoding='UTF-8').write(rewritten)
