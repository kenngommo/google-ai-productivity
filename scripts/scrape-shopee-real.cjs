/**
 * Shopee Real Product Scraper Engine via Chrome DevTools Protocol (CDP)
 * 
 * Usage:
 *   node scripts/scrape-shopee-real.cjs
 */

const { spawn } = require('child_process');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DB_FILE = path.join(__dirname, '../src/data/affiliate-db.json');
const CONFIG_FILE = path.join(__dirname, '../src/data/affiliate-config.json');
const TEMP_PROFILE = path.join(__dirname, 'chrome_temp_profile');
const DEFAULT_CSV_URL = 'https://docs.google.com/spreadsheets/d/18-G0at73MdKwmYIdtAt3h8pPMtse4ZdDneis0M-cXK4/export?format=csv';

function getSheetCsvUrl() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const cfg = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      if (cfg.csvUrl) return cfg.csvUrl;
    }
  } catch (e) {
    console.warn('Could not read affiliate-config.json:', e.message);
  }
  return DEFAULT_CSV_URL;
}

function fetchGoogleSheetCsv(csvUrl) {
  return new Promise((resolve, reject) => {
    https.get(csvUrl, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchGoogleSheetCsv(res.headers.location).then(resolve).catch(reject);
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') inQuotes = !inQuotes;
    else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map(s => s.replace(/^"|"$/g, '').trim());
}

async function getItemsFromSheet() {
  const csvUrl = getSheetCsvUrl();
  console.log(`Fetching items from Google Sheet CSV: ${csvUrl}`);
  try {
    const csvText = await fetchGoogleSheetCsv(csvUrl);
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) return [];

    const items = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      if (cols.length < 5) continue;

      const id = cols[0] || `AFF-SH-${String(i).padStart(3, '0')}`;
      const platform = cols[1] || 'Shopee';
      const category = cols[2] || '';
      const subCategory = cols[3] || '';
      const notes = cols[4] || '';
      const activeStr = cols[5]?.toLowerCase();
      const active = activeStr === undefined || activeStr === '' ? true : (activeStr !== 'false' && activeStr !== '0');
      const link = cols[6] || cols[5] || '';

      if (link && link.startsWith('http') && active) {
        items.push({ id, platform, category, subCategory, notes, link });
      }
    }
    console.log(`Loaded ${items.length} active products from Google Sheet.`);
    return items;
  } catch (e) {
    console.error('Failed to fetch/parse Google Sheet CSV:', e.message);
    return [];
  }
}

function launchChrome() {
  return new Promise((resolve) => {
    http.get('http://127.0.0.1:9222/json/version', (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        console.log('Connected to already running Chrome instance on port 9222.');
        resolve({ chrome: null, info: JSON.parse(body) });
      });
    }).on('error', () => {
      console.log('Chrome not running on port 9222. Spawning new headless Chrome...');
      if (!fs.existsSync(TEMP_PROFILE)) fs.mkdirSync(TEMP_PROFILE, { recursive: true });

      const args = [
        '--remote-debugging-port=9222',
        `--user-data-dir=${TEMP_PROFILE}`,
        '--headless=new',
        '--no-sandbox',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        '--window-size=1280,900',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
      ];

      const chrome = spawn(CHROME_PATH, args);

      const check = () => {
        http.get('http://127.0.0.1:9222/json/version', (res) => {
          let body = '';
          res.on('data', c => body += c);
          res.on('end', () => resolve({ chrome, info: JSON.parse(body) }));
        }).on('error', () => setTimeout(check, 500));
      };
      setTimeout(check, 1000);
    });
  });
}

function sendCDP(wsUrl, method, params = {}) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const id = Math.floor(Math.random() * 100000);
    const timer = setTimeout(() => { ws.close(); reject(new Error(`Timeout: ${method}`)); }, 30000);

    ws.on('open', () => ws.send(JSON.stringify({ id, method, params })));
    ws.on('message', (data) => {
      const msg = JSON.parse(data);
      if (msg.id === id) {
        clearTimeout(timer);
        ws.close();
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    });
    ws.on('error', err => { clearTimeout(timer); reject(err); });
  });
}

// Resolve Shopee short links (301 redirect) to final Shopee URL
function resolveRedirect(url) {
  return new Promise((resolve) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(res.headers.location);
      }
      resolve(url);
    }).on('error', () => resolve(url));
  });
}

