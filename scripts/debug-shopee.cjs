const { spawn } = require('child_process');
const http = require('http');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function launchChromeCDP() {
  return new Promise((resolve) => {
    const chrome = spawn(CHROME_PATH, [
      '--remote-debugging-port=9222',
      '--headless=new',
      '--no-sandbox',
      '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    ]);
    setTimeout(() => resolve(chrome), 2000);
  });
}

function sendCDPCommand(wsUrl, method, params = {}) {
  const WebSocket = require('ws');
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const id = Math.floor(Math.random() * 100000);
    const timer = setTimeout(() => { ws.close(); reject(new Error('timeout')); }, 20000);
    ws.on('open', () => ws.send(JSON.stringify({ id, method, params })));
    ws.on('message', (data) => {
      const msg = JSON.parse(data);
      if (msg.id === id) { clearTimeout(timer); ws.close(); resolve(msg.result); }
    });
    ws.on('error', reject);
  });
}

async function main() {
  const chrome = await launchChromeCDP();
  try {
    const targets = await new Promise(res => {
      http.get('http://localhost:9222/json/list', r => {
        let b = ''; r.on('data', c => b += c); r.on('end', () => res(JSON.parse(b)));
      });
    });

    console.log('TARGETS:', JSON.stringify(targets, null, 2));
    const pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget) {
      console.log('No page target found');
      return;
    }

    const wsUrl = pageTarget.webSocketDebuggerUrl;
    await sendCDPCommand(wsUrl, 'Page.enable');
    console.log('Navigating page to Shopee...');
    await sendCDPCommand(wsUrl, 'Page.navigate', { url: 'https://s.shopee.vn/AAGERM1F2A' });
    
    // Wait 8 seconds for client redirects & DOM load
    await new Promise(r => setTimeout(r, 8000));

    const info = await sendCDPCommand(wsUrl, 'Runtime.evaluate', {
      expression: `JSON.stringify({ url: window.location.href, title: document.title, ogImage: document.querySelector('meta[property="og:image"]')?.content || document.querySelector('img[src*="img.susercontent.com"]')?.src, bodySnippet: document.body.innerText.substring(0, 300) })`
    });

    console.log('\n--- REAL SHOPEE SCRAPED INFO ---');
    console.log(info.result.value);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

main();
