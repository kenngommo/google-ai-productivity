const { chromium } = require('playwright');

const items = [
  { id: 'AFF-SH-001', notes: 'bộ bàn ghế', link: 'https://s.shopee.vn/AAGERM1F2A' },
  { id: 'AFF-SH-002', notes: 'Ghế Lumini', link: 'https://s.shopee.vn/1VyG7TJToW' },
  { id: 'AFF-SH-003', notes: 'nước giặt ariel', link: 'https://s.shopee.vn/gP97ym6aN' },
  { id: 'AFF-SH-004', notes: 'giấy ăn', link: 'https://s.shopee.vn/9ANhFjQKgp' },
  { id: 'AFF-SH-005', notes: 'sạc dự phòng', link: 'https://s.shopee.vn/8KoaGESUVA' },
];

async function run() {
  console.log('Launching headless browser to inspect real Shopee pages...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    locale: 'vi-VN'
  });

  for (const item of items) {
    const page = await context.newPage();
    console.log(`\nNavigating to ${item.id} (${item.notes})...`);
    try {
      await page.goto(item.link, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(5000); // Allow Shopee SPA to render

      const data = await page.evaluate(() => {
        // 1. Get title
        const titleEl = document.querySelector('h1') || document.querySelector('.V9W2B3') || document.querySelector('title');
        const title = titleEl ? titleEl.innerText.trim() : document.title;

        // 2. Get price
        const priceEl = document.querySelector('.pq6P-N') || document.querySelector('.flex.items-center._2v2vL') || document.querySelector('[class*="price"]');
        const priceText = priceEl ? priceEl.innerText : document.body.innerText;

        // 3. Get Image
        const imgEl = document.querySelector('.flex-1 img') || document.querySelector('img[src*="susercontent.com"]') || document.querySelector('meta[property="og:image"]');
        const image = imgEl ? (imgEl.src || imgEl.content) : null;

        return { title, priceText: priceText ? priceText.substring(0, 200) : '', image, url: window.location.href };
      });

      console.log('REAL DATA:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('Failed to scrape:', e.message);
    }
    await page.close();
  }

  await browser.close();
}

run();
