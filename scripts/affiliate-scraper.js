/**
 * GeminiFlow Affiliate Scraper & Price Tracker Engine
 * 
 * Usage:
 *   node scripts/affiliate-scraper.js [--interval 3600] [--sheet-url <URL>]
 * 
 * Environment variables for platform authentication (optional):
 *   SHOPEE_USER, SHOPEE_PASS
 *   TIKTOK_USER, TIKTOK_PASS
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const DB_FILE = path.join(__dirname, '../src/data/affiliate-db.json');
const DEFAULT_INTERVAL_SECONDS = 3600; // Default 1 hour (3600 seconds)

// Sample items if database doesn't exist
const DEFAULT_PRODUCTS = [
  {
    id: 'AFF-SH-001',
    platform: 'Shopee',
    category: 'Công nghệ & Điện tử',
    subCategory: 'Laptop & Máy tính',
    name: 'Dell XPS 13 9320',
    link: 'https://shopee.vn/search?keyword=dell%20xps%2013',
    currentPrice: 32900000,
    highestPrice: 38900000,
    lowestPrice: 31500000,
  },
  {
    id: 'AFF-TT-002',
    platform: 'TikTok',
    category: 'Công nghệ & Điện tử',
    subCategory: 'Tai nghe & Âm thanh',
    name: 'Sony WH-1000XM5',
    link: 'https://www.tiktok.com/search?q=sony%20wh1000xm5',
    currentPrice: 7990000,
    highestPrice: 9490000,
    lowestPrice: 7490000,
  },
];

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading DB file:', err.message);
  }
  return DEFAULT_PRODUCTS;
}

function saveDatabase(data) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    console.log(`[${new Date().toLocaleString()}] Saved updated database to ${DB_FILE}`);
  } catch (err) {
    console.error('Error saving DB file:', err.message);
  }
}

async function loginShopee(page, user, pass) {
  if (!user || !pass) return;
  console.log('Logging in to Shopee...');
  try {
    await page.goto('https://shopee.vn/buyer/login', { waitUntil: 'domcontentloaded' });
    await page.fill('input[name="loginKey"]', user);
    await page.fill('input[name="password"]', pass);
    await page.click('button:has-text("Đăng nhập")');
    await page.waitForTimeout(3000);
  } catch (err) {
    console.warn('Shopee login warning:', err.message);
  }
}

async function loginTikTok(page, user, pass) {
  if (!user || !pass) return;
  console.log('Logging in to TikTok...');
  try {
    await page.goto('https://www.tiktok.com/login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
  } catch (err) {
    console.warn('TikTok login warning:', err.message);
  }
}

async function scrapeProductDetails(browser, product) {
  const page = await browser.newPage();
  console.log(`Scraping [${product.platform}] ${product.name} -> ${product.link}`);

  try {
    await page.goto(product.link, { waitUntil: 'networkidle', timeout: 30000 });

    // Try extracting Open Graph image or platform image selector
    let scrapedImage = await page.evaluate(() => {
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage && ogImage.content) return ogImage.content;
      const img = document.querySelector('img');
      return img ? img.src : null;
    });

    // Try extracting price from page
    let scrapedPriceText = await page.evaluate(() => {
      const priceMeta = document.querySelector('meta[property="product:price:amount"]');
      if (priceMeta) return priceMeta.content;
      const bodyText = document.body.innerText;
      const priceMatch = bodyText.match(/([0-9]{1,3}(\.[0-9]{3})+)\s*₫/);
      return priceMatch ? priceMatch[1] : null;
    });

    let currentPrice = product.currentPrice;
    if (scrapedPriceText) {
      const numericPrice = parseInt(scrapedPriceText.replace(/[^0-9]/g, ''), 10);
      if (numericPrice > 0) currentPrice = numericPrice;
    }

    const nowStr = new Date().toLocaleString('vi-VN');
    const highestPrice = Math.max(product.highestPrice || 0, currentPrice);
    const lowestPrice = product.lowestPrice
      ? Math.min(product.lowestPrice, currentPrice)
      : currentPrice;

    const history = product.priceHistory || [];
    history.push({ timestamp: nowStr, price: currentPrice });

    await page.close();

    return {
      ...product,
      currentPrice,
      highestPrice,
      lowestPrice,
      imageUrl: scrapedImage || product.imageUrl,
      lastUpdated: new Date().toISOString(),
      priceHistory: history,
    };
  } catch (err) {
    console.error(`Failed scraping ${product.id}:`, err.message);
    await page.close();
    return product;
  }
}

async function runScrapeCycle() {
  console.log(`\n==================================================`);
  console.log(`Starting Scrape Cycle at ${new Date().toLocaleString()}`);
  console.log(`==================================================`);

  const db = loadDatabase();
  const browser = await chromium.launch({ headless: true });

  const updatedProducts = [];
  for (const item of db) {
    const updated = await scrapeProductDetails(browser, item);
    updatedProducts.push(updated);
  }

  await browser.close();
  saveDatabase(updatedProducts);
}

// CLI runner
async function main() {
  const args = process.argv.slice(2);
  let intervalSec = DEFAULT_INTERVAL_SECONDS;

  const intervalIdx = args.indexOf('--interval');
  if (intervalIdx !== -1 && args[intervalIdx + 1]) {
    intervalSec = parseInt(args[intervalIdx + 1], 10) || DEFAULT_INTERVAL_SECONDS;
  }

  console.log(`GeminiFlow Affiliate Scraper initialized.`);
  console.log(`Interval set to: ${intervalSec} seconds (${intervalSec / 3600} hour(s)).`);

  // Run initial cycle immediately
  await runScrapeCycle();

  // Schedule recurring runs
  setInterval(async () => {
    await runScrapeCycle();
  }, intervalSec * 1000);
}

if (require.main === module) {
  main();
}
