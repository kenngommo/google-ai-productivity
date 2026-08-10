const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function launchChrome() {
  return new Promise((resolve) => {
    const args = [
      '--remote-debugging-port=9222',
      '--no-sandbox',
      '--disable-gpu',
      '--window-size=1280,900',
      '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    ];
    const chrome = spawn(CHROME_PATH, args);
    const check = () => {
      http.get('http://localhost:9222/json/version', (res) => {
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => resolve({ chrome, info: JSON.parse(body) }));
      }).on('error', () => setTimeout(check, 500));
    };
    setTimeout(check, 1000);
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

async function debug() {
  console.log('Launching Chrome...');
  const { chrome } = await launchChrome();
  try {
    const targets = await new Promise(res => {
      http.get('http://localhost:9222/json/list', r => {
        let b = ''; r.on('data', c => b += c); r.on('end', () => res(JSON.parse(b)));
      });
    });

    const pageTarget = targets.find(t => t.type === 'page');
    const wsUrl = pageTarget.webSocketDebuggerUrl;

    await sendCDP(wsUrl, 'Page.enable');
    const url = 'https://s.shopee.vn/AAGERM1F2A';
    console.log('Navigating to:', url);
    await sendCDP(wsUrl, 'Page.navigate', { url });

    console.log('Waiting 12 seconds for SPA render...');
    await new Promise(r => setTimeout(r, 12000));

    const evalRes = await sendCDP(wsUrl, 'Runtime.evaluate', {
      expression: `
        (function() {
          return {
            url: window.location.href,
            title: document.title,
            h1: document.querySelector('h1')?.innerText,
            allText: document.body.innerText.substring(0, 500),
            images: Array.from(document.querySelectorAll('img')).map(i => i.src).slice(0, 10),
            scripts: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => s.innerText)
          };
        })()
      `,
      returnByValue: true
    });

    console.log('CDP RESULT:', JSON.stringify(evalRes.result.value, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    chrome.kill();
  }
}

debug();