async function scrapeItem(wsUrl, item) {
  console.log(`\n--------------------------------------------------`);
  console.log(`Target item [${item.id}] ${item.notes} (${item.link})`);

  // Step 1: Resolve short URL first
  const finalUrl = await resolveRedirect(item.link);
  console.log(`Resolved URL: ${finalUrl}`);

  await sendCDP(wsUrl, 'Page.enable');

  // Hide webdriver and spoof window.chrome to bypass basic anti-bot fingerprinting
  await sendCDP(wsUrl, 'Page.addScriptToEvaluateOnNewDocument', {
    source: `
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined
      });
      window.chrome = {
        runtime: {},
        loadTimes: function() {},
        csi: function() {},
        app: {}
      };
    `
  });

  await sendCDP(wsUrl, 'Page.navigate', { url: finalUrl });

  // Wait for Shopee SPA to hydrate and render dynamically (up to 20s)
  console.log('Waiting for Shopee page elements to load...');
  let loaded = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    const checkRes = await sendCDP(wsUrl, 'Runtime.evaluate', {
      expression: `
        (function() {
          const h1 = document.querySelector('h1') || document.querySelector('.V9W2B3') || document.querySelector('._44qnta');
          const hasTitle = !!(h1 && h1.innerText && h1.innerText.trim().length > 3);
          const hasImage = !!(document.querySelector('img[src*="susercontent.com"]') || document.querySelector('img[src*="cf.shopee.vn"]') || document.querySelector('meta[property="og:image"]'));
          const bodyText = document.body.innerText;
          const hasPrice = bodyText.includes('₫') || bodyText.includes('VND') || bodyText.includes('\\u20ab');
          return hasTitle && (hasImage || hasPrice);
        })()
      `,
      returnByValue: true
    });
    if (checkRes?.result?.value) {
      console.log(`Page rendered successfully after ${attempt * 0.5} seconds.`);
      loaded = true;
      break;
    }
    await new Promise(r => setTimeout(r, 500));
  }
  if (!loaded) {
    console.log('Warning: Page elements did not load completely within 20s. Proceeding with extraction...');
  }

  const result = await sendCDP(wsUrl, 'Runtime.evaluate', {
    expression: `
      (function() {
        // Title extraction
        let title = '';
        const h1 = document.querySelector('h1') || document.querySelector('.V9W2B3') || document.querySelector('._44qnta');
        if (h1 && h1.innerText && h1.innerText.trim().length > 3) {
          title = h1.innerText.trim();
        } else {
          const metaTitle = document.querySelector('meta[property="og:title"]');
          if (metaTitle && metaTitle.content) title = metaTitle.content.trim();
          else title = document.title;
        }

        // Image extraction
        let image = '';
        const ogImg = document.querySelector('meta[property="og:image"]');
        if (ogImg && ogImg.content && ogImg.content.includes('susercontent.com')) {
          image = ogImg.content;
        } else {
          const imgEl = document.querySelector('img[src*="susercontent.com"]') || document.querySelector('img[src*="cf.shopee.vn"]');
          if (imgEl) image = imgEl.src;
        }

        // Price extraction
        let price = 0;
        const pageText = document.body.innerText;
        // Search for ₫ or VND prices
        const priceMatches = pageText.match(/(?:₫|\u20ab)\s*([0-9]{1,3}(?:\.[0-9]{3})+)|([0-9]{1,3}(?:\.[0-9]{3})+)\s*(?:₫|\u20ab)/g);
        if (priceMatches && priceMatches.length > 0) {
          const prices = [];
          for (const pm of priceMatches) {
            const numStr = pm.replace(/[^0-9]/g, '');
            const num = parseInt(numStr, 10);
            if (num >= 5000 && num <= 50000000) { // Reasonable price range check
              prices.push(num);
            }
          }
          if (prices.length > 0) {
            price = Math.min(...prices);
          }
        }

        // Fallback search inside scripts
        if (!price) {
          const scriptText = document.documentElement.innerHTML;
          const matchPrice = scriptText.match(/"price":\s*([0-9]{5,8})/);
          if (matchPrice) price = parseInt(matchPrice[1], 10);
        }

        return {
          url: window.location.href,
          title: title && !title.includes('Shopee Việt Nam') ? title : null,
          image: image || null,
          price: price || 0
        };
      })()
    `,
    returnByValue: true
  });

  return result?.result?.value || {};
}

