const http = require('http');
const WebSocket = require('ws');

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

async function debugSingle() {
  console.log('Connecting to Chrome on port 9222...');
  try {
    const targets = await new Promise((res, rej) => {
      http.get('http://127.0.0.1:9222/json/list', r => {
        let b = ''; r.on('data', c => b += c); r.on('end', () => res(JSON.parse(b)));
      }).on('error', rej);
    });

    const pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget) {
      console.error('No page target found! Make sure Chrome is running on port 9222.');
      return;
    }

    const wsUrl = pageTarget.webSocketDebuggerUrl;
    console.log('Using WebSocket URL:', wsUrl);

    // Target Item 3 resolved URL (Nước giặt Ariel)
    const targetUrl = 'https://shopee.vn/product/1597821684/40123212157';
    console.log(`Navigating page to: ${targetUrl}`);
    await sendCDP(wsUrl, 'Page.enable');
    await sendCDP(wsUrl, 'Page.navigate', { url: targetUrl });

    console.log('Waiting 15 seconds for page load...');
    await new Promise(r => setTimeout(r, 15000));

    const evalRes = await sendCDP(wsUrl, 'Runtime.evaluate', {
      expression: `
        (function() {
          const h1 = document.querySelector('h1') || document.querySelector('.V9W2B3') || document.querySelector('._44qnta');
          return {
            url: window.location.href,
            title: document.title,
            h1Text: h1 ? h1.innerText.trim() : null,
            bodyLength: document.body.innerText.length,
            bodySnippet: document.body.innerText.substring(0, 1000)
          };
        })()
      `,
      returnByValue: true
    });

    console.log('DIAGNOSTIC RESULT:', JSON.stringify(evalRes?.result?.value, null, 2));

  } catch (e) {
    console.error('Error during diagnostics:', e.message);
  }
}

debugSingle();
