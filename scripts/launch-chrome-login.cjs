/**
 * Shopee Login helper script
 * Spawns a visible Chrome window using the project's temp profile
 * to let the user log in and persist the session.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_PROFILE = path.join(__dirname, 'chrome_temp_profile');

if (!fs.existsSync(TEMP_PROFILE)) {
  fs.mkdirSync(TEMP_PROFILE, { recursive: true });
}

console.log('Launching Chrome with profile:', TEMP_PROFILE);
const args = [
  '--remote-debugging-port=9222',
  `--user-data-dir=${TEMP_PROFILE}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--window-size=1280,900',
  '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
];

// Launch Chrome and direct it to the Shopee login page
const chrome = spawn(CHROME_PATH, [...args, 'https://shopee.vn/buyer/login']);

chrome.on('error', (err) => {
  console.error('Failed to start Chrome:', err);
  process.exit(1);
});

// Automatically exit when the user closes the Chrome window
chrome.on('close', (code) => {
  console.log(`Chrome window closed (exit code ${code}).`);
  rl.close();
  process.exit(0);
});

console.log('\n==================================================');
console.log('👉 Chrome has been launched.');
console.log('👉 Please complete the Shopee login process in the Chrome window.');
console.log('👉 Once logged in, press ENTER here to close Chrome and finish.');
console.log('==================================================\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Press ENTER when you have successfully logged in: ', () => {
  console.log('Closing Chrome...');
  chrome.kill();
  rl.close();
  console.log('Chrome closed successfully.');
  process.exit(0);
});
