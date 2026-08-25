const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const SIZE = 81;
const dir = path.join(__dirname, '../src/static/tab');
fs.mkdirSync(dir, { recursive: true });

function createBuffer() {
  return new Uint8Array(SIZE * SIZE * 4);
}

function setPixel(buf, x, y, [r, g, b, a = 255]) {
  if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return;
  const i = (y * SIZE + x) * 4;
  if (a === 255) {
    buf[i] = r;
    buf[i + 1] = g;
    buf[i + 2] = b;
    buf[i + 3] = a;
    return;
  }
  const alpha = a / 255;
  buf[i] = Math.round(buf[i] * (1 - alpha) + r * alpha);
  buf[i + 1] = Math.round(buf[i + 1] * (1 - alpha) + g * alpha);
  buf[i + 2] = Math.round(buf[i + 2] * (1 - alpha) + b * alpha);
  buf[i + 3] = Math.round(buf[i + 3] * (1 - alpha) + a);
}

function fillRect(buf, x, y, w, h, color) {
  for (let py = y; py < y + h; py++) {
    for (let px = x; px < x + w; px++) setPixel(buf, px, py, color);
  }
}

function fillCircle(buf, cx, cy, radius, color) {
  for (let y = cy - radius; y <= cy + radius; y++) {
    for (let x = cx - radius; x <= cx + radius; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= radius * radius) setPixel(buf, x, y, color);
    }
  }
}

function strokeRect(buf, x, y, w, h, color, t = 3) {
  fillRect(buf, x, y, w, t, color);
  fillRect(buf, x, y + h - t, w, t, color);
  fillRect(buf, x, y, t, h, color);
  fillRect(buf, x + w - t, y, t, h, color);
}

function drawHome(buf, color) {
  const c = [...color, 255];
  for (let y = 22; y <= 34; y++) {
    const progress = (y - 22) / 12;
    const half = Math.round(18 * progress);
    for (let x = 40 - half; x <= 40 + half; x++) setPixel(buf, x, y, c);
  }
  fillRect(buf, 24, 34, 32, 24, c);
  fillRect(buf, 35, 44, 10, 14, [255, 255, 255, 255]);
}

function drawGrid(buf, color) {
  const c = [...color, 255];
  const gap = 6;
  const box = 18;
  const startX = 16;
  const startY = 18;
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      const x = startX + col * (box + gap);
      const y = startY + row * (box + gap);
      fillRect(buf, x, y, box, box, c);
    }
  }
}

function drawCalendar(buf, color) {
  const c = [...color, 255];
  fillRect(buf, 18, 24, 45, 36, c);
  fillRect(buf, 18, 24, 45, 10, c);
  fillRect(buf, 18, 32, 45, 4, [255, 255, 255, 255]);
  fillRect(buf, 28, 18, 5, 10, c);
  fillRect(buf, 48, 18, 5, 10, c);
  fillRect(buf, 24, 42, 33, 3, [255, 255, 255, 220]);
  fillRect(buf, 24, 50, 24, 3, [255, 255, 255, 220]);
}

function drawAccount(buf, color) {
  const c = [...color, 255];
  fillCircle(buf, 40, 28, 10, c);
  fillRect(buf, 24, 40, 32, 20, c);
  for (let y = 40; y < 60; y++) {
    const shrink = Math.floor((y - 40) * 0.6);
    for (let x = 24 + shrink; x < 56 - shrink; x++) setPixel(buf, x, y, c);
  }
}

const drawers = {
  home: drawHome,
  course: drawGrid,
  booking: drawCalendar,
  profile: drawAccount,
};

function createPng(drawKey, color) {
  const buf = createBuffer();
  drawers[drawKey](buf, color);
  const raw = [];
  for (let y = 0; y < SIZE; y++) {
    raw.push(0);
    for (let x = 0; x < SIZE; x++) {
      const i = (y * SIZE + x) * 4;
      raw.push(buf[i], buf[i + 1], buf[i + 2], buf[i + 3]);
    }
  }
  const compressed = zlib.deflateSync(Buffer.from(raw));

  function crc32(data) {
    let c = 0xffffffff;
    const table = [];
    for (let n = 0; n < 256; n++) {
      let cv = n;
      for (let k = 0; k < 8; k++) cv = cv & 1 ? 0xedb88320 ^ (cv >>> 1) : cv >>> 1;
      table[n] = cv;
    }
    for (let i = 0; i < data.length; i++) c = table[(c ^ data[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const t = Buffer.from(type);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
    return Buffer.concat([len, t, data, crc]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(SIZE, 0);
  ihdr.writeUInt32BE(SIZE, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', compressed), chunk('IEND', Buffer.alloc(0))]);
}

const GRAY = [138, 148, 166];
const BLUE = [40, 120, 255];

Object.keys(drawers).forEach((name) => {
  fs.writeFileSync(path.join(dir, `${name}.png`), createPng(name, GRAY));
  fs.writeFileSync(path.join(dir, `${name}-active.png`), createPng(name, BLUE));
});

console.log('Tab icons generated:', dir);
