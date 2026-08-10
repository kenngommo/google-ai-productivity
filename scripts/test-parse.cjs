const https = require('https');

const shortLinks = [
  { id: 'AFF-SH-001', notes: 'bộ bàn ghế', link: 'https://s.shopee.vn/AAGERM1F2A' },
  { id: 'AFF-SH-002', notes: 'Ghế Lumini', link: 'https://s.shopee.vn/1VyG7TJToW' },
  { id: 'AFF-SH-003', notes: 'nước giặt ariel', link: 'https://s.shopee.vn/gP97ym6aN' },
  { id: 'AFF-SH-004', notes: 'giấy ăn', link: 'https://s.shopee.vn/9ANhFjQKgp' },
  { id: 'AFF-SH-005', notes: 'sạc dự phòng', link: 'https://s.shopee.vn/8KoaGESUVA' },
];

function fetchUrl(url) {
  return new Promise((resolve) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchUrl(res.headers.location));
      }
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ finalUrl: url, statusCode: res.statusCode, body }));
    }).on('error', err => resolve({ finalUrl: url, statusCode: 500, body: '' }));
  });
}

async function test() {
  for (const item of shortLinks) {
    console.log(`\n=== Testing ${item.id} (${item.notes}) ===`);
    const res = await fetchUrl(item.link);
    console.log('Final URL:', res.finalUrl);
    
    // Extract metadata
    const ogTitleMatch = res.body.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
                         res.body.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
    const ogImgMatch = res.body.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                       res.body.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    
    const priceMatch = res.body.match(/"price":\s*([0-9]+)/) || res.body.match(/"price_min":\s*([0-9]+)/);

    console.log('Title:', ogTitleMatch ? ogTitleMatch[1] : 'NONE');
    console.log('Image:', ogImgMatch ? ogImgMatch[1] : 'NONE');
    console.log('Price:', priceMatch ? priceMatch[1] : 'NONE');
  }
}

test();
