const http = require('http');
const https = require('https');

async function resolveShopeeLink(shortUrl) {
  return new Promise((resolve) => {
    https.get(shortUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
      }
    }, (res) => {
      let location = res.headers.location || shortUrl;
      console.log(`[${res.statusCode}] Short URL: ${shortUrl} -> Location: ${location}`);

      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const titleMatch = body.match(/<title>(.*?)<\/title>/i);
        const ogImageMatch = body.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                             body.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
        const ogTitleMatch = body.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
                             body.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);

        resolve({
          statusCode: res.statusCode,
          location,
          title: ogTitleMatch ? ogTitleMatch[1] : (titleMatch ? titleMatch[1] : null),
          image: ogImageMatch ? ogImageMatch[1] : null,
          bodyLength: body.length
        });
      });
    }).on('error', (err) => {
      resolve({ error: err.message });
    });
  });
}

async function run() {
  const links = [
    'https://s.shopee.vn/AAGERM1F2A',
    'https://s.shopee.vn/1VyG7TJToW',
    'https://s.shopee.vn/gP97ym6aN'
  ];

  for (const link of links) {
    const res = await resolveShopeeLink(link);
    console.log('RESULT:', JSON.stringify(res, null, 2));
  }
}

run();