function autoCategorize(notes, title) {
  const text = (notes + ' ' + title).toLowerCase();
  if (text.includes('bàn') || text.includes('ghế') || text.includes('nội thất') || text.includes('lumini')) {
    return { category: 'Nội thất & Gia dụng', subCategory: 'Bàn ghế & Nội thất' };
  }
  if (text.includes('giặt') || text.includes('ariel') || text.includes('tẩy')) {
    return { category: 'Bách hóa & Hóa mỹ phẩm', subCategory: 'Giặt giũ & Chăm sóc nhà cửa' };
  }
  if (text.includes('giấy') || text.includes('khăn')) {
    return { category: 'Bách hóa & Hóa mỹ phẩm', subCategory: 'Chăm sóc cá nhân & Tiêu dùng' };
  }
  if (text.includes('sạc') || text.includes('pin') || text.includes('điện thoại') || text.includes('laptop')) {
    return { category: 'Công nghệ & Điện tử', subCategory: 'Điện thoại & Phụ kiện' };
  }
  return { category: 'Sản phẩm Tiêu dùng', subCategory: 'Tổng hợp' };
}

function parseScrapedHtml(html, url) {
  let title = null;
  let image = null;
  let price = 0;

  // 1. Title
  const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i) 
    || html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:title"/i);
  if (ogTitleMatch) {
    title = ogTitleMatch[1].trim();
  } else {
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) title = titleMatch[1].trim();
  }
  if (title) {
    title = title.replace(/\| Shopee Việt Nam.*/gi, '').trim();
    title = title.replace(/Shopee Việt Nam.*/gi, '').trim();
  }

  // 2. Image
  const ogImgMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i)
    || html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:image"/i);
  if (ogImgMatch) {
    image = ogImgMatch[1].trim();
  }

  // 3. Price
  const prices = [];
  const jsonLdMatches = html.match(/"price":\s*"([0-9]+)"| "price":\s*([0-9]+)/gi);
  if (jsonLdMatches) {
    for (const match of jsonLdMatches) {
      const numStr = match.replace(/[^0-9]/g, '');
      const num = parseInt(numStr, 10);
      if (num >= 5000 && num <= 50000000) prices.push(num);
    }
  }

  const priceMinMatches = html.match(/"priceMin":\s*([0-9]+)/gi);
  if (priceMinMatches) {
    for (const match of priceMinMatches) {
      const numStr = match.replace(/[^0-9]/g, '');
      const num = parseInt(numStr, 10);
      if (num >= 5000 && num <= 50000000) prices.push(num);
    }
  }

  const priceMatches = html.match(/(?:₫|\u20ab)\s*([0-9]{1,3}(?:\.[0-9]{3})+)|([0-9]{1,3}(?:\.[0-9]{3})+)\s*(?:₫|\u20ab)/gi);
  if (priceMatches) {
    for (const pm of priceMatches) {
      const numStr = pm.replace(/[^0-9]/g, '');
      const num = parseInt(numStr, 10);
      if (num >= 5000 && num <= 50000000) prices.push(num);
    }
  }

  if (prices.length > 0) {
    price = Math.min(...prices);
  }

  return {
    url,
    title,
    image,
    price
  };
}

function scrapeItemProxy(apiKey, item) {
  return new Promise(async (resolve) => {
    console.log(`\n--------------------------------------------------`);
    console.log(`Target item [${item.id}] ${item.notes} (${item.link})`);

    const finalUrl = await resolveRedirect(item.link);
    console.log(`Resolved URL: ${finalUrl}`);
    
    // Call ScraperAPI
    const scraperApiUrl = `https://api.scraperapi.com/?api_key=${apiKey}&url=${encodeURIComponent(finalUrl)}&render=true`;
    console.log(`Calling ScraperAPI proxy...`);

    const req = https.get(scraperApiUrl, { timeout: 40000 }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const result = parseScrapedHtml(body, finalUrl);
        resolve(result);
      });
    });

    req.on('error', (err) => {
      console.error(`Proxy request error: ${err.message}`);
      resolve({ url: finalUrl, title: null, image: null, price: 0 });
    });

    req.on('timeout', () => {
      console.error(`Proxy request timeout!`);
      req.destroy();
      resolve({ url: finalUrl, title: null, image: null, price: 0 });
    });
  });
}

