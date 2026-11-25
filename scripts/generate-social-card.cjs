const { chromium } = require('playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const types = {'.html':'text/html','.jpg':'image/jpeg','.png':'image/png'};

(async () => {
  const browser = await chromium.launch({executablePath:process.env.TURKEY_CHROMIUM_PATH || undefined,headless:true,args:['--no-sandbox']});
  try {
    const page = await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
    await page.route('http://atlas.test/**', async route => {
      const relative = new URL(route.request().url()).pathname.slice(1);
      await route.fulfill({body:await fs.readFile(path.join(root,relative)),contentType:types[path.extname(relative)] || 'application/octet-stream'});
    });
    await page.goto('http://atlas.test/scripts/social-card.html');
    await page.evaluate(async () => {
      await document.fonts.ready;
      if (!document.fonts.check('112px "Libre Caslon Display"')) throw new Error('Banner font did not load');
      await Promise.all([...document.images].map(image => image.decode()));
      await Promise.all([...document.querySelectorAll('svg image')].map(async node => {
        const image = new Image(); image.src = node.getAttribute('href'); await image.decode();
      }));
    });
    await page.screenshot({path:path.join(root,'assets/social-card-v1.jpg'),type:'jpeg',quality:92});
    console.log('Created assets/social-card-v1.jpg (1200 × 630).');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
