import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
page.on('pageerror', err => console.log('ERROR:', err.message));

await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 10000 });

// Try to check what the module exports
const moduleCheck = await page.evaluate(async () => {
  try {
    const mod = await import('/src/game/types.ts');
    return {
      exports: Object.keys(mod),
      hasCard: 'Card' in mod,
      cardValue: typeof mod.Card
    };
  } catch (err) {
    return { error: err.message };
  }
});

console.log('Module check result:', JSON.stringify(moduleCheck, null, 2));

await browser.close();