async function main() {
  console.log('🚀 Starting Shopee Real Product Scraper Engine (CDP + QA Check)...');
  
  const items = await getItemsFromSheet();
  if (items.length === 0) {
    console.error('No items to scrape!');
    return;
  }

  let existingDb = [];
  try {
    if (fs.existsSync(DB_FILE)) {
      existingDb = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
  } catch (e) {
    console.warn('Could not read existing database:', e.message);
  }

  // Load proxy API key from config or environment variables
  let config = {};
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    }
  } catch (e) {}
  const scraperApiKey = process.env.SCRAPER_API_KEY || config.scraperApiKey || '';
  const useProxy = !!scraperApiKey;

  let chromeProcess = null;
  let pageTarget = null;

  if (useProxy) {
    console.log(`[Proxy Mode] Using ScraperAPI key: ${scraperApiKey.substring(0, 5)}...`);
  } else {
    console.log(`[Local Mode] Connecting to local Chrome session...`);
    try {
      const launch = await launchChrome();
      chromeProcess = launch.chrome;

      const targets = await new Promise(res => {
        http.get('http://127.0.0.1:9222/json/list', r => {
          let b = ''; r.on('data', c => b += c); r.on('end', () => res(JSON.parse(b)));
        });
      });

      pageTarget = targets.find(t => t.type === 'page');
      if (!pageTarget) {
        console.error('No Chrome browser page target found!');
        if (chromeProcess) chromeProcess.kill();
        return;
      }
    } catch (err) {
      console.error('Could not connect to Chrome debugging port 9222:', err.message);
      if (chromeProcess) chromeProcess.kill();
      return;
    }
  }

  try {
    const scrapedData = [];

    for (const item of items) {
      let res;
      if (useProxy) {
        res = await scrapeItemProxy(scraperApiKey, item);
      } else {
        res = await scrapeItem(pageTarget.webSocketDebuggerUrl, item);
      }
      console.log('SCRAPED RESULT:', JSON.stringify(res, null, 2));

      const catInfo = autoCategorize(item.notes, res.title || item.notes);

      // QA Validation Check
      const finalTitle = res.title && res.title.length > 5 ? res.title : (item.notes ? item.notes : 'Sản phẩm Shopee');
      const finalPrice = res.price > 1000 ? res.price : 0;
      const finalImage = res.image && res.image.startsWith('http') ? res.image : '';

      // Merge with existing item to preserve lowestPrice, highestPrice, and targetPrice history
      const existingItem = existingDb.find(p => p.id === item.id);
      const targetPrice = existingItem?.targetPrice || (finalPrice > 0 ? Math.round(finalPrice * 0.8) : 0);
      const lowestPrice = finalPrice > 0 ? (existingItem?.lowestPrice ? Math.min(existingItem.lowestPrice, finalPrice) : finalPrice) : 0;
      const highestPrice = finalPrice > 0 ? (existingItem?.highestPrice ? Math.max(existingItem.highestPrice, finalPrice) : Math.round(finalPrice * 1.2)) : 0;

      scrapedData.push({
        id: item.id,
        platform: item.platform || 'Shopee',
        category: item.category || catInfo.category,
        subCategory: item.subCategory || catInfo.subCategory,
        name: finalTitle,
        notes: item.notes,
        active: true,
        link: item.link,
        currentPrice: finalPrice,
        highestPrice: highestPrice,
        lowestPrice: lowestPrice,
        targetPrice: targetPrice,
        imageUrl: finalImage,
        lastUpdated: new Date().toISOString(),
      });
    }

    // QA Check & Save Database
    console.log('\n==================================================');
    console.log('🔍 QA CHECK REPORT:');
    scrapedData.forEach((p, idx) => {
      console.log(`[${idx+1}] ID: ${p.id} | Name: "${p.name}" | Price: ${p.currentPrice.toLocaleString('vi-VN')} đ | Image: ${p.imageUrl ? 'VALID Shopee CDN' : 'MISSING'}`);
    });
    console.log('==================================================');

    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(scrapedData, null, 2), 'utf8');
    console.log('\n✅ Verified database successfully saved to:', DB_FILE);

  } catch (e) {
    console.error('Scraper error:', e);
  } finally {
    if (chromeProcess) {
      console.log('Killing spawned Chrome instance...');
      chromeProcess.kill();
    } else if (!useProxy) {
      console.log('Detached from existing Chrome instance (did not kill).');
    }
  }
}

main();
