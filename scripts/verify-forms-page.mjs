import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';

const executablePath = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'].find(existsSync);
const browser = await puppeteer.launch({ executablePath, headless: 'new' });
const page = await browser.newPage();
page.on('console', m => { if (['error', 'warning'].includes(m.type())) console.log('[console.' + m.type() + ']', m.text()); });
page.on('requestfailed', r => console.log('[requestfailed]', r.url().slice(0, 120), '-', r.failure()?.errorText));
page.on('response', async r => {
  if (r.url().includes('gviz/tq') && r.url().includes('forms')) console.log('[gviz response]', r.status(), r.url().slice(0, 160));
});
await page.goto('https://ansarschool.in/forms', { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise(r => setTimeout(r, 6000));
const inPageFetch = await page.evaluate(async () => {
  const v = Math.floor(Date.now() / 300000);
  const url = `https://docs.google.com/spreadsheets/d/1ymcRw-HqJfbqcRWa4BXXFzID4prJ20LhrTNK24jpVVE/gviz/tq?tqx=out:json&sheet=forms&v=${v}`;
  try {
    const res = await fetch(url);
    const text = await res.text();
    return { status: res.status, snippet: text.slice(0, 400) };
  } catch (e) {
    return { error: String(e) };
  }
});
console.log('[in-page fetch]', JSON.stringify(inPageFetch));
await browser.close();
