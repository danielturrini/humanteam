#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const pieces = [
  { file: 'display-frente.html', out: 'display-institucional-frente.png', w: 1240, h: 1754 },
  { file: 'display-verso.html', out: 'display-institucional-verso.png', w: 1240, h: 1754 },
  { file: 'cartao-frente.html', out: 'cartao-escola-coluna-frente.png', w: 591, h: 1063 },
  { file: 'cartao-verso.html', out: 'cartao-escola-coluna-verso.png', w: 591, h: 1063 },
  { file: 'cartao-digital.html', out: 'cartao-escola-coluna-digital.png', w: 1080, h: 1350 },
];

const srcDir = process.argv[2];
const destDir = process.argv[3];

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/opt/pw-browsers/chromium',
  });
  const page = await browser.newPage();
  for (const p of pieces) {
    await page.setViewportSize({ width: p.w, height: p.h });
    await page.goto(`file://${path.join(srcDir, p.file)}`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(destDir, p.out) });
    console.log('rendered', p.out);
  }
  await browser.close();
})();
