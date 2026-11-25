const { chromium } = require('playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const base = 'http://atlas.test/presidential_turkeys/';
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.jpg':'image/jpeg'};
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.TURKEY_CHROMIUM_PATH || undefined,headless:true,args:['--no-sandbox']});
 try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}}); const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('http://atlas.test/**',async route=>{const relative=new URL(route.request().url()).pathname.replace(/^\/presidential_turkeys\//,'')||'index.html';try{await route.fulfill({body:await fs.readFile(path.join(root,relative)),contentType:types[path.extname(relative)]||'text/plain'});}catch{await route.fulfill({status:404,body:'missing'});}});
 async function escapeProfile() {
  await page.evaluate(()=>{window.profileClosed=new Promise(resolve=>document.querySelector('#profile').addEventListener('close',()=>resolve(),{once:true}));});
  await page.keyboard.press('Escape');
  await page.evaluate(()=>window.profileClosed);
 }
 await page.goto(base);await page.waitForFunction(()=>document.querySelectorAll('.turkey-card').length===38);
 await page.locator('a[href="#year-2024"].card-link').hover();
 assert.equal(await page.locator('#selection-name').textContent(),'Peach & Blossom');
 await page.locator('a[href="#year-2023"].card-link').focus();
 assert.equal(await page.locator('#selection-name').textContent(),'Liberty & Bell');
 await page.locator('a[href="#year-2024"].card-link').click();
 await page.waitForFunction(()=>document.querySelector('#profile').open);
 assert.equal(await page.locator('#profile-title').textContent(),'Peach & Blossom');
 await escapeProfile();
 assert.equal(await page.locator('#profile').evaluate(el=>el.open),false);
 assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('href')),'#year-2024');
 await page.locator('#search').fill('  BLOSSOM minnesota  ');
 assert.equal(await page.locator('.turkey-card').count(),1);
 await page.locator('[data-decade="1990"]').click();
 assert.equal(await page.locator('.turkey-card').count(),0);
 await page.locator('#reset').click();
 assert.equal(await page.locator('.turkey-card').count(),38);
 await page.goto(base+'#year-1989');await page.waitForFunction(()=>document.querySelector('#profile').open);
 assert.equal(await page.locator('#profile-title').textContent(),'Unnamed');
 await escapeProfile();
 for(const width of [320,375,768,1024,1440]) {await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width,`Overflow ${width}`);}
 for (const year of [1989,1993,1996,2000,2013]) {
  await page.goto(base+'#year-'+year);await page.waitForFunction(()=>document.querySelector('#profile').open);
  const photo=page.locator('.profile-photo');
  assert.equal(await photo.count(),1,`Missing recovered image for ${year}`);
  await photo.evaluate(img=>img.decode());
  assert.ok(await photo.evaluate(img=>img.naturalWidth>0));
  await escapeProfile();
 }
 for (const year of [1994,1995,1997]) {
  await page.locator(`.card-link[data-year="${year}"]`).focus();
  assert.equal(await page.locator('#selection-photo [role="img"]').count(),1,`Missing screenshot preview for ${year}`);
  await page.locator(`.card-link[data-year="${year}"]`).click();
  await page.waitForFunction(()=>document.querySelector('#profile').open);
  const photo=page.locator('.profile-visual [role="img"]');
  assert.equal(await photo.count(),1);
  assert.match(await photo.getAttribute('aria-label'),/turkey/i);
  await photo.locator('image').evaluate(async node=>{const image=new Image();image.src=node.getAttribute('href');await image.decode();});
  await page.locator('.profile-sources summary').click();
  const source=page.getByRole('link',{name:'Video source'});
  assert.match(await source.getAttribute('href'),/^https:\/\/www\.youtube\.com\/watch\?v=/);
  await escapeProfile();
 }
 assert.equal(await page.locator('.card-link .no-photo, .card-link .archive-film').count(),0,'Every year has a portrait');
 await page.setViewportSize({width:1440,height:1000});await page.locator('a[href="#year-2024"].card-link').hover();
 await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});


 assert.deepEqual(errors,[]);console.log('PASS: hover/focus preview, click, Escape/focus restoration, combined search/decade, reset, direct links, recovered image decoding, supplied screenshot portraits and film credits, responsive widths, no page errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
