import * as THREE from 'three';

/** Small helpers that paint textures on a canvas so the scene needs no image assets. */

function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!] as const;
}

function toTexture(c: HTMLCanvasElement, repeat?: [number, number]) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(...repeat);
  }
  return t;
}

// Deterministic PRNG so the scene looks identical on every load.
export function rng(seed = 7) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function woodTexture(base = '#d8b07c', dark = '#b98d58', vertical = false) {
  const [c, g] = canvas(1024, 512);
  const r = rng(11);
  g.fillStyle = base;
  g.fillRect(0, 0, 1024, 512);
  // Planks
  for (let p = 0; p < 4; p++) {
    g.fillStyle = `rgba(255,255,255,${0.02 + r() * 0.05})`;
    g.fillRect(0, p * 128, 1024, 128);
  }
  // Grain
  for (let i = 0; i < 260; i++) {
    const y = r() * 512;
    g.strokeStyle = dark;
    g.globalAlpha = 0.08 + r() * 0.22;
    g.lineWidth = 0.6 + r() * 1.6;
    g.beginPath();
    g.moveTo(0, y);
    for (let x = 0; x <= 1024; x += 64) g.lineTo(x, y + Math.sin(x / (80 + r() * 60) + i) * (2 + r() * 4));
    g.stroke();
  }
  g.globalAlpha = 1;
  const t = toTexture(c);
  if (vertical) t.rotation = Math.PI / 2;
  return t;
}

export function rugTexture() {
  const [c, g] = canvas(1024, 1024);
  g.clearRect(0, 0, 1024, 1024);
  const rr = (x: number, y: number, w: number, h: number, rad: number) => {
    g.beginPath();
    g.roundRect(x, y, w, h, rad);
  };
  rr(8, 8, 1008, 1008, 40);
  g.fillStyle = '#e3ded6';
  g.fill();
  g.lineWidth = 3;
  g.strokeStyle = '#d2ccc2';
  g.stroke();
  rr(60, 60, 904, 904, 90);
  g.lineWidth = 9;
  g.strokeStyle = '#2b7477';
  g.stroke();
  return toTexture(c);
}

export function labelTexture(lines: { text: string; font: string; color: string; y: number; x?: number; align?: CanvasTextAlign }[], w: number, h: number, bg: string) {
  const [c, g] = canvas(w, h);
  g.fillStyle = bg;
  g.fillRect(0, 0, w, h);
  for (const l of lines) {
    g.font = l.font;
    g.fillStyle = l.color;
    g.textAlign = l.align ?? 'left';
    g.textBaseline = 'middle';
    g.fillText(l.text, l.x ?? 0, l.y);
  }
  return toTexture(c);
}

/** Front face of the monitor's lower bezel with brand text. */
export function bezelTexture(mono: string, name: string) {
  const [c, g] = canvas(1024, 96);
  g.fillStyle = '#34373b';
  g.fillRect(0, 0, 1024, 96);
  g.fillStyle = '#d7dadd';
  g.font = '700 40px Arial, sans-serif';
  g.textBaseline = 'middle';
  g.fillText(mono, 40, 50);
  g.fillRect(118, 30, 2, 40);
  g.font = '400 28px Arial, sans-serif';
  g.letterSpacing = '10px';
  g.fillText(name.toUpperCase(), 140, 52);
  g.letterSpacing = '0px';
  // Control buttons
  for (let i = 0; i < 4; i++) {
    g.fillStyle = '#4a4e53';
    g.fillRect(760 + i * 44, 44, 30, 12);
  }
  g.fillStyle = '#9bd7c8';
  g.fillRect(960, 46, 18, 8);
  return toTexture(c);
}

export function towerFrontTexture() {
  const [c, g] = canvas(256, 512);
  g.fillStyle = '#26282b';
  g.fillRect(0, 0, 256, 512);
  // Drive bays
  g.fillStyle = '#d9dcdf';
  g.fillRect(14, 20, 228, 60);
  g.fillStyle = '#b5b9bd';
  g.fillRect(22, 44, 210, 6);
  g.fillStyle = '#26282b';
  g.fillRect(14, 84, 228, 6);
  // Power ring
  g.strokeStyle = '#3aa6a0';
  g.lineWidth = 6;
  g.beginPath();
  g.arc(128, 170, 26, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = '#121314';
  g.beginPath();
  g.arc(128, 170, 18, 0, Math.PI * 2);
  g.fill();
  // LEDs
  ['#4aa3ff', '#4aa3ff', '#4aa3ff', '#ffb547'].forEach((col, i) => {
    g.fillStyle = col;
    g.fillRect(84 + i * 26, 230, 8, 4);
  });
  // Vents
  g.fillStyle = '#1a1b1d';
  for (let y = 270; y < 490; y += 16) g.fillRect(30, y, 196, 8);
  return toTexture(c);
}

export function matTexture(name: string) {
  const [c, g] = canvas(1024, 384);
  g.fillStyle = '#35575b';
  g.fillRect(0, 0, 1024, 384);
  g.setLineDash([10, 8]);
  g.strokeStyle = '#7ea7a5';
  g.lineWidth = 3;
  g.beginPath();
  g.roundRect(14, 14, 996, 356, 28);
  g.stroke();
  g.setLineDash([]);
  g.fillStyle = '#86b4b0';
  g.font = '700 26px Arial, sans-serif';
  g.letterSpacing = '12px';
  g.textAlign = 'right';
  g.fillText(name.toUpperCase(), 980, 344);
  return toTexture(c);
}

export function spineTexture(label: string, color: string) {
  const [c, g] = canvas(128, 512);
  g.fillStyle = color;
  g.fillRect(0, 0, 128, 512);
  g.fillStyle = '#f4f1ea';
  g.fillRect(18, 120, 92, 300);
  g.strokeStyle = '#ccc6b8';
  g.lineWidth = 2;
  g.strokeRect(24, 126, 80, 288);
  // Finger hole
  g.fillStyle = '#f4f1ea';
  g.beginPath();
  g.arc(64, 62, 22, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#1b1b1b';
  g.beginPath();
  g.arc(64, 62, 15, 0, Math.PI * 2);
  g.fill();
  g.save();
  g.translate(70, 270);
  g.rotate(-Math.PI / 2);
  g.fillStyle = '#2f3b3c';
  g.font = '700 22px Arial, sans-serif';
  g.textAlign = 'center';
  g.letterSpacing = '4px';
  g.fillText(label, 0, 0);
  g.restore();
  g.fillStyle = 'rgba(255,255,255,0.75)';
  g.font = '700 14px Arial, sans-serif';
  g.textAlign = 'center';
  g.fillText('KRISH', 64, 470);
  return toTexture(c);
}

export function mugTexture() {
  const [c, g] = canvas(512, 256);
  g.fillStyle = '#f3f1ec';
  g.fillRect(0, 0, 512, 256);
  g.fillStyle = '#2b7477';
  g.fillRect(0, 0, 512, 22);
  g.font = '700 84px Courier New, monospace';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('{ }', 128, 140);
  return toTexture(c);
}

export function steamTexture() {
  const [c, g] = canvas(64, 128);
  const grd = g.createRadialGradient(32, 64, 2, 32, 64, 30);
  grd.addColorStop(0, 'rgba(255,255,255,0.55)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 128);
  return toTexture(c);
}

export function keyTexture() {
  // Subtle top shading for keycaps.
  const [c, g] = canvas(64, 64);
  const grd = g.createLinearGradient(0, 0, 0, 64);
  grd.addColorStop(0, '#ffffff');
  grd.addColorStop(1, '#d9dde0');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return toTexture(c);
}
