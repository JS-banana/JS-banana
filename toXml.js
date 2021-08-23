const fs =require("fs")
const path = require("path");
const rp = require("request-promise");
const cheerio = require("cheerio");

const main=async ()=>{
    const URL="https://ssscode.com/"
    const res = await rp(URL);

    const $ = cheerio.load(res);
    const currentList = $("#app .main-left .post-list .title-wrapper");

    let list = [];

    currentList.each((index, el) => {
        list.push({
            title: $(el).find("h2 a").text(),
            url: $(el).find("h2 a").attr("href"),
            date: $(el).find(".article-info .icon-riqi").text(),
        })
    })

    console.log(list)
    toXml(list)
}


/**
 * 根据文章内容生成 XML 网站地图
 * @param {Array} posts 按时间排序之后的文章数据
 */

function  toXml(posts) {
  const feed = `
  <feed xmlns="http://www.w3.org/2005/Atom">
    <title>小帅の技术博客</title>
    <link href="https://ssscode.com/atom.xml" rel="self"/>
    <link href="https://ssscode.com/"/>
    <updated>2021-08-22T08:34:00.358Z</updated>
    <id>https://ssscode.com/</id>
    <author>
      <name>JS-banana</name>
      <email>sss213018@163.com</email>
    </author>
    ${posts
      .map((item) => {
        return `
        <entry>
          <title>${item.title}</title>
          <link href="https://ssscode.com${item.url}" />
          <id>https://ssscode.com${item.url}</id>
          <published>${item.date}</published>
          <update>${item.date}</update>
        </entry>`;
      })
      .join('\n')}
  </feed>
  `;

  fs.writeFile(path.resolve(__dirname,'./atom.xml'), feed,function(err){
      if(err) console.log(err);
      console.log("文件写入成功！")

  });

  
}

main()
