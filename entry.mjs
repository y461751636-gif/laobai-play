import { readEndpoint, destination } from './route.mjs';

const status = document.querySelector('#status');
const enter = document.querySelector('#enter');
const retry = document.querySelector('#retry');
let redirectTimer;

async function connect() {
  clearTimeout(redirectTimer);
  enter.hidden = retry.hidden = true;
  status.textContent = '正在寻找入口…';
  try {
    const response = await fetch(new URL(`endpoint.json?v=${Date.now()}`, import.meta.url), {
      cache: 'no-store',
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) throw new Error('endpoint unavailable');
    const search = new URLSearchParams(location.search);
    if (document.body.dataset.path) search.set('path', document.body.dataset.path);
    const href = destination(readEndpoint(await response.json()), search.toString(), location.hash);
    enter.href = href;
    enter.hidden = false;
    status.textContent = '已找到入口，正在前往…';
    redirectTimer = setTimeout(() => location.replace(href), 1400);
  } catch {
    status.textContent = '暂时没有连接上，请稍后重新尝试。';
    retry.hidden = false;
  }
}

retry.addEventListener('click', connect);
window.addEventListener('pagehide', () => clearTimeout(redirectTimer));
connect();
