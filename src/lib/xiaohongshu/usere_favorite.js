// src/lib/xiaohongshu/favorites.js
export async function getFavorites(uid) {
  const url = `https://www.xiaohongshu.com/user/profile/${uid}?tab=fav&subTab=note`;
  const response = await fetch(url);
  const html = await response.text();

  // 这里应该使用 HTML 解析库（例如 jsdom）来解析 HTML 并提取所需的数据
  // 以下代码仅作为示例，实际应用中需要替换为正确的解析逻辑
  const items = [
    {
      title: "Example Note Title",
      link: "https://www.example.com/note/123",
      description: "This is an example note description.",
      pubDate: new Date().toUTCString(),
      guid: "https://www.example.com/note/123",
    },
    // 更多条目...
  ];

  return items;
}

// src/route.js
import { getFavorites } from './lib/xiaohongshu/favorites';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.url.startsWith('https://example.com/rss/xiaohongshu/user/favorites/')) {
    const uid = request.url.split('/').pop();
    const items = await getFavorites(uid);

    const data = {
      title: `小红书用户收藏`,
      link: `https://www.xiaohongshu.com/user/profile/${uid}`,
      description: `用户 ${uid} 的小红书收藏`,
      language: 'zh-cn',
      category: 'xiaohongshu',
      items: items,
    };

    // 返回 RSS XML 格式的响应
    return new Response(generateRSS(data), {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }

  // 其他路由...
}

function generateRSS(data) {
  // 生成 RSS XML 格式的字符串
  // 这里使用简单的字符串拼接作为示例
  let rss = '<?xml version="1.0" encoding="UTF-8"?>\n';
  rss += '<rss version="2.0">\n';
  rss += '  <channel>\n';
  rss += `    <title>${data.title}</title>\n`;
  rss += `    <link>${data.link}</link>\n`;
  rss += `    <description>${data.description}</description>\n`;
  rss += `    <language>${data.language}</language>\n`;
  rss += `    <category>${data.category}</category>\n`;
  data.items.forEach(item => {
    rss += '    <item>\n';
    rss += `      <title><![CDATA[${item.title}]]></title>\n`;
    rss += `      <link>${item.link}</link>\n`;
    rss += `      <description><![CDATA[${item.description}]]></description>\n`;
    rss += `      <pubDate>${item.pubDate}</pubDate>\n`;
    rss += `      <guid>${item.guid}</guid>\n`;
    rss += '    </item>\n';
  });
  rss += '  </channel>\n';
  rss += '</rss>\n';

  return rss;
}
