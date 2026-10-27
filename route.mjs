export function readEndpoint(value) {
  if (!value || typeof value !== 'object' || value.schema !== 1 || typeof value.origin !== 'string') throw new Error('invalid endpoint');
  const match = /^http:\/\/(\d{1,3}(?:\.\d{1,3}){3}):([1-9]\d{0,4})$/.exec(value.origin);
  if (!match) throw new Error('invalid origin');
  const octets = match[1].split('.').map(Number);
  if (octets.some((n, i) => n > 255 || String(n) !== match[1].split('.')[i])) throw new Error('invalid ip');
  const [a, b] = octets;
  if (a === 0 || a === 10 || a === 127 || a >= 224 || (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127) || (a === 198 && (b === 18 || b === 19)) ||
      Number(match[2]) > 65535) throw new Error('non-public origin');
  return value.origin;
}

export function destination(origin, search = '', hash = '') {
  const path = new URLSearchParams(search).get('path') || '/hub/';
  if (!path.startsWith('/') || path.startsWith('//') || /[\\\u0000-\u0020]/.test(path)) throw new Error('invalid path');
  const target = new URL(path, origin);
  if (target.origin !== origin || !/^\/(?:hub(?:\/|$)|projects\/|videos\/)/.test(target.pathname)) throw new Error('unsupported path');
  if (hash) target.hash = hash;
  return target.href;
}
