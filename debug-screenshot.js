import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

// Capture console messages
page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));

// Capture errors
page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

try {
  console.log('Navigating to http://localhost:5174/...');
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle', timeout: 10000 });
  
  console.log('Waiting 2 seconds for render...');
  await page.waitForTimeout(2000);
  
  console.log('Taking screenshot...');
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  
  // Get page title and HTML
  const title = await page.title();
  const bodyHTML = await page.evaluate(() => document.body.innerHTML);
  
  console.log('Page title:', title);
  console.log('Body has content:', bodyHTML.length > 100);
  console.log('First 500 chars of body:', bodyHTML.substring(0, 500));
  
  console.log('Screenshot saved to screenshot.png');
} catch (err) {
  console.error('Error during screenshot:', err.message);
}

await browser.close();
