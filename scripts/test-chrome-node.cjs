const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const tempDir = path.join(__dirname, 'chrome_temp_profile');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--remote-debugging-port=9222',
  `--user-data-dir=${tempDir}`,
  '--headless=new',
  '--no-first-run',
  '--no-default-browser-check'
]);

chrome.stderr.on('data', d => console.log('CHROME STDERR:', d.toString()));
chrome.stdout.on('data', d => console.log('CHROME STDOUT:', d.toString()));

function check() {
  http.get('http://127.0.0.1:9222/json/version', res => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
      console.log('SUCCESS CONNECTING TO CHROME:', body);
      chrome.kill();
      process.exit(0);
    });
  }).on('error', (err) => {
    console.log('Waiting for Chrome port 9222...');
    setTimeout(check, 500);
  });
}

check();
